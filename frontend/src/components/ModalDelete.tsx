import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button 
} from '@mui/material';

interface ModalDeleteProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function ModalDelete({ 
  open, 
  title, 
  description, 
  onClose, 
  onConfirm,
  loading = false 
}: ModalDeleteProps) {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title">
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained" 
          autoFocus 
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}