import { Box, Container } from '@mui/material'
import NotificationsBanner from '../components/dashboard/NotificationsBanner.tsx'
import NewslettersTable from '../components/Table/Table.tsx'
import Toolbar from '../components/Table/Toolbar.tsx'

export function DashboardContent() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <NotificationsBanner />
          <Toolbar />
          <NewslettersTable />
        </Box>
      </Container>
    </Box>
  )
}

export default DashboardContent
