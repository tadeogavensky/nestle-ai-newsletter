import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'

type NewsletterStatus = 'APPROVED' | 'DRAFT' | 'IN_REVIEW'

type Newsletter = {
  id: number
  name: string
  template: string
  approver: string
  startDate: string
  status: NewsletterStatus
}

const newsletters: Newsletter[] = [
  {
    id: 1,
    name: 'Newsletter Marzo 2024',
    template: 'Corporativo Standard',
    approver: 'María García',
    startDate: '15/03/2024',
    status: 'APPROVED',
  },
  {
    id: 2,
    name: 'Lanzamiento Producto X',
    template: 'Producto Destacado',
    approver: 'Juan Pérez',
    startDate: '20/03/2024',
    status: 'IN_REVIEW',
  },
  {
    id: 3,
    name: 'Newsletter Abril 2024',
    template: 'Corporativo Standard',
    approver: 'Ana López',
    startDate: '01/04/2024',
    status: 'DRAFT',
  },
  {
    id: 4,
    name: 'Evento Anual',
    template: 'Eventos Especiales',
    approver: 'Carlos Ruiz',
    startDate: '10/04/2024',
    status: 'APPROVED',
  },
  {
    id: 5,
    name: 'Newsletter Mayo 2024',
    template: 'Corporativo Standard',
    approver: 'María García',
    startDate: '01/05/2024',
    status: 'DRAFT',
  },
]

export function NewslettersTable() {
  const theme = useTheme()

  const statusConfig: Record<NewsletterStatus, { label: string; backgroundColor: string }> = {
    APPROVED: {
      label: 'Aprobado',
      backgroundColor: theme.palette.brand.greenLight,
    },
    DRAFT: {
      label: 'Borrador',
      backgroundColor: theme.palette.brand.turquoiseLight,
    },
    IN_REVIEW: {
      label: 'En revisión',
      backgroundColor: theme.palette.brand.purpleLight,
    },
  }

  return (
    <Card>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
        <Typography variant="h6">Historial de newsletters</Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Template usado
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Aprobador</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Fecha de inicio
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {newsletters.map((newsletter) => {
              const status = statusConfig[newsletter.status]

              return (
                <TableRow key={newsletter.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {newsletter.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{newsletter.template}</TableCell>
                  <TableCell>{newsletter.approver}</TableCell>
                  <TableCell>{newsletter.startDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: status.backgroundColor,
                        color: 'text.primary',
                        boxShadow: 'none',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label={`Ver acciones para ${newsletter.name}`}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        ...
                      </Typography>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 3,
          py: 2,
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Mostrando 1 a 5 de 5
        </Typography>
        <Button variant="outlined" size="small">
          Exportar
        </Button>
      </Box>
    </Card>
  )
}

export default NewslettersTable
