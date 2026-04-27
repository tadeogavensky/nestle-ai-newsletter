import { Box } from '@mui/material'
import { BrowserRouter as Router, Route, Routes } from 'react-router'
import { AuthProvider } from './features/auth/AuthContext'
import { NotificationProvider } from './shared/contexts/NotificationContext'
import { AlertProvider, useNotification } from './shared/hooks/useNotification'
import { NotificationManager } from './shared/components/notifications/NotificationManager'
import { ProtectedRoute } from './shared/components/layout/ProtectedRoute'
import { ProtectedLayout } from './shared/components/layout/ProtectedLayout'
import { LoginPage } from './features/auth/pages/LoginPage'
import { DashboardPage } from './features/newsletters/pages/DashboardPage'
import CreatePage from './features/creation/pages/CreatePage'
import { EditPage } from './features/templates/pages/EditPage'
import { CampaignsPage } from './features/newsletters/pages/CampaignsPage'
import { AnalyticsPage } from './features/analytics/pages/AnalyticsPage'
import { ReviewsPage } from './features/reviews/pages/ReviewsPage'
import { UsersPage } from './features/users/pages/UsersPage'
import { SettingsPage } from './features/settings/pages/SettingsPage'
import { DemoPage } from './features/demo/DemoPage'

function AppRouter() {
  const { notifications, removeNotification } = useNotification()

  return (
    <Box sx={{ position: 'relative' }}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo" element={<DemoPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/crear"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <CreatePage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar/:id"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <EditPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <CampaignsPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'FUNCTIONAL']}>
                <ProtectedLayout>
                  <AnalyticsPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'FUNCTIONAL']}>
                <ProtectedLayout>
                  <ReviewsPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ProtectedLayout>
                  <UsersPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <SettingsPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect to login by default */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>

      {/* Global notification manager */}
      <NotificationManager
        notifications={notifications}
        onClose={removeNotification}
      />
    </Box>
  )
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </AlertProvider>
    </AuthProvider>
  )
}

export default App
