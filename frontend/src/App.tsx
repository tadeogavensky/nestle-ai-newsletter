import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import nestleBlackLogo from './assets/nestle-black.png'
import nestleWhiteLogo from './assets/nestle-white.png'

const fontSamples = [
  {
    label: 'Nestle Text TF Book',
    family: 'Nestle Text TF Book',
    weight: 400,
    text: 'Newsletter clara para decisiones rapidas.',
  },
  {
    label: 'Nestle Text TF Bold',
    family: 'Nestle Text TF Bold',
    weight: 700,
    text: 'Titulares con peso visual de marca.',
  },
  {
    label: 'Nestle Text TF Italic',
    family: 'Nestle Text TF Italic',
    weight: 400,
    text: 'Notas editoriales con enfasis suave.',
  },
]

function App() {
  const theme = useTheme()

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        py: { xs: 4, md: 7 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              overflow: 'hidden',
              p: { xs: 3, md: 5 },
              borderRadius: 2,
            }}
          >
            <Stack spacing={4}>
              <Box
                component="img"
                src={nestleWhiteLogo}
                alt="Nestle"
                sx={{ width: 180, maxWidth: '60%' }}
              />
              <Stack spacing={2} sx={{ maxWidth: 720 }}>
                <Chip
                  label="AI Newsletter"
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: 'brand.yellowLight',
                    color: 'brand.darkOak',
                  }}
                />
                <Typography variant="h1">
                  Inteligencia para comunicar mejor.
                </Typography>
                <Typography variant="subtitle1">
                  Validacion visual de logos, fuentes y tokens de marca en MUI.
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Ver sistema visual
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ alignItems: 'stretch' }}
          >
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Stack spacing={2}>
                <Typography variant="overline">Logo positivo</Typography>
                <Box
                  component="img"
                  src={nestleBlackLogo}
                  alt="Nestle logo negro"
                  sx={{ width: 220, maxWidth: '100%' }}
                />
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                bgcolor: 'brand.darkOak',
                color: 'brand.white',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="overline">Logo negativo</Typography>
                <Box
                  component="img"
                  src={nestleWhiteLogo}
                  alt="Nestle logo blanco"
                  sx={{ width: 220, maxWidth: '100%' }}
                />
              </Stack>
            </Paper>
          </Stack>

          <Stack spacing={2}>
            <Typography variant="h2">Fuentes cargadas</Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              {fontSamples.map((sample) => (
                <Paper
                  key={sample.label}
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Stack spacing={1.5}>
                    <Typography variant="caption">{sample.label}</Typography>
                    <Typography
                      sx={{
                        fontFamily: sample.family,
                        fontWeight: sample.weight,
                        fontSize: '1.5rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {sample.text}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default App
