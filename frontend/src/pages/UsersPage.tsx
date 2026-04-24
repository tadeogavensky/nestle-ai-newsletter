import {
  Box,
  Card,
  Chip,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { MICROSOFT_SSO_USERS } from '../contexts/AuthContext'
import { getRoleLabel } from '../utils/role-label'

export function UsersPage() {
  const theme = useTheme()

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
            <Typography variant="h2">Usuarios</Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona las cuentas Microsoft habilitadas para el sistema
            </Typography>
          </Stack>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.paper' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email Microsoft</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MICROSOFT_SSO_USERS.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleLabel(user.role)}</TableCell>
                      <TableCell>
                        <Chip size="small" color="success" label="Activo" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}
