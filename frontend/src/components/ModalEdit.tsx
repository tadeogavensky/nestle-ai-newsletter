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
import type { SelectChangeEvent } from '@mui/material';
import type { User } from '../contexts/AuthContext';
import { AreaName, AreaNameLabel } from '../../../packages/shared/src/enums/area-name.enum';
import { UserRole, UserRoleLabel } from '../../../packages/shared/src/enums/user-role.enum';
import { UserStatus, UserStatusLabel } from '../../../packages/shared/src/enums/user-status.enum';
import { enumToOptions } from '../../../packages/shared/src/utils/enum-to-options';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

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

    const [formData, setFormData] = useState<User | null>(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (name !== 'name' && name !== 'email') return;

        setFormData((prevData) => prevData ? ({
            ...prevData,
            [name]: value,
        }) : prevData);
    };

    const handleRoleChange = (event: SelectChangeEvent<User['role']>) => {
        setFormData((prevData) => prevData ? ({
            ...prevData,
            role: event.target.value as User['role'],
        }) : prevData);
    };

    const handleStateChange = (event: SelectChangeEvent<User['state']>) => {
        setFormData((prevData) => prevData ? ({
            ...prevData,
            state: event.target.value as User['state'],
        }) : prevData);
    };

    const handleAreaChange = (event: SelectChangeEvent<string>) => {
        setFormData((prevData) => prevData ? ({
            ...prevData,
            area: event.target.value,
        }) : prevData);
    };

    const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={handleConfirm}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{description}</DialogContentText>
                    {formData && (
                        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField name="name" label="Nombre" value={formData.name} onChange={handleInputChange} />
                            <TextField name="email" label="Email" value={formData.email} onChange={handleInputChange} />
                            <FormControl>
                                <InputLabel>Rol</InputLabel>
                                <Select<User['role']> name="role" value={formData.role} label="Rol" onChange={handleRoleChange}>
                                    {ROLE_OPTIONS.map(role => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Estado</InputLabel>
                                <Select<User['state']> name="state" value={formData.state} label="Estado" onChange={handleStateChange}>
                                    {STATE_OPTIONS.map(state => (
                                        <MenuItem key={state.value} value={state.value} >
                                            {state.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>Area</InputLabel>
                                <Select<string> name="area" value={formData.area ?? ''} label="Area" onChange={handleAreaChange}>
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
                <DialogActions sx={{ padding: '12px 24px', marginBottom: 3}}>
                <Button onClick={onClose} disabled={loading} variant="contained">
                    Cancelar
                </Button>
                <Button color="success" variant="contained" disabled={loading} type='submit' >
                    Confirmar
                </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
