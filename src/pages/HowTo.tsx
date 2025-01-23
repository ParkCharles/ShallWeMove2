import { Box, Container, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { LinearGradient } from 'react-text-gradients'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import EditIcon from '@mui/icons-material/Edit'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import FlagIcon from '@mui/icons-material/Flag'
import { Link as RouterLink } from 'react-router-dom'

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
      title: "1. Choose Your Wallet",
      content: (
        <>
          <Box>
            <Typography variant="body1" color="text.secondary" component="div" paragraph>
              You can choose between two wallet options:
            </Typography>
            <List>
            <ListItem>
                <ListItemIcon>
                  <AccountBalanceWalletIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Stashed Wallet" 
                  secondary="Simple social login wallet - no extension needed"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceWalletIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sui Wallet" 
                  secondary="Traditional browser extension wallet with full features"
                />
              </ListItem>
            </List>
          </Box>
        </>
      ),
      icon: <AccountBalanceWalletIcon />
    },
    {
      title: "2A. Stashed Wallet Setup (Option 1)",
      content: (
        <>
          <Box>
            <Typography variant="body1" color="text.secondary" component="div" paragraph>
              If you choose Stashed Wallet - Our Recommended Option for New Users:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="No Installation Required" 
                  secondary="Just click 'Connect Wallet' and choose Stashed"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Simple Social Login" 
                  secondary="Sign in with your Google or other social accounts - no crypto knowledge needed"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="No Gas Fees" 
                  secondary="We cover all transaction fees for your first hiking records"
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
              We believe blockchain technology should be accessible to everyone. That's why we cover the gas fees for new users, allowing you to focus on recording your hiking memories without worrying about cryptocurrency or transaction costs.
            </Typography>
          </Box>
        </>
      ),
      icon: <AccountBalanceWalletIcon />
    },
    {
      title: "2B. Sui Wallet Setup (Option 2)",
      content: (
        <>
          <Box>
            <Typography variant="body1" color="text.secondary" component="div" paragraph>
              If you choose Sui Wallet:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Install Wallet" 
                  secondary="Get the official Sui Wallet extension from Chrome Web Store"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Connect to Testnet" 
                  secondary="Click the ⚙️ (settings) icon and select 'Sui Testnet' as your network"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Get Test Tokens" 
                  secondary="In settings menu, request Testnet SUI Tokens for storing hiking records"
                />
              </ListItem>
            </List>
            <Button
              variant="outlined"
              color="primary"
              href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<AddCircleOutlineIcon />}
              sx={{ mt: 2 }}
            >
              Install Sui Wallet
            </Button>
          </Box>
        </>
      ),
      icon: <AddCircleOutlineIcon />
    },
    {
      title: "3. Upload Your Hiking Data",
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
      title: "4. Fill the Form",
      content: "Upload your GPX file or manually enter your hiking information",
      icon: <EditIcon />
    },
    {
      title: "5. Add Photos",
      content: "Upload photos from your hiking journey to make your record more memorable",
      icon: <PhotoCameraIcon />
    },
    {
      title: "6. Review & Submit",
      content: "Check all the information and click 'Record Hiking Journey' to store it on the blockchain",
      icon: <CheckCircleIcon />
    },
    {
      title: "7. Confirmation",
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