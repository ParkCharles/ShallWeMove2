/**
 * Utility functions for creating and handling Sui blockchain transactions
 */
import { Transaction } from '@mysten/sui/transactions'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Auth } from './auth'
import { toBase64 } from '@mysten/sui/utils';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;

// Initialize Sui client
export const client = new SuiClient({ url: getFullnodeUrl('testnet') });

interface MintNftParams {
  location: string;
  description: string;
  imageUrl: string;
  participants: number;
  maxElevation: number;
  duration: number;
  date: string;
  startTime: string;
  endTime: string;
}

export async function createAndExecuteMintNftTransaction(params: MintNftParams) {
  try {
    // Create transaction
    const tx = new Transaction();
    
    // Add mint NFT call
    tx.moveCall({
      target: `${PACKAGE_ID}::shallwemove::mint`,
      arguments: [
        tx.pure.string(params.location),
        tx.pure.string(params.description),
        tx.pure.string(params.imageUrl),
        tx.pure.u16(params.participants),
        tx.pure.u16(params.maxElevation),
        tx.pure.u16(params.duration),
        tx.pure.string(params.date),
        tx.pure.string(params.startTime),
        tx.pure.string(params.endTime)
      ]
    });

    // Build transaction kindbytes
    const kindBytes = await tx.build({ 
      client,
      onlyTransactionKind: true
    });

    // Send to backend for processing
    const response = await fetch('/api/sponsor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        txBytes: toBase64(kindBytes),
        sender: Auth.walletAddress(),
        jwt: Auth.jwt()
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to get sponsored transaction: ${error}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}