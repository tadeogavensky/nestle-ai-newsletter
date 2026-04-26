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
} from '@mui/material';
import { useNavigate } from 'react-router'; // <--- De 'Incoming'
import type { UserRole } from '../../contexts/AuthContext';

type NewsletterStatus = 'Pendiente' | 'Aprobado' | 'Programado' | 'Borrador';

interface NewsletterRow {
  id: string;
  title: string;
  owner: string;
  status: NewsletterStatus;
  audience: string;
  updatedAt: string;
}

const getStatusColor = (status: NewsletterStatus) => {
  switch (status) {
    case 'Pendiente': return 'warning';
    case 'Aprobado': return 'success';
    case 'Programado': return 'info';
    case 'Borrador': return 'default';
    default: return 'default';
  }
};

interface NewslettersTableProps {
  role?: UserRole;
}

export function NewslettersTable({ role = 'USER' }: NewslettersTableProps) {
  const navigate = useNavigate(); // <--- De 'Incoming'
  
  // --- Lógica de Paginado (De 'Current') ---
  const [data, setData] = useState<NewsletterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/newsletters`, {
        params: {
          page: page + 1,
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
  }, [page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <TableContainer>
        <MuiTable sx={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
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
            {data.map((newsletter) => (
              <TableRow key={newsletter.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'brand.red', color: 'brand.white', fontSize: 14, fontWeight: 700 }}>
                      {newsletter.id.slice(-2)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{newsletter.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{newsletter.id}</Typography>
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
                      <Button size="small" variant="text">Revisar</Button>
                    ) : (
                      <Button size="small" variant="text" onClick={() => navigate(`/ver/${newsletter.id}`)}>Ver</Button>
                    )}
                    
                    {(role === 'ADMIN' || role === 'USER') && (
                      <Button 
                        size="small" 
                        variant="text" 
                        onClick={() => navigate(`/editar/${newsletter.id}`)} // <--- Navegación de 'Incoming'
                      >
                        Editar
                      </Button>
                    )}
                    <IconButton size="small">...</IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>

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

export default NewslettersTable;
