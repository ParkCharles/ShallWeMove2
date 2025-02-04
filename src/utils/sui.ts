/**
 * Utility functions for creating and handling Sui blockchain transactions
 */
import { Transaction } from '@mysten/sui/transactions'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Auth } from './auth'
import { toBase64 } from '@mysten/sui/utils';
import { genAddressSeed, getZkLoginSignature } from '@mysten/sui/zklogin';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
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
    // 1. Create transaction
    console.log('1. Starting transaction creation...');
    const tx = new Transaction();
    tx.setSender(Auth.walletAddress());
    console.log('Sender address:', Auth.walletAddress());
    
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

    console.log('2. Building transaction kindbytes...');
    const kindBytes = await tx.build({ 
      client,
      onlyTransactionKind: true
    });
    console.log('Transaction kindbytes built');

    console.log('3. Getting stored zkLogin proof...');
    const partialZkLoginSignature = JSON.parse(sessionStorage.getItem('zk_proof')!);
    console.log('Partial zkLogin signature:', partialZkLoginSignature);
    
    const ephemeralPrivateKey = sessionStorage.getItem('ephemeral_private_key')!;
    const maxEpoch = parseInt(sessionStorage.getItem('max_epoch')!);

    console.log('4. Signing transaction with ephemeral key...');
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(ephemeralPrivateKey);
    const { signature: userSignature } = await ephemeralKeyPair.signTransaction(kindBytes);
    console.log('User signature created');

    console.log('5. Generating address seed...');
    const userEmail = sessionStorage.getItem('user_email')!;
    if (!userEmail) {
        throw new Error('User email not found');
    }
    
    const claims = JSON.parse(atob(Auth.jwt().split('.')[1]));
    console.log('JWT claims:', claims);
    
    const addressSeed = genAddressSeed(
        BigInt(Auth.hashcode(userEmail)),
        'sub',
        claims.sub,
        claims.aud
    ).toString();
    console.log('Address seed generated:', addressSeed);

    console.log('6. Generating zkLogin signature...');
    const zkLoginSignature = getZkLoginSignature({
        inputs: {
            ...partialZkLoginSignature,
            addressSeed,
        },
        maxEpoch,
        userSignature
    });
    console.log('zkLogin signature generated');

    console.log('7. Sending to backend...');
    const response = await fetch('/api/sponsor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            txBytes: toBase64(kindBytes),
            userSignature: zkLoginSignature,
            sender: Auth.walletAddress()
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