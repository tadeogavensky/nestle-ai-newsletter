import React, { useState, useMemo } from 'react'
import {
  Box, Button, Card, Chip, Container, Stack, Typography, useTheme,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, TextField, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../contexts/AuthContext'

// --- 1. DUMMY DATA ---
const DUMMY_LOGS = Array.from({ length: 25 }).map((_, i) => {
  const newsletterId = `news-id-${(i % 5) + 1}`
  const newsletterName = `Newsletter Campaña ${(i % 5) + 1}`
  const states = ['DRAFT', 'REVIEW', 'REJECTED', 'APPROVED']
  return {
    id: `log-${i}`,
    newsletter_id: newsletterId,
    newsletter_name: newsletterName,
    previous_state: states[Math.floor(Math.random() * 3)],
    new_state: states[Math.floor(Math.random() * 4)],
    reviewed_by_user_id: `user-${(i % 3) + 1}`,
    all_commentaries: i % 2 === 0 ? 'Revisión general aplicada. Se ajustaron márgenes y textos.' : null,
    created_at: new Date(Date.now() - i * 10000000).toISOString(),
  }
})

export function AnalyticsPage() {
  const { user } = useAuth()
  const theme = useTheme()
  const role = user?.role ?? 'USER'

  const [selectedNewsletter, setSelectedNewsletter] = useState<{id: string, name: string} | null>(null)
  const [filterText, setFilterText] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof DUMMY_LOGS[0], direction: 'asc' | 'desc' }>({
    key: 'created_at', direction: 'desc'
  })
  const [visibleRows, setVisibleRows] = useState(5)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentComments, setCurrentComments] = useState<string | null>(null)

  const activeLogs = useMemo(() => {
    return selectedNewsletter
      ? DUMMY_LOGS.filter(log => log.newsletter_id === selectedNewsletter.id)
      : DUMMY_LOGS
  }, [selectedNewsletter])

  const metrics = useMemo(() => [
    { label: 'Total de Cambios', value: activeLogs.length },
    { label: 'Rev. con Comentarios', value: activeLogs.filter(l => l.all_commentaries).length },
    { label: 'Aprobaciones', value: activeLogs.filter(l => l.new_state === 'APPROVED').length },
    { label: 'Rechazos', value: activeLogs.filter(l => l.new_state === 'REJECTED').length },
  ], [activeLogs])

  // --- SEGMENTOS DEL GRÁFICO (100%) ---
  const statusSegments = useMemo(() => {
    const counts = { DRAFT: 0, REVIEW: 0, APPROVED: 0, REJECTED: 0 }
    activeLogs.forEach(log => {
      if (counts[log.new_state as keyof typeof counts] !== undefined) {
        counts[log.new_state as keyof typeof counts]++
      }
    })
    
    const total = activeLogs.length || 1
    return [
      { id: 'DRAFT', label: 'Borrador', count: counts.DRAFT, color: 'grey.500', percentage: (counts.DRAFT / total) * 100 },
      { id: 'REVIEW', label: 'En Revisión', count: counts.REVIEW, color: 'info.main', percentage: (counts.REVIEW / total) * 100 },
      { id: 'APPROVED', label: 'Aprobados', count: counts.APPROVED, color: 'success.main', percentage: (counts.APPROVED / total) * 100 },
      { id: 'REJECTED', label: 'Rechazados', count: counts.REJECTED, color: 'error.main', percentage: (counts.REJECTED / total) * 100 },
    ].filter(s => s.count > 0)
  }, [activeLogs])

  const filteredAndSortedLogs = useMemo(() => {
    let filtered = DUMMY_LOGS.filter(log =>
      log.newsletter_name.toLowerCase().includes(filterText.toLowerCase()) ||
      log.new_state.toLowerCase().includes(filterText.toLowerCase())
    )

    filtered.sort((a, b) => {
      const aVal = String(a[sortConfig.key])
      const bVal = String(b[sortConfig.key])
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [filterText, sortConfig])

  const handleSort = (key: keyof typeof DUMMY_LOGS[0]) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleExportCSV = () => {
    const headers = ['Newsletter', 'Estado Anterior', 'Nuevo Estado', 'Fecha', 'Comentarios']
    const csvRows = filteredAndSortedLogs.map(log => [
      `"${log.newsletter_name}"`,
      log.previous_state,
      log.new_state,
      new Date(log.created_at).toLocaleDateString(),
      `"${log.all_commentaries || ''}"`
    ])
    
    const csvContent = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'reporte_estados.csv'
    link.click()
  }

  const handleOpenComments = (e: React.MouseEvent, comments: string | null) => {
    e.stopPropagation()
    setCurrentComments(comments)
    setModalOpen(true)
  }

  return (
    <Box sx={{ py: 4, px: 3, bgcolor: 'background.default' }}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
            <Stack spacing={1}>
              <Typography variant="h2">Historial de Estados</Typography>
              {selectedNewsletter ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="body1" color="text.secondary">
                    Viendo métricas para:
                  </Typography>
                  <Chip 
                    label={selectedNewsletter.name} 
                    onDelete={() => setSelectedNewsletter(null)}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Visualiza el desempeño y cambios de tus campañas
                </Typography>
              )}
            </Stack>

            {role === 'ADMIN' ? (
              <Button variant="contained" onClick={handleExportCSV}>Exportar reporte</Button>
            ) : (
              <Button variant="outlined">Ver detalle</Button>
            )}
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {metrics.map((metric) => (
              <Card key={metric.label} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">{metric.label}</Typography>
                  <Typography variant="h4">{metric.value}</Typography>
                </Stack>
              </Card>
            ))}
          </Box>

          {/* GRÁFICO APILADO (1 Fila = 100%) */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', p: 2.5 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Distribución de Estados (%)
            </Typography>
            
            <Box sx={{ display: 'flex', width: '100%', height: 16, borderRadius: 1, overflow: 'hidden', mb: 2 }}>
              {statusSegments.map(segment => (
                <Box 
                  key={segment.id}
                  sx={{ 
                    width: `${segment.percentage}%`, 
                    bgcolor: segment.color,
                    transition: 'width 0.3s ease-in-out' 
                  }} 
                />
              ))}
            </Box>

            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              {statusSegments.map(segment => (
                <Stack key={`legend-${segment.id}`} direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: segment.color }} />
                  <Typography variant="body2" color="text.secondary">
                    {segment.label} ({segment.percentage.toFixed(1)}%)
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                size="small"
                placeholder="Filtrar por Newsletter o Estado..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                sx={{ width: { xs: '100%', md: '300px' } }}
                InputProps={{
                  endAdornment: filterText ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setFilterText('')} edge="end">
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
              />
            </Box>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['newsletter_name', 'previous_state', 'new_state', 'created_at'].map((key) => (
                      <TableCell key={key}>
                        <TableSortLabel
                          active={sortConfig.key === key}
                          direction={sortConfig.key === key ? sortConfig.direction : 'asc'}
                          onClick={() => handleSort(key as any)}
                        >
                          {key.replace('_', ' ').toUpperCase()}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell align="center">COMENTARIOS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAndSortedLogs.slice(0, visibleRows).map((log) => (
                    <TableRow 
                      key={log.id} 
                      hover 
                      onClick={() => setSelectedNewsletter({ id: log.newsletter_id, name: log.newsletter_name })}
                      selected={selectedNewsletter?.id === log.newsletter_id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{log.newsletter_name}</TableCell>
                      <TableCell>{log.previous_state}</TableCell>
                      <TableCell>
                        <Chip 
                          label={log.new_state} 
                          size="small" 
                          color={log.new_state === 'APPROVED' ? 'success' : log.new_state === 'REJECTED' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{new Date(log.created_at).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        {log.all_commentaries ? (
                          <Button size="small" variant="outlined" onClick={(e) => handleOpenComments(e, log.all_commentaries)}>
                            Ver
                          </Button>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {visibleRows < filteredAndSortedLogs.length && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={() => setVisibleRows(prev => prev + 5)}>
                  Cargar más registros
                </Button>
              </Box>
            )}
          </Card>
        </Stack>
      </Container>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Comentarios de Revisión</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {currentComments}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}