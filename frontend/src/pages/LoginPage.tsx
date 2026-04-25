import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

import { MICROSOFT_SSO_USERS, useAuth } from '../contexts/AuthContext'
import { useNotification } from '../hooks/useNotification'
import { getRoleLabel } from '../utils/role-label'


interface LoginFormErrors {
  email?: string
  password?: string
}


const getSafeRedirectPath = (search: string) => {
  const redirectPath = new URLSearchParams(search).get('redirect')

  if (!redirectPath || !redirectPath.startsWith('/') || redirectPath.startsWith('/login')) {
    return '/dashboard'
  }

  return redirectPath
}

const validateLoginForm = (email: string, password: string): LoginFormErrors => {
  const errors: LoginFormErrors = {}
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    errors.email = 'Ingresa tu email Microsoft'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Ingresa un email valido'
  }

  if (!password) {
    errors.password = 'Ingresa la clave'
  } else if (password.length < 8) {
    errors.password = 'La clave debe tener al menos 8 caracteres'
  }

  return errors
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const { error: notifyError, success: notifySuccess } = useNotification()
  const theme = useTheme()

  const redirectPath = getSafeRedirectPath(location.search)
  const [email, setEmail] = useState(MICROSOFT_SSO_USERS[0].email)
  const [password, setPassword] = useState('password123')
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const handleMicrosoftLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const nextErrors = validateLoginForm(email, password)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)

    try {
      await login(email.trim().toLowerCase(), password)
      notifySuccess('Sesion iniciada con Microsoft',)
      navigate(redirectPath, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesion'
      setErrorMessage(message)
      notifyError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="img"
              src={theme.nestle.assets.logos.nestWhite}
              alt="Nestle"
              sx={{
                width: 120,
                height: 'auto',
                display: 'inline-block',
              }}
            />
          </Box>

          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3">Iniciar sesion</Typography>
                <Typography variant="body2" color="text.secondary">
                  Acceso hardcoded con Microsoft SSO para demo.
                </Typography>
              </Stack>

              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

              <Box
                component="form"
                onSubmit={handleMicrosoftLogin}
                noValidate
              >
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Email Microsoft"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setFormErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    disabled={loading}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Clave demo"
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setFormErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    disabled={loading}
                    required
                  />

                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    value={email}
                    onChange={(_, value: string | null) => {
                      if (value) {
                        setEmail(value)
                        setPassword('password123')
                        setFormErrors({})
                      }
                    }}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: 1,
                      '& .MuiToggleButtonGroup-grouped': {
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    {MICROSOFT_SSO_USERS.map((microsoftUser) => (
                      <ToggleButton
                        key={microsoftUser.id}
                        value={microsoftUser.email}
                        disabled={loading}
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          px: 2,
                          py: 1.5,
                        }}
                      >
                        <Stack spacing={0.25}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {microsoftUser.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {microsoftUser.email} | {getRoleLabel(microsoftUser.role)}
                          </Typography>
                        </Stack>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Continuar con Microsoft'}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Card>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Sistema de newsletters de Nestle
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
