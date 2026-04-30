import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import type { ChipProps } from '@mui/material'
import { RateReviewOutlined as ReviewIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from '../components/SearchBar'

interface NewsletterReview {
  id: string
  title: string
  author: string
  area: string
  status: 'pending' | 'reviewed' | 'approved'
  submittedDate: string
  content: string
}

const reviews: NewsletterReview[] = [
  {
    id: '1',
    title: 'Newsletter - Marzo 2024',
    author: 'Juan Perez',
    area: 'Marketing',
    status: 'pending',
    submittedDate: '2024-03-15',
    content: 'Contenido de newsletter para marzo...',
  },
  {
    id: '2',
    title: 'Promocion de Primavera',
    author: 'Maria Garcia',
    area: 'Ventas',
    status: 'pending',
    submittedDate: '2024-03-16',
    content: 'Contenido de promocion...',
  },
  {
    id: '3',
    title: 'Newsletter - Febrero 2024',
    author: 'Pedro Lopez',
    area: 'Marketing',
    status: 'approved',
    submittedDate: '2024-02-28',
    content: 'Contenido aprobado...',
  },
]

const getStatusColor = (status: NewsletterReview['status']): ChipProps['color'] => {
  switch (status) {
    case 'pending':  return 'warning'
    case 'reviewed': return 'info'
    case 'approved': return 'success'
  }
}

const getStatusLabel = (status: NewsletterReview['status']) => {
  switch (status) {
    case 'pending':  return 'Pendiente'
    case 'reviewed': return 'Revisado'
    case 'approved': return 'Aprobado'
  }
}

type SortableKey = 'title' | 'author' | 'area' | 'status' | 'submittedDate'

export function ReviewsPage() {
  const { user } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()

  const [search, setSearch]   = useState('')
  const [orderBy, setOrderBy] = useState<SortableKey>('submittedDate')
  const [order, setOrder]     = useState<'asc' | 'desc'>('desc')
  const [limit, setLimit]     = useState(5)

  const isAdmin = user?.role === 'ADMIN'

  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => isAdmin || r.area === user?.area)
      .filter((r) =>
        Object.values(r).some((v) =>
          v?.toString().toLowerCase().includes(search.toLowerCase())
        )
      )
      .sort((a, b) => {
        const isAsc = order === 'asc'
        return (a[orderBy] < b[orderBy] ? -1 : 1) * (isAsc ? 1 : -1)
      })
  }, [search, order, orderBy, isAdmin, user?.area])

  const handleRequestSort = (property: SortableKey) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortLabel = (label: string, key: SortableKey) => (
    <TableSortLabel
      active={orderBy === key}
      direction={orderBy === key ? order : 'asc'}
      onClick={() => handleRequestSort(key)}
    >
      {label}
    </TableSortLabel>
  )

  return (
    <Box
      sx={{
        py: theme.nestle.page.sectionPaddingY,
        px: theme.nestle.page.sectionPaddingX,
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>

          {/* Header */}
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Stack spacing={1}>
              <Typography variant="h2">Revisión de Newsletters</Typography>
              <Typography variant="body1" color="text.secondary">
                {isAdmin
                  ? 'Revisá todos los newsletters pendientes.'
                  : `Mostrando newsletters de tu área: ${user?.area}.`}
              </Typography>
            </Stack>

            <SearchBar value={search} onChange={setSearch} />
          </Stack>

          {/* Tabla */}
          <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>{sortLabel('Título', 'title')}</TableCell>
                  <TableCell>{sortLabel('Autor', 'author')}</TableCell>
                  <TableCell>{sortLabel('Área', 'area')}</TableCell>
                  <TableCell>{sortLabel('Estado', 'status')}</TableCell>
                  <TableCell>{sortLabel('Fecha', 'submittedDate')}</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Stack spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="h6">¡Todo al día! 🎉</Typography>
                        <Typography variant="body2" color="text.secondary">
                          No hay newsletters pendientes de revisión por ahora.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.slice(0, limit).map((review) => (
                    <TableRow key={review.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{review.title}</Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          sx={{ maxWidth: 220, display: 'block' }}
                        >
                          {review.content}
                        </Typography>
                      </TableCell>

                      <TableCell>{review.author}</TableCell>
                      <TableCell>{review.area}</TableCell>

                      <TableCell>
                        <Chip
                          label={getStatusLabel(review.status)}
                          color={getStatusColor(review.status)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(review.submittedDate).toLocaleDateString()}
                      </TableCell>

                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                          {review.status === 'pending' && (
                            <Tooltip title="Revisar">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/reviews/${review.id}`)}
                              >
                                <ReviewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {limit < filteredReviews.length && (
              <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={() => setLimit((l) => l + 5)}>
                  Cargar más resultados
                </Button>
              </Box>
            )}
          </TableContainer>

        </Stack>
      </Container>
    </Box>
  )
}