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
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'

interface ToolbarProps {
  canCreateNewsletter: boolean
  modeLabel: string
}

export function Toolbar({ canCreateNewsletter, modeLabel }: ToolbarProps) {
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
                    <SearchIcon fontSize="small" />
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

          <Button variant="outlined" startIcon={<TuneIcon />}>
            Filtros
          </Button>

          {canCreateNewsletter && (
            <Button variant="contained" startIcon={<AddIcon />}>
              Nuevo
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}
