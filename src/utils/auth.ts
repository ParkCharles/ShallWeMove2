import axios from "axios";
import { client } from "./sui";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { generateNonce, generateRandomness, getExtendedEphemeralPublicKey } from '@mysten/sui/zklogin';
import { jwtToAddress, genAddressSeed, getZkLoginSignature } from '@mysten/sui/zklogin';
import { jwtDecode } from "jwt-decode";
import { useEnokiFlow } from '@mysten/enoki/react';

const PROVER_URL = import.meta.env.VITE_PROVER_URL;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const OPENID_PROVIDER_URL = import.meta.env.VITE_OPENID_PROVIDER_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export class Auth {
    static getAddressSeed() {
        const jwt = Auth.decodeJwt();
        console.log("🔍 Decoded JWT in getAddressSeed:", jwt);
    
        const salt = Auth.salt();
        console.log("🧂 Generated Salt:", salt);
    
        if (!jwt.sub || !jwt.aud || !salt) {
            throw new Error('Missing required JWT claims or salt');
        }
    
        const aud = Array.isArray(jwt.aud) ? jwt.aud[0] : jwt.aud;
        return genAddressSeed(BigInt(salt), "sub", jwt.sub, aud).toString();
    }

    static getEd25519Keypair(): Ed25519Keypair {
        const { ephemeralKeyPair } = Auth.getJwtData();
        return new Ed25519Keypair({
            publicKey: new Uint8Array(Object.values(ephemeralKeyPair.keypair.publicKey)),
            secretKey: new Uint8Array(Object.values(ephemeralKeyPair.keypair.secretKey))
        });
    }

    static async getPartialZkLoginSignature(): Promise<PartialZkLoginSignature> {
        const keyPair = Auth.getEd25519Keypair();
        const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(keyPair.getPublicKey());
        console.log("🔑 Extended Ephemeral Public Key:", extendedEphemeralPublicKey);
    
        const payload = {
            jwt: Auth.jwt(),
            extendedEphemeralPublicKey,
            maxEpoch: Auth.getMaxEpoch(),
            jwtRandomness: Auth.getRandomness(),
            salt: Auth.salt(),
            keyClaimName: "sub"
        };
        
        console.log("📩 Partial ZkLogin Signature Request Payload:", JSON.stringify(payload, null, 2));
        
        try {
            const result = await Auth.verifyPartialZkLoginSignature(payload);
            console.log("✅ Partial ZkLogin Signature Response:", result);
            return result;
        } catch (error) {
            console.error("❌ Error in getPartialZkLoginSignature:", error);
            throw error;
        }
    }

    private static async verifyPartialZkLoginSignature(
        payload: {
            jwt: string;
            extendedEphemeralPublicKey: string;
            maxEpoch: number;
            jwtRandomness: string;
            salt: string | null;
            keyClaimName: string;
        }
    ): Promise<PartialZkLoginSignature> {
        try {
            const { data } = await axios.post<PartialZkLoginSignature>(PROVER_URL, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            return data;
        } catch (error) {
            console.error("Failed to request partial signature: ", error);
            throw error;
        }
    }

    static async generateZkLoginSignature(userSignature: string): Promise<string> {
        console.log("🔑 User Signature:", userSignature);
        
        try {
            const partialSignature = await Auth.getPartialZkLoginSignature();
            console.log("📝 Partial Signature:", partialSignature);
        
            const zkLoginSignature = getZkLoginSignature({
                inputs: {
                    ...partialSignature,
                    addressSeed: Auth.getAddressSeed()
                },
                maxEpoch: Auth.getMaxEpoch(),
                userSignature
            });
        
            console.log("✅ Final ZkLogin Signature:", zkLoginSignature);
            return zkLoginSignature.toString();
        } catch (error) {
            console.error("❌ Error generating ZkLogin Signature:", error);
            throw error;
        }
    }

    static getMaxEpoch() {
        return Auth.getJwtData().maxEpoch;
    }

    static getRandomness() {
        return Auth.getJwtData().randomness;
    }

    private static getJwtData() {
        const data = sessionStorage.getItem("jwt_data");
        if (!data) {
            console.error('❌ JWT data not found');
            throw new Error('JWT data not found');
        }
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error('❌ Invalid JWT data format:', error);
            throw new Error('Invalid JWT data format');
        }
    }

    static decodeJwt(): JwtPayload {
        const token = Auth.jwt();
        console.log("🔑 Raw JWT Token:", token);
    
        if (!token) {
            throw new Error('No JWT token found');
        }
    
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            console.log("✅ Decoded JWT:", decoded);
            return decoded;
        } catch (error) {
            console.error("❌ JWT Decoding Error:", error);
            throw error;
        }
    }

    private static salt(): string | null {
        const claims = Auth.claims();
        const email = claims?.['email'];
        return email ? Auth.hashcode(email) : null;
    }

    static walletAddress() {
        const jwt = Auth.jwt();
        const email = Auth.claims()?.['email'];
    
        console.log("🔎 Checking walletAddress...");
        console.log("🔑 JWT:", jwt);
        console.log("📧 Email:", email);
    
        if (!jwt || !email) {
            console.error("🚨 Missing JWT or email!");
            throw new Error('Missing JWT or email');
        }
    
        const address = jwtToAddress(jwt, Auth.hashcode(email));
        console.log("🏠 Generated Wallet Address:", address);
    
        return address;
    }

    private static claims() {
        const token = Auth.jwt();
        if (!token) return null;
        return JSON.parse(atob(token.split('.')[1]));
    }

    private static hashcode(s: string): string {
        const hash = Array.from(s).reduce((hash, char) => 
            Math.abs((hash << 5) - hash + char.charCodeAt(0)),
            0
        );
        return hash.toString();
    }

    static isAuthenticated(): boolean {
        try {
            const token = Auth.jwt();
            if (!token || token === 'null') return false;

            // JWT 토큰 만료 확인
            const decoded = Auth.decodeJwt();
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

    async login(): Promise<void> {
        try {
            // 로그인 시도 전에 기존 데이터 초기화
            sessionStorage.removeItem('sui_jwt_token');
            sessionStorage.removeItem('jwt_data');
            
            if (!GOOGLE_CLIENT_ID || !REDIRECT_URL || !OPENID_PROVIDER_URL) {
                throw new Error('Required environment variables are not set');
            }

            const { epoch } = await client.getLatestSuiSystemState();
            const maxEpoch = Number(epoch) + 2222;
            const ephemeralKeyPair = new Ed25519Keypair();
            const randomness = generateRandomness();
            const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

            const jwtData = { maxEpoch, nonce, randomness, ephemeralKeyPair };
            sessionStorage.setItem("jwt_data", JSON.stringify(jwtData));

            const params = new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID,
                redirect_uri: REDIRECT_URL,
                response_type: 'id_token',
                scope: 'openid email profile',
                nonce,
                prompt: 'select_account'
            });

            console.log('Redirect URL:', REDIRECT_URL);

            const { data } = await axios.get(OPENID_PROVIDER_URL);
            window.location.href = `${data.authorization_endpoint}?${params}`;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    static logout(): void {
        // 모든 관련 데이터 완전히 제거
        sessionStorage.clear();  // 또는 특정 키만 제거하려면 아래 주석의 코드 사용
        // sessionStorage.removeItem('sui_jwt_token');
        // sessionStorage.removeItem('jwt_data');
        
        // 페이지 새로고침하여 모든 상태 초기화
        window.location.reload();
    }
}

export interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    email?: string;
    extraClaims?: Record<string, unknown>;
}

export type PartialZkLoginSignature = Omit<
    Parameters<typeof getZkLoginSignature>[0]['inputs'],
    'addressSeed'
>;

export const useAuth = () => {
    const enokiFlow = useEnokiFlow();

    const isAuthenticated = () => {
        // JWT 토큰 존재 여부로 인증 상태 확인
        return sessionStorage.getItem("sui_jwt_token") !== null;
    };

    const logout = () => {
        // 세션 스토리지 클리어
        sessionStorage.clear();
        window.location.href = '/';
    };

    const getWalletAddress = async () => {
        // 지갑 키페어 가져오기
        const signer = await enokiFlow.getKeypair();
        return signer.getPublicKey().toSuiAddress();
    };

    return {
        isAuthenticated,
        logout,
        getWalletAddress,
    };
};

