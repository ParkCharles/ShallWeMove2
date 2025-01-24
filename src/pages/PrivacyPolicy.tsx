import { Box, Container, Typography } from '@mui/material'
import { LinearGradient } from 'react-text-gradients'

export function PrivacyPolicy() {
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
            Privacy Policy
          </LinearGradient>
        </Typography>
        
        <Typography variant="body1" paragraph>
          At ShallWeMove, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Information We Collect</Typography>
        <Typography variant="body1" paragraph>
          • Google Account Information: Email address and basic profile information through Google Sign-In
          <br />• Hiking Activity Data: GPX files, photos, and related information you choose to share
          <br />• Usage Information: How you interact with our platform
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>How We Use Your Information</Typography>
        <Typography variant="body1" paragraph>
          • To provide and improve our hiking record service
          <br />• To verify your identity and maintain account security
          <br />• To analyze usage patterns and enhance user experience
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Data Security</Typography>
        <Typography variant="body1" paragraph>
          Your data is stored securely and we implement appropriate measures to protect against unauthorized access or disclosure.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Your Rights</Typography>
        <Typography variant="body1" paragraph>
          You have the right to access, correct, or delete your personal information. You can also request a copy of your data at any time.
        </Typography>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
          Last updated: January 2024
        </Typography>
      </Container>
    </Box>
  )
} 