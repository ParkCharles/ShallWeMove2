/**
 * Utility functions for creating and handling Sui blockchain transactions
 */
import { Transaction } from '@mysten/sui/transactions'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { EnokiFlow } from '@mysten/enoki'
import { toBase64, fromBase64 } from '@mysten/bcs'
import dayjs from 'dayjs'
import { Auth } from '@/utils/auth'

// SuiClient 인스턴스 생성
export const client = new SuiClient({ 
  url: getFullnodeUrl('testnet')
});

interface MintNftParams {
  location: string;
  description: string;
  imageUrl: string;
  participants: number;
  maxElevation: number;
  duration: number;
  date: number;
  startTime: number;
  endTime: number;
}

export const createAndExecuteMintNftTransaction = async (
  enokiFlow: EnokiFlow,
  params: MintNftParams
): Promise<Transaction> => {
  try {
    // 1. Check authentication and get wallet address
    if (!Auth.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const walletAddress = Auth.walletAddress();
    if (!walletAddress) {
      throw new Error('Wallet address not found');
    }

    console.log('Wallet Address:', walletAddress); // 로그 추가

    // 2. Create transaction block
    const tx = new Transaction();

    // Log the params to check if they are being passed correctly
    console.log('Transaction Params:', params); // 로그 추가

    // 3. Add move call
    tx.moveCall({
      target: `${import.meta.env.VITE_PACKAGE_ID}::shallwemove::mint`,
      arguments: [
        tx.pure.string(params.location),
        tx.pure.string(params.description),
        tx.pure.string(params.imageUrl),
        tx.pure.u16(params.participants),
        tx.pure.u16(params.maxElevation),
        tx.pure.u16(params.duration),
        tx.pure.string(dayjs.unix(params.date).format('YYYY-MM-DD')),
        tx.pure.string(dayjs.unix(params.startTime).format('HH:mm')),
        tx.pure.string(dayjs.unix(params.endTime).format('HH:mm'))
      ]
    });

    console.log('Transaction after moveCall:', tx); // 로그 추가 (moveCall 이후 상태)

    // 4. Build transaction bytes
    const txBytes = await tx.build({ 
      client, 
      onlyTransactionKind: true 
    });

    console.log('Transaction Bytes:', txBytes); // 로그 추가

    // 5. Get keypair and sign transaction
    let keypair;

    try {
      console.log('🔒 Generating proof...');
      const proof = await enokiFlow.getProof({ network: 'testnet' });
      if (!proof) {
        throw new Error('Failed to generate proof');
      }
      console.log('✅ Proof generated successfully');

      // EnokiFlow에서 사용자 키페어를 가져옵니다.
      console.log('🔑 Getting keypair...');
      keypair = await enokiFlow.getKeypair({ network: 'testnet' });
      
      // 키페어가 없으면 오류를 던집니다.
      if (!keypair) {
        throw new Error('Failed to get keypair');
      }

      console.log('✅ Keypair retrieved successfully');
    } catch (error) {
      console.error('❌ Error in auth process:', error);
      if (error instanceof Error && error.message.includes('network is not enabled')) {
        throw new Error('API key is not configured for testnet. Please check Enoki Portal settings.');
      }
      throw new Error('Failed to retrieve keypair');
    }

    // 6. Request sponsored transaction
    let sponsored;
    try {
      const response = await fetch('/sponsor', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionKindBytes: toBase64(txBytes),
          sender: walletAddress,
          allowedAddresses: [walletAddress],
          network: 'testnet',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sponsored transaction: ${response.statusText}`);
      }

      sponsored = await response.json();
      console.log('Sponsored Transaction:', sponsored);

      if (!sponsored || !sponsored.bytes) {
        throw new Error('Sponsored transaction response is invalid');
      }
    } catch (error) {
      console.error('Error in sponsored transaction request:', error);
      throw new Error('Failed to obtain sponsored transaction');
    }

    // 7. Sign the sponsored transaction
    let signature; // 🔥 마찬가지로 try 블록 밖에서 선언

    try {
      console.log('Signing transaction with keypair...');
      signature = await keypair.signTransaction(fromBase64(sponsored.bytes));

      if (!signature) {
        throw new Error('Failed to sign transaction');
      }

      console.log('Transaction Signature:', signature);
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw new Error('Transaction signing failed');
    }

    // 8. Execute the sponsored transaction
    const result = await fetch('/api/execute/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        digest: sponsored.digest,
        signature: signature.signature,
      }),
    });

    if (!result.ok) {
      throw new Error('Failed to execute transaction');
    }

    console.log('Transaction Execution Result:', result); // 로그 추가

    return tx;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in createAndExecuteMintNftTransaction:', error.message);
      throw new Error(`Mint NFT transaction failed: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
      throw new Error('Mint NFT transaction failed: Unknown error');
    }
  }
};

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerUrl(objectId: string): string {
  return `https://suiscan.xyz/testnet/object/${objectId}/fields`;
}