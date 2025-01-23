import { useEffect } from 'react';

export function Auth() {
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const hash = window.location.hash;
        if (hash) {
          const idToken = new URLSearchParams(hash.substring(1)).get('id_token');
          if (idToken) {
            sessionStorage.setItem('sui_jwt_token', idToken);
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/';
      }
    };

    handleAuth();
  }, []);

  return null;
} 