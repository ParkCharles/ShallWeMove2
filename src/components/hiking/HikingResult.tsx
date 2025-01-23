import { memo, useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { useSuiWallet } from '@/hooks'

const colors = {
  primary: {
    main: '#1a237e',
    dark: '#000051'
  },
  text: {
    primary: '#1d1d1f',
    secondary: '#6e6e73'
  },
  background: {
    paper: '#ffffff'
  }
} as const

interface HikingResultProps {
  objectId: string
  location: string
}

export const HikingResult = memo(function HikingResult({ objectId, location }: HikingResultProps) {
  const [loading, setLoading] = useState(true)
  const resultRef = useRef<HTMLDivElement>(null)
  const { isConnected } = useSuiWallet()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000) // Simulate loading time
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [loading])

  if (loading) {
    return (
      <Box 
        ref={resultRef}
        sx={{ 
          width: '100%',
          textAlign: 'center',
          py: 6,
          mt: 4,
          bgcolor: colors.background.paper,
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: colors.text.primary,
            mb: 2
          }}
        >
          Storing your journey on the blockchain...
        </Typography>
        <Box
          component="img"
          src="/shallwe.png"
          alt="Shallwe character"
          sx={{
            width: '100px',
            height: 'auto',
            animation: 'spin 3s linear infinite',
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
          `}
        </style>
      </Box>
    )
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        textAlign: 'center',
        py: 6,
        mt: 4,
        bgcolor: colors.background.paper,
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
          fontWeight: 600,
          color: colors.text.primary,
          mb: 2
        }}
      >
        🎉 Successfully recorded your hiking journey!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: { xs: '1rem', sm: '1.2rem' },
          color: colors.text.secondary,
          mb: 3
        }}
      >
        Your hiking memory at {location} has been permanently stored on the blockchain.
      </Typography>
      {!isConnected && (
        <Typography
          variant="body2"
          sx={{
            color: 'red',
            mb: 2
          }}
        >
          Wallet Connection Error
          Please connect your wallet first
        </Typography>
      )}
      <div className="button-group" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
        <Button
          variant="contained"
          href={`https://suiscan.xyz/testnet/object/${objectId}/fields`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1,
            bgcolor: colors.primary.main,
            '&:hover': {
              bgcolor: colors.primary.dark
            }
          }}
        >
          Check Save Result
        </Button>
      </div>
    </Box>
  )
}) 