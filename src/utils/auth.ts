import axios from "axios";
import { jwtToAddress } from '@mysten/sui/zklogin';
import { jwtDecode } from "jwt-decode";

const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const OPENID_PROVIDER_URL = import.meta.env.VITE_OPENID_PROVIDER_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export class Auth {
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

    async login(): Promise<void> {
        try {
            const params = new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID,
                redirect_uri: REDIRECT_URL,
                response_type: 'id_token',
                scope: 'openid email profile',
                nonce: Math.random().toString(36).substring(7),
                prompt: 'select_account'
            }).toString();

            const { data } = await axios.get(OPENID_PROVIDER_URL);
            window.location.href = `${data.authorization_endpoint}?${params}`;
        } catch (error) {
            console.error('Error during login:', error);
            Auth.logout();
        }
    }

    static logout(): void {
        sessionStorage.clear();
        window.location.href = '/';
    }

    static handleRedirect(): void {
        const hash = window.location.hash;
        if (!hash) return;

        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get('id_token');
        
        if (idToken) {
            sessionStorage.setItem('sui_jwt_token', idToken);
            window.history.replaceState(null, '', '/');
            window.location.reload();
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

