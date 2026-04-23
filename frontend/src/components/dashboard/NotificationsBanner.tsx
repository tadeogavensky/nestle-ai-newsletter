import { useEffect, useRef, useState } from 'react'
import {
  Badge,
  Box,
  ButtonBase,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  type Theme,
  useTheme,
} from '@mui/material'

type NotificationItem = {
  id: number
  category: string
  text: string
  time: string
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    category: 'Pendiente',
    text: 'Nuevo newsletter pendiente de aprobación',
    time: 'Hace 5 min',
  },
  {
    id: 2,
    category: 'Aprobado',
    text: "Newsletter 'Marzo 2024' ha sido aprobado",
    time: 'Hace 2 horas',
  },
  {
    id: 3,
    category: 'Recordatorio',
    text: 'Recordatorio: 2 newsletters por revisar',
    time: 'Hace 1 día',
  },
]

function getCategoryColor(category: string, theme: Theme) {
  switch (category) {
    case 'Aprobado':
      return theme.palette.success.main
    case 'Recordatorio':
      return theme.palette.warning.main
    default:
      return theme.palette.primary.main
  }
}

export function NotificationsBanner() {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <Box ref={panelRef} sx={{ position: "relative" }}>
      <ButtonBase
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 2,
          bgcolor: "background.paper",
          px: 2.5,
          py: 2,
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          transition: "background-color 0.2s ease",
          "&:hover": {
            bgcolor: "grey.50",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="subtitle2" style={{ marginRight: 8 }}>
            Notificaciones y alertas
          </Typography>
          <Badge
            badgeContent={notifications.length}
            color="primary"
            sx={{
              "& .MuiBadge-badge": {
                fontWeight: 700,
                fontSize: 12,
              },
            }}
          />
        </Box>
      </ButtonBase>

      <Collapse in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <List disablePadding>
            {notifications.map((notification, index) => (
              <ListItem
                key={notification.id}
                sx={{
                  alignItems: "flex-start",
                  px: 2.5,
                  py: 2,
                  gap: 1.5,
                  borderBottom:
                    index < notifications.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: "grey.50",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: getCategoryColor(notification.category, theme),
                    mt: 0.75,
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={
                    <Typography variant="body2">{notification.text}</Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.category} · {notification.time}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Collapse>
    </Box>
  );
}

export default NotificationsBanner
