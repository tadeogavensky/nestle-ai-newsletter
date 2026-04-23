import { Box, Button, Card, Chip, Container, Stack, Typography, useTheme } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useAuth } from '../contexts/AuthContext'

export function AnalyticsPage() {
  const { user } = useAuth()
  const theme = useTheme()
  const role = user?.role ?? 'user'

  const metrics = [
    { label: 'Total abiertos', value: '2,156', trend: '+12%' },
    { label: 'Clics', value: '832', trend: '+8%' },
    { label: 'Conversiones', value: '124', trend: '+5%' },
    { label: 'Tasa de rebote', value: '22%', trend: '-3%' },
  ]

  return (
    <Box
      sx={{
        py: theme.nestle.page.sectionPaddingY,
        px: theme.nestle.page.sectionPaddingX,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
          >
            <Stack spacing={1}>
              <Typography variant="h2">Analitica</Typography>
              <Typography variant="body1" color="text.secondary">
                Visualiza el desempenio de tus campanias
              </Typography>
              <Chip
                label={
                  role === 'super-admin'
                    ? 'Vista global de todas las campanias'
                    : 'Vista de campanias asignadas a revision'
                }
                sx={{ alignSelf: 'flex-start' }}
              />
            </Stack>

            {role === 'super-admin' ? (
              <Button variant="contained" startIcon={<DownloadIcon />}>
                Exportar reporte
              </Button>
            ) : (
              <Button variant="outlined" startIcon={<VisibilityIcon />}>
                Ver detalle
              </Button>
            )}
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 2.5,
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    {metric.label}
                  </Typography>
                  <Typography variant="h4">{metric.value}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: metric.trend.startsWith('-') ? 'error.main' : 'success.main',
                      fontWeight: 600,
                    }}
                  >
                    {metric.trend}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
