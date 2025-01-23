import { createTheme } from '@mui/material/styles'

// Extend the theme palette to include neutral color
declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      main: string
      contrastText: string
    }
  }
  interface PaletteOptions {
    neutral: {
      main: string
      contrastText: string
    }
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true
  }
}

// Color Constants
export const colors = {
  primary: {
    main: '#1a237e',
    light: '#534bae',
    dark: '#000051',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#0d47a1',
    light: '#5472d3',
    dark: '#002171',
    contrastText: '#ffffff'
  },
  neutral: {
    main: '#64748B',
    contrastText: '#ffffff'
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#6e6e73',
    disabled: '#86868b'
  },
  background: {
    default: '#f5f5f7',
    paper: '#ffffff'
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828'
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100'
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20'
  }
}

// Typography Constants
export const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif',
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  body1: {
    fontSize: 'clamp(1rem, 1vw + 0.75rem, 1.125rem)',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  }
}

// Spacing and Layout Constants
export const spacing = {
  unit: 8,
  container: {
    maxWidth: 1200,
    padding: {
      xs: 2,
      sm: 3,
      md: 4
    }
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12
  }
}

// Animation Constants
export const animation = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },
  keyframes: {
    fadeInUp: {
      from: {
        opacity: 0,
        transform: 'translateY(20px)'
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)'
      }
    }
  }
}

// Button Styles
export const commonButtonStyles = {
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '20px',
  padding: '12px 24px',
  height: '44px',
  borderRadius: '20px',
  textTransform: 'none' as const,
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.2s'
}

export const storeButtonStyles = {
  ...commonButtonStyles,
  bgcolor: 'rgba(255, 255, 255, 0.9)',
  color: '#000',
  '&:hover': {
    bgcolor: '#fff',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
    filter: 'brightness(1.1)'
  }
}

export const walletButtonStyles = {
  ...commonButtonStyles,
  bgcolor: '#0071e3',
  color: '#fff',
  '&:hover': {
    bgcolor: '#0077ED',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
    filter: 'brightness(1.1)'
  },
  '&[data-connected="true"]': {
    bgcolor: '#000'
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    '&:hover': {
      bgcolor: '#0071e3',
      transform: 'none'
    }
  }
}

// Create and export the theme
export const theme = createTheme({
  palette: colors,
  typography,
  spacing: spacing.unit,
  shape: {
    borderRadius: spacing.borderRadius.medium
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: spacing.borderRadius.medium,
          padding: '8px 16px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: spacing.borderRadius.medium
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: spacing.borderRadius.medium
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',
          textDecoration: 'none'
        }
      }
    }
  }
}) 