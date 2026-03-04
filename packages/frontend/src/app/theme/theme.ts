import { createTheme } from '@mui/material/styles'

/** Figma design tokens - Dark mode chorus screen */
export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#05020a',
      paper: '#05020a',
    },
    primary: {
      main: '#e9d5ff',
      light: '#f5f3ff',
    },
    text: {
      primary: '#f5f3ff',
      secondary: '#d6c7e6',
    },
    divider: '#4a2f7a',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "sans-serif"',
    h4: {
      fontWeight: 700,
      fontSize: '20px',
      lineHeight: 1.2,
      color: '#f9fafb',
    },
    body1: {
      fontWeight: 600,
      fontSize: '32px',
      lineHeight: 1.2,
      color: '#f5f3ff',
    },
    body2: {
      fontWeight: 500,
      fontSize: '22px',
      lineHeight: 1.4,
      color: '#d6c7e6',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#05020a',
        },
      },
    },
  },
})
