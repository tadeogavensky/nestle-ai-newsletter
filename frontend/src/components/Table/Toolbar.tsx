import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router' // 1. Import the hook

export function Toolbar() {
  const navigate = useNavigate();

  const route = () => {
    navigate('/crear');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        <Button variant="contained" onClick={route}>Nuevo newsletter</Button>
        <Button variant="outlined">Filtrar</Button>
        <Button variant="outlined">Ordenar</Button>
      </Box>

      <TextField
        placeholder="Buscar newsletters..."
        size="small"
        sx={{ width: { xs: '100%', md: 320 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2" color="text.secondary">
                  Buscar
                </Typography>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  )
}

export default Toolbar