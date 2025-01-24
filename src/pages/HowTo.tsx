import { Box, Container, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { LinearGradient } from 'react-text-gradients'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import EditIcon from '@mui/icons-material/Edit'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FlagIcon from '@mui/icons-material/Flag'
import { Link as RouterLink } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google'

const Checkpoint = ({ children, index }: { children: React.ReactNode, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Box sx={{ position: 'relative' }}>
      {children}
    </Box>
  </motion.div>
)

export function HowTo() {
  const steps = [
    {
      title: "1. Sign in with Google",
      content: (
        <>
          <Box>
            <Typography variant="body1" color="text.secondary" component="div" paragraph>
              We've simplified the login process with Google authentication:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="One-Click Sign In" 
                  secondary="Quick and easy access with your Google account"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Enhanced Security" 
                  secondary="Google's robust security protects your account and data"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="No Additional Setup" 
                  secondary="No need to remember new passwords or install extensions"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Instant Access" 
                  secondary="Start recording your hiking memories immediately after login"
                />
              </ListItem>
            </List>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 2, fontStyle: 'italic' }}
            >
              We believe technology should enhance your outdoor experience, not complicate it. That's why we chose Google Sign-In - a secure, familiar, and hassle-free way to access our platform.
            </Typography>
          </Box>
        </>
      ),
      icon: <GoogleIcon />
    },
    {
      title: "2. Upload Your Hiking Data",
      content: (
        <>
          <Box>
            <Typography variant="body1" color="text.secondary" component="div" paragraph>
              Export GPX from your device:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Apple Watch" 
                  secondary="Use WorkOutDoors app for GPX export"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Samsung Health" 
                  secondary="Activity > Share > Export as GPX"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Garmin Connect" 
                  secondary="Activity > Export GPX"
                />
              </ListItem>
            </List>
          </Box>
        </>
      ),
      icon: <FileUploadIcon />
    },
    {
      title: "3. Fill the Form",
      content: "Upload your GPX file or manually enter your hiking information",
      icon: <EditIcon />
    },
    {
      title: "4. Add Photos",
      content: "Upload photos from your hiking journey to make your record more memorable",
      icon: <PhotoCameraIcon />
    },
    {
      title: "5. Review & Submit",
      content: "Check all the information and click 'Record Hiking Journey' to store it on the blockchain",
      icon: <CheckCircleIcon />
    },
    {
      title: "6. Confirmation",
      content: "Wait for the transaction to be confirmed. Your hiking record will be preserved on the blockchain!",
      icon: <FlagIcon />
    }
  ]

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh'
    }}>
      <Container>
        <Box sx={{ mt: { xs: 8, md: 10 }, mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              mb: 4
            }}>
              <Box
                component="img"
                src="/shallwe.png"
                alt="Shallwe character"
                sx={{
                  width: { xs: '100px', md: '140px' },
                  height: 'auto',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                  }
                }}
              />
              
              <Box>
                <Typography variant="h3" gutterBottom>
                  <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
                    How to Get Started
                  </LinearGradient>
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ color: '#6e6e73' }}
                >
                  Follow these simple steps to start your journey
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          maxWidth: '800px',
          mx: 'auto'
        }}>
          {steps.map((step, index) => (
            <Checkpoint key={index} index={index}>
              <Card sx={{ boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" component="div">
                    {step.content}
                  </Typography>
                </CardContent>
              </Card>
            </Checkpoint>
          ))}
        </Box>

        <Box 
          sx={{ 
            mt: 12,
            textAlign: 'center',
            bgcolor: '#fff',
            borderRadius: 4,
            p: 6,
            boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)'
          }}
        >
          <Typography variant="h3" gutterBottom>
            <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
              Ready to Record Your Journey?
            </LinearGradient>
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              color: '#6e6e73',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Now that you're all set up, let's preserve your hiking memories on the blockchain
          </Typography>
          <Button
            component={RouterLink}
            to="/hiking"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#0071e3',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: '#0077ED'
              }
            }}
          >
            Start Recording Your Journey
          </Button>
        </Box>
      </Container>
    </Box>
  )
} 