import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LinearGradient } from 'react-text-gradients'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import LandscapeIcon from '@mui/icons-material/Landscape'
import GroupsIcon from '@mui/icons-material/Groups'
import LightbulbIcon from '@mui/icons-material/Lightbulb'

// Hero Section 배경 이미지 추가
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  background: 'linear-gradient(rgba(26, 35, 126, 0.7), rgba(13, 71, 161, 0.7))',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  padding: theme.spacing(8, 0),
}))

// 애니메이션이 있는 카드
const AnimatedCard = motion.create(Card)

// 타임라인 컴포넌트
const TimelineItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingLeft: theme.spacing(4),
  marginBottom: theme.spacing(4),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    background: '#1a237e',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: -6,
    top: 0,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#1a237e',
  }
}))

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh'
    }}>
      <Container>
        <HeroSection>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={5}>
                <Typography 
                  variant="h2" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textAlign: 'center',
                    mb: 4
                  }}
                >
                  <LinearGradient gradient={['to right', '#FFFFFF, #FE6B8B']}>
                    Our Vision
                  </LinearGradient>
                </Typography>
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4,
                    pl: { xs: 2,md: 4 },
                    borderLeft: { md: '4px solid rgba(255, 255, 255, 0.3)' },
                    maxWidth: '600px'
                  }}
                >
                  <Typography variant="body1" component="div">
                    We preserve the value of outdoor activities through blockchain technology, 
                    helping people connect with nature and achieve meaningful accomplishments.
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
          </motion.div>
        </HeroSection>

        {/* Story Section with Timeline */}
        <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
          <Container>
            <Typography variant="h4" textAlign="center" gutterBottom>
              <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
                Our Story
              </LinearGradient>
            </Typography>
            <Box sx={{ mt: 6 }}>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    title: "2023",
                    content: "Started our journey in the Sui ecosystem while working at a blockchain infrastructure startup that was selected as a Sui Validator. Our team demonstrated technical excellence by winning multiple Sui hackathons, including first place in the gaming category"
                  },
                  {
                    title: "2024",
                    content: "Invited to Sui's first global conference 'Basecamp' in Paris and Korea Blockchain Week. Established our startup to bring blockchain innovation to outdoor activities"
                  },
                  {
                    title: "2025",
                    content: "Developing MVP with continuous updates to create a sustainable platform for outdoor enthusiasts"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -50 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.6,
                          delay: index * 0.3
                        }
                      }
                    }}
                  >
                    <TimelineItem>
                      <Typography variant="h6">{item.title}</Typography>
                      <Box>
                        <Typography variant="body1">{item.content}</Typography>
                      </Box>
                    </TimelineItem>
                  </motion.div>
                ))}
              </motion.div>
            </Box>
          </Container>
        </Box>

        {/* Our Team's Strength 섹션 */}
        <Box 
          ref={ref}
          sx={{ 
            width: '100%',
            bgcolor: '#000',
            padding: '4rem 0',
            color: '#fff'
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h4" 
                textAlign="center" 
                gutterBottom
                sx={{ 
                  color: '#fff',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
                }}
              >
                <LinearGradient gradient={['to right', '#a0a0a0,#ffffff 30%']}>
                  Our Team's Strength
                </LinearGradient>
              </Typography>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Grid container spacing={4} sx={{ mt: 4 }}>
                {[
                  {
                    title: "Technical Expertise",
                    icon: <LandscapeIcon className="icon" />,
                    content: [
                      "Development experience since Sui's early stages",
                      "Multiple hackathon awards",
                      "Blockchain infrastructure operation experience"
                    ]
                  },
                  {
                    title: "Ecosystem Network",
                    icon: <GroupsIcon className="icon" />,
                    content: [
                      "Close collaboration with Sui core team",
                      "Founding member of Sui Korea community",
                      "Active engagement with university blockchain clubs"
                    ]
                  },
                  {
                    title: "Innovative Vision",
                    icon: <LightbulbIcon className="icon" />,
                    content: [
                      "Meaningful integration of real activities and blockchain",
                      "User-centric service design",
                      "Sustainable business model development"
                    ]
                  }
                ].map((card, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <AnimatedCard
                      variants={cardVariants}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        {card.icon}
                        <Typography variant="h6" gutterBottom>{card.title}</Typography>
                        <Box>
                          <Typography variant="body1" component="div">
                            {card.content.map((item, i) => (
                              <Box key={i} sx={{ mb: 1 }}>• {item}</Box>
                            ))}
                          </Typography>
                        </Box>
                      </CardContent>
                    </AnimatedCard>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Container>
        </Box>

        {/* Current Status & Values Section */}
        <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
          <Container>
            <Grid container spacing={8}>
              {/* Current Status */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h4" gutterBottom>
                    <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
                      Current Status
                    </LinearGradient>
                  </Typography>
                  <Box 
                    sx={{ 
                      mt: 4,
                      p: 3,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)'
                    }}
                  >
                    {[
                      {
                        title: "Incubation",
                        content: "Participating in Yonsei University Startup Support Program"
                      },
                      {
                        title: "Development",
                        content: "MVP development completed on Sui testnet"
                      },
                      {
                        title: "Progress",
                        content: "Ongoing product improvement and partnership development"
                      }
                    ].map((status, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                      >
                        <Box sx={{ mb: 3 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#1a237e',
                              display: 'flex',
                              alignItems: 'center',
                              '&::before': {
                                content: '""',
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#1a237e',
                                mr: 2,
                                transition: 'transform 0.3s ease',
                              },
                              '&:hover::before': {
                                transform: 'scale(1.2)',
                              }
                            }}
                          >
                            {status.title}
                          </Typography>
                          <Box 
                            sx={{ 
                              ml: 4,
                              mt: 1,
                              color: '#333',
                              borderLeft: '2px solid #1a237e',
                              pl: 2
                            }}
                          >
                            {status.content}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>

              {/* Our Values */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h4" gutterBottom>
                    <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
                      Our Values
                    </LinearGradient>
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    {[
                      {
                        title: "Trust",
                        items: [
                          "Verifiable data through blockchain technology",
                          "Transparent operations and communication"
                        ]
                      },
                      {
                        title: "Accessibility",
                        items: [
                          "Easy-to-use service for everyone",
                          "Lowering blockchain technology barriers"
                        ]
                      },
                      {
                        title: "Sustainability",
                        items: [
                          "Building an ecosystem where users, brands, and platform grow together",
                          "Creating long-term value"
                        ]
                      }
                    ].map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                      >
                        <Box 
                          sx={{ 
                            mb: 4,
                            p: 3,
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 8px 32px rgba(26, 35, 126, 0.1)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)'
                            }
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#1a237e',
                              borderBottom: '2px solid #1a237e',
                              pb: 1,
                              mb: 2
                            }}
                          >
                            {value.title}
                          </Typography>
                          <Box>
                            {value.items.map((item, i) => (
                              <Box 
                                key={i} 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  mb: 1
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: '#1a237e',
                                    mr: 2,
                                    mt: 1
                                  }}
                                />
                                <Typography variant="body1" component="div" sx={{ color: '#333' }}>
                                  {item}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </Box>
  )
} 