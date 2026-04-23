import {
  Box,
  Typography,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  ButtonBase,
  Stack,
  IconButton,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppNotifications, type AppNotification } from '../contexts/NotificationContext'

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'pending-review':
      return DescriptionIcon
    case 'approved':
      return CheckCircleIcon
    case 'rejected':
      return CancelIcon
    case 'reminder':
      return WarningIcon
    default:
      return InfoIcon
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'pending-review':
      return '#FFB81C' // Nestle Orange
    case 'approved':
      return '#6BB33D' // Nestle Green
    case 'rejected':
      return '#D41D3D' // Nestle Red
    case 'reminder':
      return '#FF9800' // Warning Orange
    default:
      return '#00BCD4' // Turquoise
  }
}

const initialCurrentTime = Date.now()

const formatTime = (timestamp: number, now: number): string => {
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`
  return new Date(timestamp).toLocaleDateString('es-ES')
}

export function NotificationsBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialCurrentTime)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useAppNotifications()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 60 * 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const handleNotificationClick = (notification: AppNotification) => {
    markAsRead(notification.id)
    if (notification.actionPath) {
      navigate(notification.actionPath)
      setIsOpen(false)
    }
  }

  return (
    <Box ref={panelRef} sx={{ position: 'relative' }}>
      {/* Banner */}
      <ButtonBase
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderRadius: 1.5,
          bgcolor: 'brand.white',
          px: 2,
          py: 1.5,
          color: 'brand.darkOak',
          transition: 'all 0.2s',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'grey.50',
            borderColor: 'brand.red',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Badge
            badgeContent={unreadCount}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: 'brand.red',
                color: 'brand.white',
                fontWeight: 700,
                fontSize: 11,
                minWidth: 20,
                height: 20,
                borderRadius: '50%',
              },
            }}
          >
            <NotificationsIcon sx={{ fontSize: 20, color: 'brand.red' }} />
          </Badge>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Notificaciones
          </Typography>
        </Box>
      </ButtonBase>

      {/* Dropdown Panel */}
      <Collapse in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            zIndex: 9999,
            mt: 1,
            borderRadius: 1.5,
            overflow: 'hidden',
            maxHeight: 400,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {notifications.length} notificaciones
            </Typography>
            {unreadCount > 0 && (
              <ButtonBase onClick={markAllAsRead} sx={{ fontSize: 12, color: 'brand.red' }}>
                Marcar todo como leído
              </ButtonBase>
            )}
          </Box>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <List
              disablePadding
              sx={{
                overflowY: 'auto',
                flex: 1,
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'divider',
                  borderRadius: 3,
                },
              }}
            >
              {notifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type)
                const notifColor = getNotificationColor(notification.type)

                return (
                  <ListItem
                    key={notification.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderBottom: index < notifications.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: notification.isRead ? 'grey.50' : 'action.selected',
                      },
                      position: 'relative',
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 3,
                          bgcolor: 'brand.red',
                        }}
                      />
                    )}

                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          bgcolor: `${notifColor}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 18, color: notifColor }} />
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            {formatTime(notification.timestamp, currentTime)}
                          </Typography>
                        </Stack>
                      }
                      slotProps={{
                        primary: {
                          variant: 'body2',
                          sx: {
                            fontWeight: notification.isRead ? 400 : 600,
                            color: 'text.primary',
                          },
                        },
                      }}
                    />

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNotification(notification.id)
                      }}
                      sx={{
                        opacity: 0.5,
                        '&:hover': {
                          opacity: 1,
                        },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </ListItem>
                )
              })}
            </List>
          ) : (
            <Box
              sx={{
                py: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">No hay notificaciones</Typography>
            </Box>
          )}
        </Paper>
      </Collapse>
    </Box>
  )
}
