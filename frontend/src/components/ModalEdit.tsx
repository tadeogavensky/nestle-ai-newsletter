import {
    Dialog, DialogTitle, DialogContent, DialogContentText,
    DialogActions, Button,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import type { User } from '../contexts/AuthContext';
import { AreaName, AreaNameLabel } from '../../../packages/shared/src/enums/area-name.enum';
import { UserRole, UserRoleLabel } from '../../../packages/shared/src/enums/user-role.enum';
import { UserStatus, UserStatusLabel } from '../../../packages/shared/src/enums/user-status.enum';
import { enumToOptions } from '../../../packages/shared/src/utils/enum-to-options';

const STATE_OPTIONS = enumToOptions(UserStatus, UserStatusLabel);
const AREA_OPTIONS = enumToOptions(AreaName, AreaNameLabel);
const ROLE_OPTIONS = enumToOptions(UserRole, UserRoleLabel);

interface ModalEditProps {
    open: boolean;
    title?: string;
    user: User | null;
    description?: string;
    onClose: () => void;
    loading?: boolean;
}

export function ModalEdit({
    open,
    title = "¿Confirmar edición?",
    description = "Esta acción guardará los cambios realizados.",
    onClose,
    user,
    loading = false,
}: ModalEditProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
                {user && (
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Nombre" value={user.name} />
                        <TextField label="Email" value={user.email} />
                        <FormControl>
                            <InputLabel>Rol</InputLabel>
                            <Select value={user.role}>
                                {ROLE_OPTIONS.map(role => (
                                    <MenuItem key={role.value} value={role.value}>
                                        {role.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Estado</InputLabel>
                            <Select value={user.state}>
                                {STATE_OPTIONS.map(state => (
                                    <MenuItem key={state.value} value={state.value}>
                                        {state.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Area</InputLabel>
                            <Select value={user.area}>
                                {AREA_OPTIONS.map(area => (
                                    <MenuItem key={area.value} value={area.value}>
                                        {area.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} variant="contained">
                    Cancelar
                </Button>
                <Button color="success" variant="contained" disabled={loading}>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}