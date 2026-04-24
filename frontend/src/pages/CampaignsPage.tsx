import { Box, Button, Card, Chip, Container, Stack, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

export function CampaignsPage() {
  const { user } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  const role = user?.role ?? 'USER'

  const campaigns = [
    { id: 1, name: 'Verano 2024', status: 'Publicado', subscribers: 3200 },
    { id: 2, name: 'Promocion Primavera', status: 'En borrador', subscribers: 0 },
    { id: 3, name: 'Newsletter Mensual', status: 'Programado', subscribers: 5000 },
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
          <Stack spacing={1}>
            <Typography variant="h2">Campanias</Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona todas tus campanias de newsletters
            </Typography>
            <Chip
              label={
                role === 'ADMIN'
                  ? 'Permisos: administrar y publicar'
                  : role === 'FUNCTIONAL'
                    ? 'Permisos: revisar contenido'
                    : 'Permisos: crear y editar borradores propios'
              }
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>

          <Stack spacing={2}>
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 2.5,
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="h6">{campaign.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {campaign.subscribers} suscriptores
                    </Typography>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      bgcolor:
                        campaign.status === 'Publicado'
                          ? 'success.light'
                          : campaign.status === 'En borrador'
                            ? 'warning.light'
                            : 'info.light',
                      color:
                        campaign.status === 'Publicado'
                          ? 'success.main'
                          : campaign.status === 'En borrador'
                            ? 'warning.main'
                            : 'info.main',
                      borderRadius: 1,
                      fontWeight: 600,
                    }}
                  >
                    {campaign.status}
                  </Typography>

                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    <Button size="small" variant="text">
                      Ver
                    </Button>
                    {role === 'ADMIN' && (
                      <>
                        <Button size="small" variant="outlined" onClick={() => navigate(`/editar/${campaign.id}`)}>
                          Editar
                        </Button>
                        <Button size="small" variant="contained">
                          Publicar
                        </Button>
                      </>
                    )}
                    {role === 'FUNCTIONAL' && campaign.status !== 'En borrador' && (
                      <Button size="small" variant="outlined">
                        Revisar
                      </Button>
                    )}
                    {role === 'USER' && campaign.status === 'En borrador' && (
                      <Button size="small" variant="outlined" onClick={() => navigate(`/editar/${campaign.id}`)}>
                        Editar borrador
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
