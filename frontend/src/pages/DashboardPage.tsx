import { Box, Container } from '@mui/material'
import { NotificationsBanner } from '../components/NotificationsBanner'
import { NewslettersTable } from '../components/Table/Table'
import { Toolbar as NewslettersToolbar } from '../components/Table/Toolbar'
import { useAuth } from '../contexts/AuthContext'

export function DashboardPage() {
  const { user } = useAuth()
  const userRole = user?.role ?? 'USER'
  const canCreateNewsletter = userRole === 'ADMIN' || userRole === 'USER'

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <NotificationsBanner />
          <NewslettersToolbar
            canCreateNewsletter={canCreateNewsletter}
          />
          <NewslettersTable role={userRole} />
        </Box>
      </Container>
    </Box>
  )
}
