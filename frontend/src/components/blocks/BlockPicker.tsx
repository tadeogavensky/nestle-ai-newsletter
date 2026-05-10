import { Box, Card, CardContent, Icon, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import { useBlockDefinitions } from '../../hooks/useBlockDefinitions'
import type { BlockContentType } from '../../../../packages/shared/src/types/block.types'

type BlockPickerProps = {
  onSelect: (type: BlockContentType) => void
}

export function BlockPicker({ onSelect }: BlockPickerProps): ReactElement {
  const { data: definitions, error, isLoading } = useBlockDefinitions()

  if (isLoading) {
    return <Typography variant="body2">Cargando bloques...</Typography>
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        No se pudieron cargar los bloques disponibles.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
        },
      }}
    >
      {definitions?.map((definition) => (
        <Box key={definition.type}>
          <Card
            onClick={() => onSelect(definition.type)}
            sx={{ cursor: 'pointer' }}
          >
            <CardContent>
              <Icon>{definition.icon}</Icon>
              <Typography>{definition.label}</Typography>
              <Typography variant="caption">{definition.description}</Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  )
}
