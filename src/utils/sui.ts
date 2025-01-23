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

    // 2. Create transaction block
    const tx = new Transaction();
    
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

    // 4. Build transaction bytes
    const txBytes = await tx.build({ 
      client, 
      onlyTransactionKind: true 
    });

    // 5. Get keypair and sign transaction
    const keypair = await enokiFlow.getKeypair();
    if (!keypair) {
      throw new Error('Failed to get keypair');
    }

    // 6. Request sponsored transaction
    const sponsored = await fetch(`${import.meta.env.VITE_API_URL}/sponsored-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionKindBytes: toBase64(txBytes),
      }),
    }).then(res => res.json());

    // 7. Sign the sponsored transaction
    const signature = await keypair.signTransaction(fromBase64(sponsored.bytes));
    if (!signature) {
      throw new Error('Failed to sign transaction');
    }

    // 8. Execute the sponsored transaction
    const result = await fetch(`${import.meta.env.VITE_API_URL}/execute-transaction`, {
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

    return tx;
  } catch (error) {
    console.error('Error in createAndExecuteMintNftTransaction:', error);
    throw error;
  }
}

export const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerUrl(objectId: string): string {
  return `https://suiscan.xyz/testnet/object/${objectId}/fields`;
}