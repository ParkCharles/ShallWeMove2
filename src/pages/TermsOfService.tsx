import { Box, Container, Typography  } from '@mui/material'
import { LinearGradient } from 'react-text-gradients'

export function TermsOfService() {
  return (
    <Box sx={{ 
      py: 8, 
      minHeight: '100vh',
      bgcolor: '#f5f5f5',
      overflowY: 'auto'  // 스크롤 가능하도록
    }}>
      <Container maxWidth="md" sx={{ 
        mt: { xs: 8, md: 10 },
        mb: 6,
        height: 'auto'
      }}>
        <Typography variant="h3" gutterBottom>
          <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
            Terms of Service
          </LinearGradient>
        </Typography>

        <Typography variant="body1" paragraph>
          Welcome to ShallWeMove. By using our service, you agree to these terms. Please read them carefully.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Account Terms</Typography>
        <Typography variant="body1" paragraph>
          • You must sign in using your Google account
          <br />• You are responsible for maintaining the security of your account
          <br />• You must provide accurate information when recording hiking activities
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Service Usage</Typography>
        <Typography variant="body1" paragraph>
          • Our service is for recording and preserving your hiking experiences
          <br />• You retain ownership of the content you upload
          <br />• You grant us license to store and display your content
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>User Responsibilities</Typography>
        <Typography variant="body1" paragraph>
          • Do not upload inappropriate or harmful content
          <br />• Respect other users' privacy and rights
          <br />• Follow hiking safety guidelines and local regulations
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Service Modifications</Typography>
        <Typography variant="body1" paragraph>
          We reserve the right to modify or discontinue the service at any time. We will notify users of significant changes.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last updated: January 2024
        </Typography>
      </Container>
    </Box>
  )
} 