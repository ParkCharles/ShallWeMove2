import { useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import { Auth } from "@/utils/auth";

export const AuthPage = () => {
    useEffect(() => {
        const processAuth = async () => {
            try {
                console.log('🔄 Starting auth process...');
                
                // Handle auth redirect
                Auth.handleRedirect();
                
            } catch (error) {
                console.error('🚨 Auth error:', error);
                window.location.href = "/";
            }
        };

        processAuth();
    }, []);

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