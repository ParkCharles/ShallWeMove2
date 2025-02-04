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

export async function POST(request: Request) {
  try {
    const { txBytes, sender, jwt } = await request.json();

    // Basic validation
    if (!jwt || !sender) {
      return NextResponse.json(
        { error: 'JWT token and sender address are required' },
        { status: 401 }
      );
    }
    
    // 1. Prepare transaction
    const tx = Transaction.fromKind(fromBase64(txBytes));
    tx.setSender(sender);

    // 2. Set gas configuration
    const gasPrice = await client.getReferenceGasPrice();
    tx.setGasPrice(gasPrice);

    // 3. Build transaction
    const builtTxBytes = await tx.build({ client });

    // 4. Sign transaction with sponsor's keypair
    const { signature: sponsorSignature } = await sponsorKeypair.signTransaction(builtTxBytes);

    // 5. Execute transaction
    const result = await client.executeTransactionBlock({
      transactionBlock: builtTxBytes,
      signature: sponsorSignature,
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