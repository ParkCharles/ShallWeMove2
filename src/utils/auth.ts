import axios from "axios";
import { jwtToAddress, getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin';
import { jwtDecode } from "jwt-decode";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness } from "@mysten/sui/zklogin";
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const OPENID_PROVIDER_URL = import.meta.env.VITE_OPENID_PROVIDER_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export class Auth {
    static claims() {
        const token = Auth.jwt();
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    }

    // 1️⃣ Uint8Array를 안전하게 저장/복원하는 유틸리티 메서드 추가
    private static uint8ArrayToString(arr: Uint8Array | string): string {
        if (typeof arr === 'string') return arr;
        return Array.from(arr).join(',');
    }

    // 2️⃣ 더 안전한 해시 함수로 교체
    static hashcode(s: string): string {
        // 숫자 문자열로 변환하여 반환
        const encoder = new TextEncoder();
        const data = encoder.encode(s);
        let hash = 0n;
        
        for (let i = 0; i < data.length; i++) {
            hash = (hash * 31n + BigInt(data[i])) % (1n << 32n);
        }
        
        return hash.toString(); // 10진수 문자열로 반환
    }

    static isAuthenticated(): boolean {
        try {
            const token = Auth.jwt();
            if (!token || token === 'null') return false;

            const decoded = jwtDecode(token);
            if (!decoded.exp) return false;
            
            const now = Math.floor(Date.now() / 1000);
            return decoded.exp > now;
        } catch (error) {
            console.error('Auth validation error:', error);
            return false;
        }
    }

    static jwt(): string {
        return sessionStorage.getItem("sui_jwt_token") || '';
    }

    static getEmail(): string | null {
        const claims = Auth.claims();
        return claims?.['email'] || null;
    }

    static walletAddress(): string {
        const jwt = Auth.jwt();
        const email = Auth.getEmail();  // claims()?.['email'] 대신 getEmail() 사용
    
        if (!jwt || !email) {
            throw new Error('Missing JWT or email');
        }
    
        return jwtToAddress(jwt, Auth.hashcode(email));
    }

    static getZkLoginInputs() {
        const jwt = Auth.jwt();
        const email = Auth.getEmail();
        const userSalt = Auth.hashcode(email!);

        return {
            jwt,
            userSalt: BigInt(userSalt),
            // 추가 필드들은 로그인 시점에 저장해야 함
            // ephemeralPublicKey
            // zkProof
        };
    }

    static getMaxEpoch(): number {
        // JWT의 exp 값을 사용
        const claims = Auth.claims();
        return claims?.exp || 0;
    }

    static getEphemeralSignature() {
        // 임시 키로 서명한 값
        // 이 부분은 로그인 시점에 생성하고 저장해야 함
        const ephemeralSignature = sessionStorage.getItem('ephemeral_signature');
        if (!ephemeralSignature) {
            throw new Error('Ephemeral signature not found. Please login again.');
        }
        return ephemeralSignature;
    }

    async login(): Promise<void> {
        try {
            console.log('Starting login process...');
            const ephemeralKeyPair = new Ed25519Keypair();
            const randomness = generateRandomness();
            console.log('Generated keypair and randomness');
    
            const { epoch } = await client.getLatestSuiSystemState();
            const maxEpoch = Number(epoch) + 10;
            console.log('Current epoch:', epoch, 'maxEpoch:', maxEpoch);
    
            const nonce = generateNonce(
                ephemeralKeyPair.getPublicKey(),
                maxEpoch,
                randomness
            );
            console.log('Generated nonce:', nonce);
    
            // 저장 전 값들 확인
            console.log('Saving to sessionStorage:', {
                ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
                randomness: randomness,
                maxEpoch: maxEpoch
            });
    
            sessionStorage.setItem(
                'ephemeral_private_key', 
                Auth.uint8ArrayToString(ephemeralKeyPair.getSecretKey())
            );
            sessionStorage.setItem(
                'randomness',
                Auth.uint8ArrayToString(randomness)
            );
            sessionStorage.setItem('max_epoch', maxEpoch.toString());
    
            // 저장된 값 확인
            console.log('Stored values:', {
                ephemeralPrivateKey: sessionStorage.getItem('ephemeral_private_key'),
                randomness: sessionStorage.getItem('randomness'),
                maxEpoch: sessionStorage.getItem('max_epoch')
            });
    
            const params = new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID,
                redirect_uri: REDIRECT_URL,
                response_type: 'id_token',
                scope: 'openid email profile',
                nonce: nonce,
                prompt: 'select_account'
            });
    
            console.log('OAuth params:', params.toString());
            const { data } = await axios.get(OPENID_PROVIDER_URL);
            console.log('Redirecting to:', `${data.authorization_endpoint}?${params}`);
            window.location.href = `${data.authorization_endpoint}?${params}`;
        } catch (error) {
            console.error('Login error:', error);
            Auth.logout();
        }
    }

    static logout(): void {
        sessionStorage.clear();
        window.location.href = '/';
    }

    static async handleRedirect(): Promise<void> {
        console.log('Starting handleRedirect...');
        const hash = window.location.hash;
        console.log('URL hash:', hash);
        
        if (!hash) {
            console.log('No hash found in URL');
            return;
        }
    
        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get('id_token');
        console.log('Found idToken:', !!idToken);
        
        if (idToken) {
            try {
                console.log('Stored values before processing:', {
                    ephemeralPrivateKey: sessionStorage.getItem('ephemeral_private_key'),
                    randomness: sessionStorage.getItem('randomness'),
                    maxEpoch: sessionStorage.getItem('max_epoch')
                });
    
                // JWT 저장
                sessionStorage.setItem('sui_jwt_token', idToken);
                const decoded = jwtDecode(idToken);
                console.log('Decoded JWT:', decoded);
                
                // 이메일 저장
                const claims = JSON.parse(atob(idToken.split('.')[1]));
                sessionStorage.setItem('user_email', claims.email);
                console.log('Email saved:', claims.email);
    
                try {
                    // ZK Proof 생성
                    const ephemeralPrivateKey = sessionStorage.getItem('ephemeral_private_key')!;
                    const randomness = sessionStorage.getItem('randomness')!;
                    const maxEpoch = sessionStorage.getItem('max_epoch')!;
    
                    console.log('Creating ZK proof with:', {
                        ephemeralPrivateKey: !!ephemeralPrivateKey,
                        randomness: !!randomness,
                        maxEpoch
                    });
    
                    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(ephemeralPrivateKey);
                    const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(
                        ephemeralKeyPair.getPublicKey()
                    );
    
                    console.log('Making proving service request...');
                    const proofResponse = await fetch(import.meta.env.VITE_PROVER_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jwt: idToken,
                            extendedEphemeralPublicKey,
                            maxEpoch: parseInt(maxEpoch),
                            jwtRandomness: randomness,
                            salt: Auth.hashcode(claims.email),
                            keyClaimName: 'sub'
                        })
                    });
    
                    if (!proofResponse.ok) {
                        const error = await proofResponse.text();
                        console.error('Proving service error:', error);
                    } else {
                        const zkProofResult = await proofResponse.json();
                        console.log('ZK proof received:', zkProofResult);
                        sessionStorage.setItem('zk_proof', JSON.stringify(zkProofResult));
                    }
                } catch (proofError) {
                    console.error('Error getting ZK proof:', proofError);
                    // ZK proof 실패는 로그만 하고 계속 진행
                }
    
                console.log('Login completed, redirecting...');
                window.history.replaceState(null, '', '/');
                window.location.reload();
            } catch (error) {
                console.error('Critical error during redirect handling:', error);
                Auth.logout();
            }
        }
    }
}

export const useAuth = () => {
    return {
        isAuthenticated: Auth.isAuthenticated,
        logout: Auth.logout,
        getWalletAddress: Auth.walletAddress,
    };
};

