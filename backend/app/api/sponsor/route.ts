import { NextResponse } from 'next/server';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromHex, fromBase64 } from '@mysten/sui/utils';

// Initialize Sui client
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Create sponsor keypair using hex private key
const sponsorKeypair = Ed25519Keypair.fromSecretKey(
  fromHex(process.env.SPONSOR_PRIVATE_KEY!)
);

const sponsorAddress = process.env.SPONSOR_ADDRESS!;

export async function POST(request: Request) {
  try {
    const { txBytes, sender, jwt, userSignature } = await request.json(); // userSignature 추가

    // Basic validation
    if (!jwt || !sender || !userSignature) {
      return NextResponse.json(
        { error: 'JWT token, sender address, and user signature are required' },
        { status: 401 }
      );
    }
    
    // Check sponsor's gas balance and get coin object details
    const coins = await client.getCoins({
      owner: sponsorAddress,
      coinType: '0x2::sui::SUI'
    });

    if (!coins.data.length) {
      return NextResponse.json(
        { error: 'Sponsor account has no SUI coins for gas' },
        { status: 400 }
      );
    }

    // Get full coin object details
    const coinObject = await client.getObject({
      id: coins.data[0].coinObjectId,
      options: { showContent: true }
    });
    
    // 1. Prepare transaction
    const tx = Transaction.fromKind(fromBase64(txBytes));
    tx.setSender(sender);

    // 2. Set gas configuration
    const gasPrice = await client.getReferenceGasPrice();
    tx.setGasPrice(gasPrice);

    // Set gas payment with complete ObjectRef
    tx.setGasPayment([{
      objectId: coins.data[0].coinObjectId,
      version: coinObject.data?.version!,
      digest: coinObject.data?.digest!
    }]);

    // 3. Build transaction
    const builtTxBytes = await tx.build({ client });

    // 4. Sign transaction with sponsor's keypair
    const { signature: sponsorSignature } = await sponsorKeypair.signTransaction(builtTxBytes);

    // 5. Execute transaction with both signatures
    const result = await client.executeTransactionBlock({
      transactionBlock: builtTxBytes,
      signature: [userSignature, sponsorSignature], // 두 서명 모두 포함
      requestType: 'WaitForLocalExecution',
      options: {
        showEffects: true,
        showEvents: true,
      },
    });

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Sponsor API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}