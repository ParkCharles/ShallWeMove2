import { Box, Grid, Typography, Container, Button } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import YouTube from 'react-youtube'
import { YouTubeEvent } from 'react-youtube'
import { Link as RouterLink } from 'react-router-dom'

// YouTube 설정
const VIDEO_ID = 'MEq6TIHw6go'
const videoOpts = {
  playerVars: {
    autoplay: 1,
    controls: 0,
    modestbranding: 1,
    loop: 1,
    mute: 1,
    rel: 0,
    showinfo: 0,
    playsinline: 1,
    disablekb: 1,
    iv_load_policy: 3,
    fs: 0,
    origin: window.location.origin,
    host: window.location.origin,
    enablejsapi: 1,
    playlist: null
  },
  suggestedQuality: 'hd1080'
}

interface YouTubePlayerState {
  data: number;  // YouTube Player States: -1, 0, 1, 2, 3, 5
}

// 비디오 컨테이너 컴포넌트
const VideoContainer = () => {
  const handleReady = (event: YouTubeEvent) => {
    try {
      if (event.target?.playVideo) {
        event.target.playVideo();
        event.target.addEventListener('onStateChange', (state: YouTubePlayerState) => {
          if (state.data === 1) { // 재생 중
            event.target.setPlaybackQuality('hd1080');
          }
        });
      }
    } catch (error) {
      console.error('YouTube player error:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        height: '100%',
        width: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        '& > div': {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          '& iframe': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            transform: 'scale(1.2)'
          }
        }
      }}
    >
      <YouTube
        videoId={VIDEO_ID}
        opts={{
          ...videoOpts,
          width: '100%',
          height: '100%',
          playerVars: {
            ...videoOpts.playerVars,
            playlist: VIDEO_ID
          }
        }}
        onReady={handleReady}
        onEnd={(event: YouTubeEvent) => {
          event.target.playVideo();
        }}
        onError={(error: Error) => console.error('YouTube Error:', error)}
        iframeClassName="youtube-iframe"
      />
    </Box>
  );
}

export function Home() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    // Handle auth callback
    const hash = window.location.hash;
    if (hash) {
      const idToken = new URLSearchParams(hash.substring(1)).get('id_token');
      if (idToken) {
        sessionStorage.setItem('sui_jwt_token', idToken);
        // 인증 완료 후 hiking 페이지로 이동
        navigate('/hiking');
      }
    }
  }, [location, navigate])

  const hikingFeatures = [
    {
      icon: "⛰",
      title: "Mountain & Trail",
      description: "Save the mountains and trails you explored together"
    },
    {
      icon: "📍",
      title: "Peak Elevation",
      description: "Remember that breathtaking moment at the summit"
    },
    {
      icon: "⌚",
      title: "Time & Duration",
      description: "Cherish every moment of your hiking journey"
    },
    {
      icon: "👥",
      title: "Shared Memory",
      description: "Keep precious memories with friends forever on blockchain"
    },
    {
      icon: "📸",
      title: "Summit Photo",
      description: "Don't forget to save your perfect summit shot"
    },
    {
      icon: "⭐",
      title: "Forever Memory",
      description: "Your hiking memories will last forever on blockchain"
    }
  ]

  return (
    <Box sx={{ 
      width: '100%',
      position: 'relative',
      bgcolor: '#000',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
          boxSizing: 'border-box'
        }}
      >
        {/* 동영상 섹션 */}
        <Box
          className="video-section"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <VideoContainer />
        </Box>

        {/* 오버레이 */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            width: '100%'
          }}
        />

        {/* 텍스트 컨테이너 */}
        <Box 
          sx={{ 
            position: 'relative',
            zIndex: 2,
            width: '100%',
            textAlign: 'center',
            transform: { 
              xs: 'translateY(-15%)',
              md: 'translateY(-40%)'
            }
          }}
        >
          <Typography 
            variant="h1"
            sx={{
              fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              mb: 3,
              textShadow: '2px 2px 0 #000, 4px 4px 0 rgba(0,0,0,0.2)',
              color: '#fff',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateZ(10px)',
                textShadow: '3px 3px 0 #000, 6px 6px 0 rgba(0,0,0,0.2)'
              }
            }}
          >
            Shall We Move
          </Typography>
          <Typography 
            variant="h4"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 500,
              textShadow: '1px 1px 0 #000, 2px 2px 0 rgba(0,0,0,0.2)',
              color: '#fff',
              opacity: 0.9
            }}
          >
            Store your journey on the blockchain.
          </Typography>
        </Box>
      </Box>

      {/* Features Section */}
      <Box>
        <Box sx={{ 
          bgcolor: '#fff',
          py: { xs: 8, md: 12 }
        }}>
          <Container>
            <Typography 
              variant="h2" 
              align="center" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 600,
                color: '#1d1d1f',
                mb: 2
              }}
            >
              Store Your Journey
            </Typography>
            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 400,
                color: '#6e6e73',
                mb: 8,
                maxWidth: '700px',
                mx: 'auto'
              }}
            >
              Capture every detail of your mountain adventures
            </Typography>
            <Grid container spacing={6}>
              {hikingFeatures.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <Typography variant="h2" sx={{ mb: 2, fontSize: '3rem' }}>
                      {feature.icon}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        color: '#1d1d1f'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#6e6e73',
                        fontSize: '1.1rem'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Ready to Start Section - 위치 이동 */}
      <Box sx={{ 
        bgcolor: '#f5f5f5',
        py: { xs: 8, md: 12 }
      }}>
        <Container>
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 600,
                color: '#1d1d1f',
                mb: 2
              }}
            >
              Ready to Start?
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 400,
                color: '#6e6e73',
                mb: 4
              }}
            >
              New to blockchain? We'll guide you through every step
            </Typography>
            <Button
              component={RouterLink}
              to="/how-to"
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
              Learn How to Get Started
            </Button>
          </Box>
        </Container>
      </Box>

      <Typography 
        variant="body2" 
        sx={{ 
          bgcolor: 'rgba(0, 0, 0, 0.7)', 
          color: '#fff', 
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          mb: 4,
          fontSize: '1.5rem',
          lineHeight: 1.6,
          fontWeight: 400,
          '& strong': {
            fontWeight: 600
          }
        }}
      >
        🔧 <strong>Service Update:</strong> We're currently implementing sponsored transactions to enhance your experience. 
        During this upgrade, blockchain storage is temporarily paused. 
        Once completed, you'll be able to record your hiking memories without any transaction fees! 
        Stay tuned for this exciting update.
      </Typography>
    </Box>
  )
} 