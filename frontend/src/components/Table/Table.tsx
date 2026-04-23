import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import RateReviewIcon from '@mui/icons-material/RateReview'
import type { UserRole } from '../../contexts/AuthContext'

type NewsletterStatus = 'Pendiente' | 'Aprobado' | 'Programado' | 'Borrador'

interface NewsletterRow {
  id: string
  title: string
  owner: string
  status: NewsletterStatus
  audience: string
  updatedAt: string
}

const newsletters: NewsletterRow[] = [
  {
    id: 'NL-024',
    title: 'Newsletter Marzo 2024',
    owner: 'Comunicacion',
    status: 'Pendiente',
    audience: 'Todos',
    updatedAt: '15 Mar 2024',
  },
  {
    id: 'NL-023',
    title: 'Promocion Primavera',
    owner: 'Marketing',
    status: 'Programado',
    audience: 'Clientes',
    updatedAt: '12 Mar 2024',
  },
  {
    id: 'NL-022',
    title: 'Lanzamiento interno',
    owner: 'People',
    status: 'Aprobado',
    audience: 'Equipo interno',
    updatedAt: '08 Mar 2024',
  },
  {
    id: 'NL-021',
    title: 'Newsletter Febrero 2024',
    owner: 'Comunicacion',
    status: 'Borrador',
    audience: 'Todos',
    updatedAt: '28 Feb 2024',
  },
]

const getStatusColor = (status: NewsletterStatus) => {
  switch (status) {
    case 'Pendiente':
      return 'warning'
    case 'Aprobado':
      return 'success'
    case 'Programado':
      return 'info'
    case 'Borrador':
      return 'default'
  }
}

interface NewslettersTableProps {
  role: UserRole
}

export function NewslettersTable({ role }: NewslettersTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <MuiTable>
        <TableHead>
          <TableRow>
            <TableCell>Newsletter</TableCell>
            <TableCell>Responsable</TableCell>
            <TableCell>Audiencia</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Actualizacion</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {newsletters.map((newsletter) => (
            <TableRow
              key={newsletter.id}
              hover
              sx={{
                '&:last-child td, &:last-child th': {
                  border: 0,
                },
              }}
            >
              <TableCell>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'brand.red',
                      color: 'brand.white',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {newsletter.id.slice(-2)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {newsletter.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {newsletter.id}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>{newsletter.owner}</TableCell>
              <TableCell>{newsletter.audience}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={newsletter.status}
                  color={getStatusColor(newsletter.status)}
                  variant={newsletter.status === 'Borrador' ? 'outlined' : 'filled'}
                />
              </TableCell>
              <TableCell>{newsletter.updatedAt}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                  {role === 'revisor' && newsletter.status === 'Pendiente' ? (
                    <Button size="small" variant="text" startIcon={<RateReviewIcon />}>
                      Revisar
                    </Button>
                  ) : (
                    <Button size="small" variant="text" startIcon={<VisibilityIcon />}>
                      Ver
                    </Button>
                  )}
                  {(role === 'super-admin' ||
                    (role === 'user' && newsletter.status === 'Borrador')) && (
                    <Button size="small" variant="text" startIcon={<EditIcon />}>
                      Editar
                    </Button>
                  )}
                  <IconButton size="small" aria-label={`Mas acciones para ${newsletter.title}`}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}
