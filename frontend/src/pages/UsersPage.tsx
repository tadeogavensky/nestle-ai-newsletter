import {
  Box,
  Card,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  TableSortLabel,
  InputAdornment,
  Button,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { DeleteOutlined, Search as SearchIcon } from '@mui/icons-material';
import { MICROSOFT_SSO_USERS, type User } from '../contexts/AuthContext'
import { ModalDelete } from '../components/ModalDelete';
import { useState, useMemo } from 'react';
import { ModalEdit } from '../components/ModalEdit'
import { AreaName, AreaNameLabel } from '../../../packages/shared/src/enums/area-name.enum';
import { UserRole, UserRoleLabel } from '../../../packages/shared/src/enums/user-role.enum';
import { UserStatus, UserStatusLabel } from '../../../packages/shared/src/enums/user-status.enum';
import { enumToOptions } from '../../../packages/shared/src/utils/enum-to-options';

const STATE_OPTIONS = enumToOptions(UserStatus, UserStatusLabel);
const AREA_OPTIONS = enumToOptions(AreaName, AreaNameLabel);
const ROLE_OPTIONS = enumToOptions(UserRole, UserRoleLabel);

export function UsersPage() {
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [deletedId, setDeletedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showRemoved, setShowRemoved] = useState(false)
  const [showInactive, setShowInactive] = useState(false)
  const [orderBy, setOrderBy] = useState('name')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [limit, setLimit] = useState(5)

  const handleConfirmDelete = () => {
    setDeletedId(null)
  }

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filteredAndSortedUsers = useMemo(() => {
    return MICROSOFT_SSO_USERS
      .filter(user => {
        if (!showRemoved && user.state === UserStatus.REMOVED) {
          return false
        }
        if (!showInactive && user.state === UserStatus.INACTIVE) {
          return false
        }
        return Object.values(user).some(value =>
          value?.toString().toLowerCase().includes(search.toLowerCase())
        )
      })
      .sort((a, b) => {
        const isAsc = order === 'asc'
        let valueA = a[orderBy as keyof typeof a]
        let valueB = b[orderBy as keyof typeof b]

        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();

        if (valueA < valueB) {
          return isAsc ? -1 : 1
        }
        if (valueA > valueB) {
          return isAsc ? 1 : -1
        }
        return 0
      })
  }, [search, order, orderBy, showRemoved, showInactive])

  const theme = useTheme()

  return (
    <Box
      sx={{
        py: theme.nestle.page.sectionPaddingY,
        px: theme.nestle.page.sectionPaddingX,
        bgcolor: 'background.default',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <Stack spacing={1}>
              <Typography variant="h2">Usuarios</Typography>
              <Typography variant="body1" color="text.secondary">
                Gestion de accesos y roles.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <TextField
                placeholder="Buscar ..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 250 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <Button
                variant={showRemoved ? "contained" : "outlined"}
                onClick={() => {
                  setShowRemoved(!showRemoved)
                  if (limit > 5) setLimit(5)
                }}
                size='small'
              >
                Mostrar Borrados
              </Button>
              <Button
                variant={showInactive ? "contained" : "outlined"}
                onClick={() => {
                  setShowInactive(!showInactive)
                  if (limit > 5) setLimit(5)
                }}
                size='small'
              >
                Mostrar Inactivos
              </Button>
            </Stack>
          </Stack>
          <TableContainer component={Card} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Nombre
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleRequestSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              {filteredAndSortedUsers.length > 0 ? (
                <TableBody>
                  {filteredAndSortedUsers.slice(0, limit).map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{ROLE_OPTIONS.find(option => option.value === user.role)?.label ?? ''}</TableCell>
                      <TableCell>{AREA_OPTIONS.find(option => option.value === user.area)?.label ?? ''}</TableCell>
                      <TableCell sx={{
                        color: user.state === UserStatus.ACTIVE ? 'success.main' : 'error.main', fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase'
                      }}>{STATE_OPTIONS.find(state => state.value === user.state)?.label ?? ''}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Editar">
                            <IconButton size="small" onClick={() => setUserToEdit(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Borrar">
                            <IconButton size="small" color="error" onClick={() => setDeletedId(user.id)}>
                              <DeleteOutlined fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay usuarios para mostrar
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {limit < filteredAndSortedUsers.length && (
            <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
              <Button onClick={() => setLimit(limit + 5)}>
                Cargar más resultados
              </Button>
            </Box>
          )}

        </Stack>
      </Container>
      <ModalDelete
        open={Boolean(deletedId)}
        description={`Esta acción eliminará el usuario de forma permanente. No podrás recuperar la configuración.`}
        onClose={() => setDeletedId(null)}
        onConfirm={handleConfirmDelete}
      />
      <ModalEdit
        open={Boolean(userToEdit)}
        description={`Esta acción modificará la información del usuario.`}
        onClose={() => setUserToEdit(null)}
        user={userToEdit}
      />
    </Box>
  )
}
