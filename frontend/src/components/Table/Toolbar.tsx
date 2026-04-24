import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router'

interface ToolbarProps {
  canCreateNewsletter?: boolean
  modeLabel?: string
}

export function Toolbar({
  canCreateNewsletter = false,
  modeLabel = 'Vista general',
}: ToolbarProps) {
  const navigate = useNavigate()

  const route = () => {
    navigate('/crear')
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        p: 2,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4">Newsletters</Typography>
          <Typography variant="caption" color="text.secondary">
            {modeLabel}
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
        >
          <TextField
            size="small"
            placeholder="Buscar"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography variant="caption" aria-hidden="true">
                      ?
                    </Typography>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: { xs: '100%', sm: 220 } }}
          />

          <ToggleButtonGroup exclusive size="small" value="todos">
            <ToggleButton value="todos">Todos</ToggleButton>
            <ToggleButton value="pendientes">Pendientes</ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined">
            Filtros
          </Button>

          {canCreateNewsletter && (
            <Button variant="contained" onClick={route}>
              Nuevo
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default Toolbar
