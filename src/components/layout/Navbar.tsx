import { AppBar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { useState, useEffect } from 'react'
import { Auth } from '@/utils/auth'
import { KeyboardArrowDown } from '@mui/icons-material'

const commonButtonStyles = {
  fontSize: '14px',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: 600,
  lineHeight: '20px',
  padding: '12px 24px',
  height: '44px',
  borderRadius: '20px',
  textTransform: 'none',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  minWidth: '140px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
    filter: 'brightness(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  }
}

const logoStyles = {
  textDecoration: 'none',
  color: '#fff',
  fontFamily: '"Bauhaus 93", sans-serif',
  fontSize: '1.1rem',
  fontWeight: 600,
  padding: '0.3rem 0.8rem',
  height: '40px',
  width: 'auto',
  minWidth: 'fit-content',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.3rem',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
    filter: 'brightness(1.1)'
  },
  '& .logo-image': {
    height: '18px',
    width: 'auto',
    objectFit: 'contain'
  },
  '& .character-image': {
    height: '34px',
    width: 'auto',
    objectFit: 'contain',
    marginLeft: '2px'
  }
}

const StyledAuthButton = styled(Button)(() => ({
  '&&': {
    fontSize: '14px !important',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif !important',
    fontWeight: '600 !important',
    lineHeight: '20px !important',
    padding: '12px 24px !important',
    height: '44px !important',
    borderRadius: '20px !important',
    textTransform: 'none !important',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#0071e3',
    display: 'inline-flex !important',
    alignItems: 'center !important',
    justifyContent: 'center !important',
    minWidth: '140px !important',

    '&:hover': {
      backgroundColor: '#0077ED',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
      filter: 'brightness(1.1)'
    }
  }
}));

const pages = [
  { name: 'About', path: '/about' },
  { name: 'How To', path: '/how-to' },
  { name: 'Store Hiking', path: '/hiking' }
]

export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(Auth.isAuthenticated())
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      if (menuOpen) {
        handleCloseNavMenu()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [menuOpen])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const appBar = document.querySelector('.MuiAppBar-root') as HTMLElement
      if (appBar) {
        if (scrollPosition > 0) {
          appBar.style.backgroundColor = 'rgba(0,0,0,0.95)'
        } else {
          appBar.style.backgroundColor = 'rgba(0,0,0,0.8)'
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // 토큰 상태와 이메일 감지
    const token = sessionStorage.getItem('sui_jwt_token');
    setIsAuthenticated(!!token && token !== 'null');
    if (token) {
      try {
        const decoded = Auth.decodeJwt();
        setUserEmail(decoded.email || '');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
    setMenuOpen(true)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
    setMenuOpen(false)
  }

  const handleZkLogin = async () => {
    try {
      const auth = new Auth()
      await auth.login()
    } catch (error) {
      console.error('zkLogin error:', error)
    }
  }

  const handleLogout = () => {
    Auth.logout()
    setIsAuthenticated(false)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'none',
        zIndex: 1100,
        border: 'none',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        position: 'fixed',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          padding: '0 2rem',
          '@media (max-width: 768px)': {
            padding: '0 16px'
          }
        }}>
          <Box
            component={RouterLink}
            to="/"
            sx={logoStyles}
          >
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Logo"
              sx={{
                height: { xs: '24px', md: '32px' },
                width: 'auto',
                cursor: 'pointer'
              }}
            />
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}shallwe.png`}
              alt="Shallwe character"
              sx={{
                height: { xs: '32px', md: '40px' },
                width: 'auto'
              }}
            />
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            gap: 2,
            alignItems: 'center',
            height: '44px'
          }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={commonButtonStyles}
              >
                {page.name}
              </Button>
            ))}
            {isAuthenticated ? (
              <>
                <StyledAuthButton
                  onClick={handleUserMenuOpen}
                  endIcon={<KeyboardArrowDown />}
                  sx={{
                    '&&': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2) !important'
                      }
                    }
                  }}
                >
                  {userEmail.split('@')[0]}
                </StyledAuthButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: '240px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      overflow: 'hidden'
                    }
                  }}
                >
                  <MenuItem 
                    sx={{ 
                      padding: '16px',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        cursor: 'default'
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>
                        Signed in as
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '14px',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontWeight: 500,
                        color: 'text.primary', 
                        opacity: 0.9 
                      }}>
                        {userEmail}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <Box sx={{ p: '8px' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        handleLogout();
                        handleUserMenuClose();
                      }}
                      sx={{ 
                        ...commonButtonStyles,
                        backgroundColor: '#0071e3',
                        '&:hover': {
                          backgroundColor: '#0077ED',
                          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                          transform: 'translateY(-2px)',
                          filter: 'brightness(1.1)'
                        }
                      }}
                    >
                      Sign Out
                    </Button>
                  </Box>
                </Menu>
              </>
            ) : (
              <StyledAuthButton onClick={handleZkLogin}>
                Sign in with Google
              </StyledAuthButton>
            )}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, height: '44px', alignItems: 'center' }}>
            <IconButton
              onClick={handleOpenNavMenu}
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              onClick={handleCloseNavMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  width: '200px',
                  mt: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiMenuItem-root': {
                    padding: '12px',
                    minHeight: '48px',
                    '& .MuiTypography-root': {
                      display: 'block',
                      width: '100%',
                      color: '#1d1d1f',
                      fontWeight: 500,
                      fontSize: '1rem'
                    }
                  }
                }
              }}
            >
              {isAuthenticated ? (
                <MenuItem 
                  sx={{ 
                    padding: '16px',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      cursor: 'default'
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontSize: '0.75rem', mb: 0.5 }}>
                      Signed in as
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '14px',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      fontWeight: 500,
                      color: 'text.primary', 
                      opacity: 0.9 
                    }}>
                      {userEmail}
                    </Typography>
                  </Box>
                </MenuItem>
              ) : null}

              {pages.map((page) => (
                <MenuItem 
                  key={page.name}
                  component={RouterLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    width: '100%',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Typography textAlign="center">
                    {page.name}
                  </Typography>
                </MenuItem>
              ))}

              <MenuItem 
                onClick={handleCloseNavMenu}
                sx={{
                  padding: 1,
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <Button
                  fullWidth
                  onClick={isAuthenticated ? handleLogout : handleZkLogin}
                  sx={{ 
                    ...commonButtonStyles,
                    backgroundColor: isAuthenticated ? '#0071e3' : '#0071e3',
                    '&:hover': {
                      backgroundColor: isAuthenticated ? '#0077ED' : '#0077ED',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                      transform: 'translateY(-2px)',
                      filter: 'brightness(1.1)'
                    }
                  }}
                >
                  {isAuthenticated ? 'Sign Out' : 'Sign in with Google'}
                </Button>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
} 