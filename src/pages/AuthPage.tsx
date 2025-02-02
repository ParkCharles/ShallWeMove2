import { useEnokiFlow } from "@mysten/enoki/react";
import { useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

export const AuthPage = () => {
    const enokiFlow = useEnokiFlow();

    useEffect(() => {
        const processAuth = async () => {
            try {
                console.log('🔄 Starting auth process...');
                
                // 1. Store JWT token
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const idToken = hashParams.get('id_token');
                
                if (idToken) {
                    console.log('💾 Storing JWT token');
                    sessionStorage.setItem('sui_jwt_token', idToken);
                    
                    // 2. Handle auth directly
                    await enokiFlow.handleAuthCallback(window.location.hash);
                }
                
                // 3. Redirect back
                window.location.href = "/";
                
            } catch (error) {
                console.error('🚨 Auth error:', error);
                window.location.href = "/";
            }
        };

        processAuth();
    }, [enokiFlow]);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            gap: 2
        }}>
            <CircularProgress />
            <Box sx={{ color: 'text.secondary' }}>
                Processing login...
            </Box>
        </Box>
    );
};

export default AuthPage;