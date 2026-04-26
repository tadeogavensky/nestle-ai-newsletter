import { useEffect, useState } from 'react';
import axios from 'axios';
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
  TablePagination,
  Typography,
} from '@mui/material'
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
    default:
      return 'default'
  }
}

interface NewslettersTableProps {
  role?: UserRole
}

export function NewslettersTable({ role = 'USER' }: NewslettersTableProps) {
  const [data, setData] = useState<NewsletterRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el paginado
  const [page, setPage] = useState(0); // MUI usa base 0 para el paginado
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      // Llamamos a tu backend (ajusta la URL según tu config)
      const response = await axios.get(`http://localhost:3000/newsletters`, {
        params: {
          page: page + 1, // El backend usa base 1
          limit: rowsPerPage
        }
      });
      setData(response.data.data);
      setTotalRecords(response.data.meta.total);
    } catch (error) {
      console.error("Error cargando newsletters", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [page, rowsPerPage]); // Se ejecuta cada vez que cambias de página

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /*return (
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
                  {role === 'FUNCTIONAL' && newsletter.status === 'Pendiente' ? (
                    <Button size="small" variant="text">
                      Revisar
                    </Button>
                  ) : (
                    <Button size="small" variant="text">
                      Ver
                    </Button>
                  )}
                  {(role === 'ADMIN' ||
                    (role === 'USER' && newsletter.status === 'Borrador')) && (
                    <Button size="small" variant="text">
                      Editar
                    </Button>
                  )}
                  <IconButton size="small" aria-label={`Mas acciones para ${newsletter.title}`}>
                    <Typography variant="body2" aria-hidden="true">
                      ...
                    </Typography>
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )*/

  return (
    <Paper>
      <TableContainer>
        <MuiTable>
          {/* ... tu TableHead y TableBody usando 'data' en lugar de 'newsletters' ... */}
        </MuiTable>
      </TableContainer>
      
      {/* EL COMPONENTE DE PAGINADO */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        labelRowsPerPage="Filas por página:"
      />
    </Paper>
  );
}

export default NewslettersTable
