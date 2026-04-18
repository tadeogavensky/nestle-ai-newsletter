import { createTheme, responsiveFontSizes } from '@mui/material/styles';

/**
 * We make Nestlé – MUI Theme
 *
 * Notes:
 * - Colors and font roles are taken from the Nestlé internal communication guidelines.
 * - Typography sizes are proposed for product UI usage because the guide defines font families
 *   and usage roles, but does not publish a UI type scale.
 * - Nestlé proprietary fonts must be available in the app (self-hosted or loaded separately).
 */

declare module '@mui/material/styles' {
  interface Palette {
    brand: {
      red: string;
      darkOak: string;
      white: string;
      blueDark: string;
      blueLight: string;
      greenDark: string;
      greenLight: string;
      turquoiseDark: string;
      turquoiseLight: string;
      purpleDark: string;
      purpleLight: string;
      orange: string;
      yellowDark: string;
      yellowLight: string;
      keywordShadows: {
        yellow: string;
        purple: string;
        turquoise: string;
        green: string;
        blue: string;
        orange: string;
      };
    };
  }

  interface PaletteOptions {
    brand?: {
      red?: string;
      darkOak?: string;
      white?: string;
      blueDark?: string;
      blueLight?: string;
      greenDark?: string;
      greenLight?: string;
      turquoiseDark?: string;
      turquoiseLight?: string;
      purpleDark?: string;
      purpleLight?: string;
      orange?: string;
      yellowDark?: string;
      yellowLight?: string;
      keywordShadows?: {
        yellow?: string;
        purple?: string;
        turquoise?: string;
        green?: string;
        blue?: string;
        orange?: string;
      };
    };
  }
}

const baseTheme = createTheme({
  shape: {
    borderRadius: 12,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#FF595A', // Red
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00A0DF', // Blue dark
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF595A',
    },
    warning: {
      main: '#F5A800',
      contrastText: '#30261D',
    },
    success: {
      main: '#61A60E',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#00AFAA',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#30261D',
      secondary: 'rgba(48, 38, 29, 0.72)',
      disabled: 'rgba(48, 38, 29, 0.48)',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    divider: 'rgba(48, 38, 29, 0.12)',
    brand: {
      red: '#FF595A',
      darkOak: '#30261D',
      white: '#FFFFFF',
      blueDark: '#00A0DF',
      blueLight: '#97CAEB',
      greenDark: '#61A60E',
      greenLight: '#A2D45E',
      turquoiseDark: '#00AFAA',
      turquoiseLight: '#99D9D9',
      purpleDark: '#B14FC5',
      purpleLight: '#CB8BDA',
      orange: '#FF8300',
      yellowDark: '#F5A800',
      yellowLight: '#FFC600',
      keywordShadows: {
        yellow: '#EBB600',
        purple: '#B97FC7',
        turquoise: '#8EC9C9',
        green: '#94C256',
        blue: '#88B6D4',
        orange: '#F07B00',
      },
    },
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: [
      'Nestle Text TF Book Cnd',
      'Nestlé Text TF Book Cnd',
      'Arial Narrow',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    h2: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.05,
      letterSpacing: '0.01em',
    },
    h3: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.08,
    },
    h4: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.1,
    },
    h5: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.15,
    },
    h6: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontFamily: [
        'Nestle Text TF Bold',
        'Nestlé Text TF Bold',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    subtitle2: {
      fontFamily: [
        'Nestle Text TF Bold',
        'Nestlé Text TF Bold',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.35,
    },
    body1: {
      fontFamily: [
        'Nestle Text TF Book Cnd',
        'Nestlé Text TF Book Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: [
        'Nestle Text TF Book Cnd',
        'Nestlé Text TF Book Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.55,
    },
    button: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '0.95rem',
      lineHeight: 1.2,
      textTransform: 'none',
    },
    caption: {
      fontFamily: [
        'Nestle Text TF Book Cnd',
        'Nestlé Text TF Book Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    overline: {
      fontFamily: [
        'Nestle Text TF Bold Cnd',
        'Nestlé Text TF Bold Cnd',
        'Arial Narrow',
        'Arial',
        'sans-serif',
      ].join(','),
      fontWeight: 700,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--nestle-red': '#FF595A',
          '--nestle-dark-oak': '#30261D',
          '--nestle-white': '#FFFFFF',
          '--nestle-blue-dark': '#00A0DF',
          '--nestle-blue-light': '#97CAEB',
          '--nestle-green-dark': '#61A60E',
          '--nestle-green-light': '#A2D45E',
          '--nestle-turquoise-dark': '#00AFAA',
          '--nestle-turquoise-light': '#99D9D9',
          '--nestle-purple-dark': '#B14FC5',
          '--nestle-purple-light': '#CB8BDA',
          '--nestle-orange': '#FF8300',
          '--nestle-yellow-dark': '#F5A800',
          '--nestle-yellow-light': '#FFC600',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          paddingBlock: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontFamily: [
            'Nestle Text TF Bold Cnd',
            'Nestlé Text TF Bold Cnd',
            'Arial Narrow',
            'Arial',
            'sans-serif',
          ].join(','),
          fontWeight: 700,
        },
        filled: {
          backgroundColor: '#FFC600',
          color: '#30261D',
          boxShadow: '4px 4px 0 #EBB600',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
});

const theme = responsiveFontSizes(baseTheme, {
  factor: 2,
  variants: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1'],
});

export default theme;
