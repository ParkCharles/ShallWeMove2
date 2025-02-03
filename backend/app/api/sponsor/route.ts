import { NextResponse } from 'next/server';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { fromBase64 } from '@mysten/sui/utils';

// 환경변수 디버깅
console.log('=== Route Environment Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SPONSOR_PRIVATE_KEY exists:', !!process.env.SPONSOR_PRIVATE_KEY);
if (process.env.SPONSOR_PRIVATE_KEY) {
  console.log('SPONSOR_PRIVATE_KEY value:', {
    length: process.env.SPONSOR_PRIVATE_KEY.length,
    prefix: process.env.SPONSOR_PRIVATE_KEY.substring(0, 8) + '...',
  });
}
console.log('=== End Environment Check ===');

const sponsorKey = process.env.SPONSOR_PRIVATE_KEY;
if (!sponsorKey) {
  throw new Error('SPONSOR_PRIVATE_KEY is not set');
}

// Extract the base64 part after 'suiprivkey'
const base64Key = sponsorKey.startsWith('suiprivkey') ? 
  sponsorKey.split('1')[1] : 
  sponsorKey;

const client = new SuiClient({ url: getFullnodeUrl('testnet') });
const keypair = Ed25519Keypair.fromSecretKey(fromBase64(base64Key));

export async function POST(request: Request) {
  try {
    const { txBytes: base64TxBytes, sender } = await request.json();

    // Convert base64 to Uint8Array
    const txBytes = Uint8Array.from(atob(base64TxBytes), c => c.charCodeAt(0));

    // Create transaction from bytes
    const tx = Transaction.from(txBytes);

    // Set gas owner to sponsor
    tx.setGasOwner(keypair.getPublicKey().toSuiAddress());
    
    // Build sponsored transaction
    const sponsoredTxBytes = await tx.build({ client });

    // Sign the transaction with sponsor's key
    const signature = await keypair.signTransaction(sponsoredTxBytes);

    // Convert sponsored transaction bytes to base64
    const base64SponsoredTxBytes = btoa(String.fromCharCode.apply(null, Array.from(sponsoredTxBytes)));

    return NextResponse.json({
      sponsoredTxBytes: base64SponsoredTxBytes,
      signature
    });
  } catch (error) {
    console.error('Sponsor API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 