import { createTheme } from '@mui/material/styles';
import nestleBoldTtf from '../assets/fonts/NestleTextTF-Bold.ttf';
import nestleBoldWoff from '../assets/fonts/NestleTextTF-Bold.woff';
import nestleBoldWoff2 from '../assets/fonts/NestleTextTF-Bold.woff2';
import nestleBookTtf from '../assets/fonts/NestleTextTF-Book.ttf';
import nestleBookWoff from '../assets/fonts/NestleTextTF-Book.woff';
import nestleBookWoff2 from '../assets/fonts/NestleTextTF-Book.woff2';
import nestleItalicTtf from '../assets/fonts/NestleTextTF-Italic.ttf';
import nestleItalicWoff from '../assets/fonts/NestleTextTF-Italic.woff';
import nestleItalicWoff2 from '../assets/fonts/NestleTextTF-Italic.woff2';

const nestleBookFontFamily = 'Nestle Text TF Book';
const nestleBoldFontFamily = 'Nestle Text TF Bold';
const nestleItalicFontFamily = 'Nestle Text TF Italic';

const bodyFontStack = [nestleBookFontFamily, 'Arial', 'sans-serif'].join(',');
const boldFontStack = [nestleBoldFontFamily, 'Arial', 'sans-serif'].join(',');

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

const theme = createTheme({
  shape: {
    borderRadius: 8,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#FF595A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00A0DF',
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
    fontFamily: bodyFontStack,
    h1: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1,
      letterSpacing: 0,
    },
    h2: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.05,
      letterSpacing: 0,
    },
    h3: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.08,
      letterSpacing: 0,
    },
    h4: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.12,
      letterSpacing: 0,
    },
    h5: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.15,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    subtitle1: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    subtitle2: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: 1.35,
      letterSpacing: 0,
    },
    body1: {
      fontFamily: bodyFontStack,
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    body2: {
      fontFamily: bodyFontStack,
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.55,
      letterSpacing: 0,
    },
    button: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '0.95rem',
      lineHeight: 1.2,
      letterSpacing: 0,
      textTransform: 'none',
    },
    caption: {
      fontFamily: bodyFontStack,
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    overline: {
      fontFamily: boldFontStack,
      fontWeight: 700,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: 0,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: '${nestleBookFontFamily}';
          src:
            url('${nestleBookWoff2}') format('woff2'),
            url('${nestleBookWoff}') format('woff'),
            url('${nestleBookTtf}') format('truetype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: '${nestleBoldFontFamily}';
          src:
            url('${nestleBoldWoff2}') format('woff2'),
            url('${nestleBoldWoff}') format('woff'),
            url('${nestleBoldTtf}') format('truetype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: '${nestleItalicFontFamily}';
          src:
            url('${nestleItalicWoff2}') format('woff2'),
            url('${nestleItalicWoff}') format('woff'),
            url('${nestleItalicTtf}') format('truetype');
          font-weight: 400;
          font-style: italic;
          font-display: swap;
        }

        :root {
          --nestle-red: #FF595A;
          --nestle-dark-oak: #30261D;
          --nestle-white: #FFFFFF;
          --nestle-blue-dark: #00A0DF;
          --nestle-blue-light: #97CAEB;
          --nestle-green-dark: #61A60E;
          --nestle-green-light: #A2D45E;
          --nestle-turquoise-dark: #00AFAA;
          --nestle-turquoise-light: #99D9D9;
          --nestle-purple-dark: #B14FC5;
          --nestle-purple-light: #CB8BDA;
          --nestle-orange: #FF8300;
          --nestle-yellow-dark: #F5A800;
          --nestle-yellow-light: #FFC600;
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 20,
          paddingBlock: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontFamily: boldFontStack,
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
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
