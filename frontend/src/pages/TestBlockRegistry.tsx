import { useMemo, useState, type ReactElement } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { BlockPicker } from '../components/blocks/BlockPicker'
import { BlockRenderer } from '../components/blocks/BlockRenderer'
import { useBlockDefinitions } from '../hooks/useBlockDefinitions'
import { useTemplateBlocks } from '../hooks/useTemplateBlocks'
import type { BlockContentType } from '../../../packages/shared/src/types/block.types'

export default function TestBlockRegistry(): ReactElement {
  const [templateId, setTemplateId] = useState('')
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const {
    data: definitions,
    error: definitionsError,
    isLoading,
  } = useBlockDefinitions() // BLOCK DEFINITIONS FROM BACKEND, IT PULLS ALL THE AVAILABLE BLOCKS TO RENDER IN THE PICKER
  const { blocks, addBlock, removeBlock, saveTemplate } = useTemplateBlocks()

  const definitionsByType = useMemo(
    () =>
      new Map(
        definitions?.map((definition) => [definition.type, definition]) ?? [],
      ),
    [definitions],
  )

  const handleSelectBlock = (type: BlockContentType): void => {
    const definition = definitionsByType.get(type)

    if (!definition) {
      setSaveError('No se encontro la definicion del bloque seleccionado.')
      return
    }

    addBlock(definition)
    setSaveStatus(null)
    setSaveError(null)
  }

  const handleSave = async (): Promise<void> => {
    if (!templateId.trim()) {
      setSaveError('Ingresa un UUID de template antes de guardar.')
      return
    }

    if (!blocks.length) {
      setSaveError('Selecciona al menos un bloque antes de guardar.')
      return
    }

    setIsSaving(true)
    setSaveStatus(null)
    setSaveError(null)

    try {
      await saveTemplate(templateId.trim())
      setSaveStatus(`Se guardaron ${blocks.length} bloques para el template.`)
    } catch {
      setSaveError('No se pudieron guardar los bloques del template.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h2">Prueba de bloques</Typography>
            <Typography variant="body1" color="text.secondary">
              Selecciona bloques del registro y guardalos contra un template.
            </Typography>
          </Stack>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Registro</Typography>
              {definitionsError && (
                <Alert severity="error">
                  No se pudieron cargar las definiciones del backend.
                </Alert>
              )}
              {!definitionsError && isLoading && (
                <Typography variant="body2">Cargando bloques...</Typography>
              )}
              <BlockPicker onSelect={handleSelectBlock} /> // THIS COMPONENT RENDERS THE BLOCKS AVAILABLE IN THE BACKEND. WHEN YOU SELECT ONE, IT IS ADDED TO THE LIST OF SELECTED BLOCKS
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Bloques seleccionados</Typography>
              {blocks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Todavia no seleccionaste bloques.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {blocks.map((block) => ( // THIS RENDERS THE BLOCKS THAT WERE SELECTED, IT USES THE SAME BLOCK RENDERER THAT THE NEWSLETTER PAGE USES, BUT IN EDIT MODE
                    <Paper key={block.localId} variant="outlined" sx={{ p: 2 }}>
                      <Stack spacing={1.5}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{
                            alignItems: { xs: "flex-start", sm: "center" },
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle1">
                            {block.type} - orden {block.displayOrder + 1}
                          </Typography>
                          <Button
                            color="error"
                            size="small"
                            variant="outlined"
                            onClick={() => removeBlock(block.localId)} // THIS BUTTON REMOVES THE BLOCK FROM THE SELECTED BLOCKS LIST
                          >
                            Quitar
                          </Button>
                        </Stack>
                        <Divider />
                        <BlockRenderer block={block} editMode />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Guardar</Typography>
              <TextField
                label="ID del template"
                placeholder="UUID del template"
                value={templateId}
                onChange={(event) => setTemplateId(event.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => void handleSave()} // THIS BUTTON SAVES THE SELECTED BLOCKS TO THE BACKEND, ASSOCIATED TO THE TEMPLATE ID THAT YOU INPUT. IT SHOWS A SUCCESS OR ERROR MESSAGE DEPENDING ON THE RESULT
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar bloques"}
              </Button>
              {saveStatus && <Alert severity="success">{saveStatus}</Alert>}
              {saveError && <Alert severity="error">{saveError}</Alert>}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
