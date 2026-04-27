import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import type { ChipProps } from '@mui/material'
import { useAuth } from '../../auth/AuthContext'
import { useAppNotifications } from '../../../shared/contexts/NotificationContext'
import { useNotification } from '../../../shared/hooks/useNotification'

interface NewsletterReview {
  id: string
  title: string
  author: string
  status: 'pending' | 'reviewed' | 'approved'
  submittedDate: string
  content: string
}

export function ReviewsPage() {
  const { user } = useAuth()
  const { addNotification, addNotificationForUser } = useAppNotifications()
  const { success } = useNotification()
  const theme = useTheme()

  const reviews: NewsletterReview[] = [
    {
      id: '1',
      title: 'Newsletter - Marzo 2024',
      author: 'Juan Perez',
      status: 'pending',
      submittedDate: '2024-03-15',
      content: 'Contenido de newsletter para marzo...',
    },
    {
      id: '2',
      title: 'Promocion de Primavera',
      author: 'Maria Garcia',
      status: 'pending',
      submittedDate: '2024-03-16',
      content: 'Contenido de promocion...',
    },
    {
      id: '3',
      title: 'Newsletter - Febrero 2024',
      author: 'Pedro Lopez',
      status: 'approved',
      submittedDate: '2024-02-28',
      content: 'Contenido aprobado...',
    },
  ]

  const pendingReviews = reviews.filter((review) => review.status === 'pending')
  const canAssignReview = user?.role === 'ADMIN'

  const handleApprove = (id: string) => {
    success(`Newsletter #${id} aprobado correctamente`)
    addNotification({
      type: 'approved',
      title: 'Newsletter aprobado',
      message: `Aprobaste el newsletter #${id}`,
      actionPath: '/reviews',
    })
    addNotificationForUser('3', {
      type: 'approved',
      title: 'Newsletter aprobado',
      message: `Tu newsletter #${id} fue aprobado`,
      actionPath: '/campaigns',
    })
  }

  const handleReject = (id: string) => {
    success(`Newsletter #${id} rechazado`)
    addNotification({
      type: 'rejected',
      title: 'Newsletter rechazado',
      message: `Rechazaste el newsletter #${id}`,
      actionPath: '/reviews',
    })
    addNotificationForUser('3', {
      type: 'rejected',
      title: 'Newsletter rechazado',
      message: `Tu newsletter #${id} necesita cambios`,
      actionPath: '/campaigns',
    })
  }

  const handleAssign = (id: string) => {
    success(`Newsletter #${id} asignado a revision`)
    addNotificationForUser('2', {
      type: 'pending-review',
      title: 'Nueva revision asignada',
      message: `Tenes asignado el newsletter #${id}`,
      actionPath: '/reviews',
    })
  }

  const getStatusColor = (status: NewsletterReview['status']): ChipProps['color'] => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'reviewed':
        return 'info'
      case 'approved':
        return 'success'
    }
  }

  const getStatusLabel = (status: NewsletterReview['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'reviewed':
        return 'Revisado'
      case 'approved':
        return 'Aprobado'
    }
  }

  return (
    <Box
      sx={{
        py: theme.nestle.page.sectionPaddingY,
        px: theme.nestle.page.sectionPaddingX,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          <Stack spacing={1}>
            <Typography variant="h2">Revision de Newsletters</Typography>
            <Typography variant="body1" color="text.secondary">
              Revisa y aprueba los newsletters pendientes
            </Typography>
            <Chip
              label={
                canAssignReview
                  ? 'Permisos: asignar, aprobar y rechazar'
                  : 'Permisos: aprobar y rechazar asignados'
              }
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: 2.5,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ color: 'warning.main' }}>
                {pendingReviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes de revisar
              </Typography>
            </Card>

            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: 2.5,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ color: 'success.main' }}>
                {reviews.filter((review) => review.status === 'approved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aprobados
              </Typography>
            </Card>

            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                p: 2.5,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" sx={{ color: 'info.main' }}>
                {reviews.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de newsletters
              </Typography>
            </Card>
          </Box>

          <Stack spacing={2}>
            {reviews.map((review) => (
              <Card
                key={review.id}
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', p: 3 }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1.5}
                    sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6">{review.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Por: {review.author} | {review.submittedDate}
                      </Typography>
                    </Stack>
                    <Chip label={getStatusLabel(review.status)} color={getStatusColor(review.status)} />
                  </Stack>

                  <Typography variant="body2">{review.content}</Typography>

                  {review.status === 'pending' && (
                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      {canAssignReview && (
                        <Button
                          variant="outlined"
                          color="info"
                          size="small"
                          onClick={() => handleAssign(review.id)}
                        >
                          Asignar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(review.id)}
                      >
                        Aprobar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleReject(review.id)}
                      >
                        Rechazar
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
