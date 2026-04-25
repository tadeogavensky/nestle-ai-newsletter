import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactElement,
} from 'react'
import { useNavigate } from 'react-router'
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import type { UserRole } from '../contexts/AuthContext'
import { useAuth } from '../contexts/AuthContext'
import templateClassicImage from '../assets/we_make_nestle/wmn-lockup-one-line-dark-oak-on-white.jpg'
import templateEditorialImage from '../assets/we_make_nestle/wmn-lockup-two-lines-dark-oak-on-white.jpg'
import templateBriefImage from '../assets/we_make_nestle/wmn-lockup-three-lines-dark-oak-on-white.jpg'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

type NewsletterState =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'DISCARDED'

type AreaName = 'COMUNICACION_INTERNA' | 'COMUNICACION_CORPORATIVA'

type BrandKitId = 'nestle-corporate' | 'nescafe' | 'kit-kat'

type NewsletterBlock = {
  id: string
  name: string
  text: string
  backgroundColor: string
  comment: string | null
}

type NewsletterTemplate = {
  id: string
  name: string
  imageUrl: string
  area: AreaName
  brandKitId: BrandKitId
}

type ExportOption = {
  id: string
  label: string
  format: 'PNG'
}

type StateChangeLogPayload = {
  newsletter_id: string
  previous_state: NewsletterState
  new_state: NewsletterState
  reviewed_by_user_id: string
  all_commentaries: string[]
  created_at: string
}

type CreatePageContext = {
  newsletterId: string
  creatorUserId: string
  currentUserId: string
  currentUserRole: UserRole
  newsletterState: NewsletterState
  isGenerated: boolean
  templates: NewsletterTemplate[]
  blocks: NewsletterBlock[]
  selectedBlockId: string
  newsletterComment: string | null
  renderedHtml: string
  exportOptions: ExportOption[]
  isRenderingHtml: boolean
  isExportingPng: boolean
  onGenerate: () => Promise<void>
  onCancel: () => void
  onSendForReview: () => Promise<void>
  onSendFeedback: () => void
  onApprove: () => void
  onResendForReview: () => void
  onSelectBlock: (blockId: string) => void
  onUpdateBlockText: (blockId: string, value: string) => void
  onUpdateBlockBackground: (blockId: string, value: string) => void
  onRegenerateBlockText: (blockId: string) => void
  onSaveNewsletterComment: (value: string) => void
  onSaveBlockComment: (blockId: string, value: string) => void
  onExportToPng: () => Promise<void>
}

type PaneProps = {
  context: CreatePageContext
}

type StatePaneConfig = {
  PreviewPane: (props: PaneProps) => ReactElement
  ActionPane: (props: PaneProps) => ReactElement
}

const emptyComment = (value: string | null): boolean => !value || value.trim().length === 0

const areaLabels: Record<AreaName, string> = {
  COMUNICACION_INTERNA: 'Comunicacion interna',
  COMUNICACION_CORPORATIVA: 'Comunicacion corporativa',
}

const brandKitLabels: Record<BrandKitId, string> = {
  'nestle-corporate': 'Nestle Corporate',
  nescafe: 'Nescafe',
  'kit-kat': 'KitKat',
}

const templates: NewsletterTemplate[] = [
  {
    id: 'corporate-update',
    name: 'Actualizacion corporativa',
    imageUrl: templateClassicImage,
    area: 'COMUNICACION_INTERNA',
    brandKitId: 'nestle-corporate',
  },
  {
    id: 'people-story',
    name: 'Historia de equipos',
    imageUrl: templateEditorialImage,
    area: 'COMUNICACION_INTERNA',
    brandKitId: 'nescafe',
  },
  {
    id: 'weekly-brief',
    name: 'Resumen semanal',
    imageUrl: templateBriefImage,
    area: 'COMUNICACION_CORPORATIVA',
    brandKitId: 'nestle-corporate',
  },
  {
    id: 'leadership-note',
    name: 'Mensaje de liderazgo',
    imageUrl: templateClassicImage,
    area: 'COMUNICACION_CORPORATIVA',
    brandKitId: 'nescafe',
  },
  {
    id: 'culture-highlight',
    name: 'Cultura y reconocimiento',
    imageUrl: templateEditorialImage,
    area: 'COMUNICACION_CORPORATIVA',
    brandKitId: 'kit-kat',
  },
]

const initialBlocks: NewsletterBlock[] = [
  {
    id: 'header',
    name: 'Encabezado',
    text: 'Noticias internas para estar cerca de lo importante.',
    backgroundColor: '#FFFFFF',
    comment: null,
  },
  {
    id: 'headline',
    name: 'Titulo principal',
    text: 'Avances, aprendizajes y proximos pasos del equipo.',
    backgroundColor: '#97CAEB',
    comment: null,
  },
  {
    id: 'body',
    name: 'Cuerpo',
    text: 'Compartimos novedades relevantes para que cada area pueda actuar con claridad.',
    backgroundColor: '#FFFFFF',
    comment: null,
  },
  {
    id: 'cta',
    name: 'Llamado a la accion',
    text: 'Conoce mas en el portal interno.',
    backgroundColor: '#FFC600',
    comment: null,
  },
]

const fallbackRenderedHtml = `
  <!doctype html>
  <html lang="es">
    <body style="margin:0;font-family:Arial,sans-serif;color:#30261D;background:#FFFFFF;">
      <main style="max-width:680px;margin:0 auto;border:1px solid #E7E1DC;">
        <section style="padding:32px;background:#FF595A;color:#FFFFFF;">
          <h1 style="margin:0;font-size:34px;">Newsletter Nestle</h1>
          <p style="margin:12px 0 0;">Lista para publicacion interna.</p>
        </section>
        <section style="padding:28px;">
          <h2 style="margin-top:0;">Avances, aprendizajes y proximos pasos del equipo.</h2>
          <p>Compartimos novedades relevantes para que cada area pueda actuar con claridad.</p>
        </section>
      </main>
    </body>
  </html>
`

function logStateChange(payload: StateChangeLogPayload): void {
  console.info('Newsletter state changed', payload)
}

async function generateNewsletter(): Promise<void> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 350)
  })
}

async function renderNewsletterHtml(blocks: NewsletterBlock[]): Promise<string> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 250)
  })

  const sections = blocks
    .map(
      (block) => `
        <section style="padding:24px;background:${block.backgroundColor};">
          <h2 style="margin:0 0 8px;font-size:24px;">${block.name}</h2>
          <p style="margin:0;font-size:17px;line-height:1.5;">${block.text}</p>
        </section>
      `,
    )
    .join('')

  return `
    <!doctype html>
    <html lang="es">
      <body style="margin:0;font-family:Arial,sans-serif;color:#30261D;background:#F8F5F2;">
        <main style="max-width:680px;margin:0 auto;background:#FFFFFF;border:1px solid #E7E1DC;">
          ${sections}
        </main>
      </body>
    </html>
  `
}

async function fetchExportOptions(): Promise<ExportOption[]> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 150)
  })

  return [{ id: 'png', label: 'Exportar a PNG', format: 'PNG' }]
}

async function exportHtmlToPng(): Promise<void> {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 250)
  })
}

function selectedBlockFrom(context: CreatePageContext): NewsletterBlock {
  return (
    context.blocks.find((block) => block.id === context.selectedBlockId) ??
    context.blocks[0]
  )
}

function TemplateCarousel({ templates: carouselTemplates }: { templates: NewsletterTemplate[] }) {
  const [selectedArea, setSelectedArea] = useState<AreaName>('COMUNICACION_INTERNA')
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<BrandKitId>('nestle-corporate')
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)
  const filteredTemplates = carouselTemplates.filter(
    (template) => template.area === selectedArea && template.brandKitId === selectedBrandKitId,
  )
  const selectedTemplate = filteredTemplates[selectedTemplateIndex] ?? filteredTemplates[0]

  const goToPreviousTemplate = () => {
    if (filteredTemplates.length < 1) {
      return
    }

    setSelectedTemplateIndex((currentIndex) =>
      currentIndex === 0 ? filteredTemplates.length - 1 : currentIndex - 1,
    )
  }

  const goToNextTemplate = () => {
    if (filteredTemplates.length < 1) {
      return
    }

    setSelectedTemplateIndex((currentIndex) =>
      currentIndex === filteredTemplates.length - 1 ? 0 : currentIndex + 1,
    )
  }

  const selectArea = (event: SelectChangeEvent<AreaName>) => {
    setSelectedArea(event.target.value as AreaName)
    setSelectedTemplateIndex(0)
  }

  const selectBrandKit = (event: SelectChangeEvent<BrandKitId>) => {
    setSelectedBrandKitId(event.target.value as BrandKitId)
    setSelectedTemplateIndex(0)
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={1.5}>
        <Typography variant="h5">Elegir plantilla</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="template-area-label">Area</InputLabel>
            <Select
              labelId="template-area-label"
              label="Area"
              value={selectedArea}
              onChange={selectArea}
            >
              {Object.entries(areaLabels).map(([area, label]) => (
                <MenuItem key={area} value={area}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="template-brand-kit-label">BrandKit</InputLabel>
            <Select
              labelId="template-brand-kit-label"
              label="BrandKit"
              value={selectedBrandKitId}
              onChange={selectBrandKit}
            >
              {Object.entries(brandKitLabels).map(([brandKitId, label]) => (
                <MenuItem key={brandKitId} value={brandKitId}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Box
        sx={{
          height: 'calc(100vh - 220px)',
          minHeight: 480,
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'grid',
          gridTemplateColumns: '64px minmax(0, 1fr) 64px',
          alignItems: 'center',
        }}
      >
        <IconButton
          aria-label="Plantilla anterior"
          onClick={goToPreviousTemplate}
          disabled={filteredTemplates.length < 2}
          sx={{
            justifySelf: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {selectedTemplate ? (
          <Stack
            spacing={2}
            sx={{
              minWidth: 0,
              maxHeight: '100%',
              overflow: 'hidden',
              p: { xs: 1, md: 3 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                maxWidth: 620,
                mx: 'auto',
                width: '100%',
                maxHeight: '100%',
              }}
            >
              <Box
                component="img"
                src={selectedTemplate.imageUrl}
                alt={selectedTemplate.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: { xs: 300, md: 'calc(100vh - 430px)' },
                  minHeight: { xs: 220, md: 260 },
                  objectFit: 'contain',
                  display: 'block',
                  bgcolor: 'background.default',
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1">{selectedTemplate.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {areaLabels[selectedTemplate.area]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {brandKitLabels[selectedTemplate.brandKitId]}
                </Typography>
              </Box>
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {selectedTemplateIndex + 1} de {filteredTemplates.length}
            </Typography>
          </Stack>
        ) : (
          <Alert severity="info">No hay plantillas disponibles para esta area.</Alert>
        )}

        <IconButton
          aria-label="Plantilla siguiente"
          onClick={goToNextTemplate}
          disabled={filteredTemplates.length < 2}
          sx={{
            justifySelf: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Stack>
  )
}

function BlockList({ context, readOnly = false }: PaneProps & { readOnly?: boolean }) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Bloques de la plantilla</Typography>
        {readOnly && <Chip label="Solo lectura" />}
      </Stack>

      <Stack spacing={1.5}>
        {context.blocks.map((block) => {
          const isSelected = block.id === context.selectedBlockId

          return (
            <Paper
              key={block.id}
              component="button"
              elevation={0}
              disabled={readOnly}
              onClick={() => context.onSelectBlock(block.id)}
              sx={{
                width: '100%',
                textAlign: 'left',
                border: '2px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: block.backgroundColor,
                color: 'text.primary',
                cursor: readOnly ? 'default' : 'pointer',
                p: 2,
              }}
            >
              <Typography variant="subtitle1">{block.name}</Typography>
              <Typography variant="body2">{block.text}</Typography>
              {!emptyComment(block.comment) && (
                <Alert severity="info" sx={{ mt: 1.5 }}>
                  {block.comment}
                </Alert>
              )}
            </Paper>
          )
        })}
      </Stack>
    </Stack>
  )
}

function PermissionDeniedPane() {
  return (
    <Alert severity="warning">
      No tenes permisos para ver esta instancia del flujo.
    </Alert>
  )
}

function DraftPreviewPane({ context }: PaneProps) {
  if (!context.isGenerated) {
    return <TemplateCarousel templates={context.templates} />
  }

  return <BlockList context={context} />
}

function DraftActionPane({ context }: PaneProps) {
  const [generatePrompt, setGeneratePrompt] = useState('')
  const [audience, setAudience] = useState('')
  const selectedBlock = selectedBlockFrom(context)

  return (
    <Stack spacing={2}>
      <Tabs value={context.isGenerated ? 1 : 0}>
        <Tab label="Generar" disabled={context.isGenerated} />
        <Tab label="Editar" disabled={!context.isGenerated} />
      </Tabs>

      {!context.isGenerated ? (
        <Stack spacing={2}>
          <TextField
            label="Tema del newsletter"
            value={generatePrompt}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setGeneratePrompt(event.target.value)}
            fullWidth
          />
          <TextField
            label="Audiencia"
            value={audience}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setAudience(event.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={() => void context.onGenerate()}>
            Generar
          </Button>
          <Button variant="outlined" color="error" onClick={context.onCancel}>
            Cancelar
          </Button>
        </Stack>
      ) : (
        <EditForm
          context={context}
          selectedBlock={selectedBlock}
          submitLabel="Enviar a revision"
          onSubmit={() => void context.onSendForReview()}
        />
      )}
    </Stack>
  )
}

function EditForm({
  context,
  selectedBlock,
  submitLabel,
  onSubmit,
}: {
  context: CreatePageContext
  selectedBlock: NewsletterBlock
  submitLabel: string
  onSubmit: () => void
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">{selectedBlock.name}</Typography>
      <TextField
        label="Texto"
        value={selectedBlock.text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          context.onUpdateBlockText(selectedBlock.id, event.target.value)
        }
        multiline
        minRows={3}
        fullWidth
      />
      <TextField
        label="Fondo"
        type="color"
        value={selectedBlock.backgroundColor}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          context.onUpdateBlockBackground(selectedBlock.id, event.target.value)
        }
        fullWidth
      />
      <Button variant="outlined" color="secondary" onClick={() => context.onRegenerateBlockText(selectedBlock.id)}>
        Regenerar texto
      </Button>

      {!emptyComment(context.newsletterComment) && (
        <Alert severity="info">{context.newsletterComment}</Alert>
      )}

      <Divider />

      <Button variant="contained" onClick={onSubmit}>
        {submitLabel}
      </Button>
      <Button variant="outlined" color="error" onClick={context.onCancel}>
        Cancelar
      </Button>
    </Stack>
  )
}

function ReviewPreviewPane({ context }: PaneProps) {
  if (!['ADMIN', 'FUNCTIONAL'].includes(context.currentUserRole)) {
    return <PermissionDeniedPane />
  }

  return <BlockList context={context} />
}

function ReviewActionPane({ context }: PaneProps) {
  const selectedBlock = selectedBlockFrom(context)

  if (!['ADMIN', 'FUNCTIONAL'].includes(context.currentUserRole)) {
    return <PermissionDeniedPane />
  }

  return (
    <ReviewCommentControls
      key={selectedBlock.id}
      context={context}
      selectedBlock={selectedBlock}
    />
  )
}

function ReviewCommentControls({
  context,
  selectedBlock,
}: {
  context: CreatePageContext
  selectedBlock: NewsletterBlock
}) {
  const [newsletterComment, setNewsletterComment] = useState(context.newsletterComment ?? '')
  const [blockComment, setBlockComment] = useState(selectedBlock.comment ?? '')

  return (
    <Stack spacing={2}>
      <Tabs value={0}>
        <Tab label="Revision" />
      </Tabs>

      <TextField
        label="Comentario del newsletter"
        value={newsletterComment}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setNewsletterComment(event.target.value)}
        multiline
        minRows={3}
        fullWidth
      />
      <Button variant="outlined" onClick={() => context.onSaveNewsletterComment(newsletterComment)}>
        Guardar comentario general
      </Button>

      <Divider />

      <Typography variant="subtitle1">Comentario para {selectedBlock.name}</Typography>
      <TextField
        label="Comentario del bloque"
        value={blockComment}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setBlockComment(event.target.value)}
        multiline
        minRows={3}
        fullWidth
      />
      <Button variant="outlined" onClick={() => context.onSaveBlockComment(selectedBlock.id, blockComment)}>
        Guardar comentario del bloque
      </Button>

      <Divider />

      <Button variant="outlined" color="warning" onClick={context.onSendFeedback}>
        Enviar feedback
      </Button>
      <Button variant="contained" color="success" onClick={context.onApprove}>
        Aprobar
      </Button>
    </Stack>
  )
}

function ChangesPreviewPane({ context }: PaneProps) {
  if (context.currentUserId !== context.creatorUserId) {
    return <PermissionDeniedPane />
  }

  return <BlockList context={context} />
}

function ChangesActionPane({ context }: PaneProps) {
  const selectedBlock = selectedBlockFrom(context)

  if (context.currentUserId !== context.creatorUserId) {
    return <PermissionDeniedPane />
  }

  return (
    <Stack spacing={2}>
      <Tabs value={0}>
        <Tab label="Editar" />
      </Tabs>
      <EditForm
        context={context}
        selectedBlock={selectedBlock}
        submitLabel="Reenviar a revision"
        onSubmit={context.onResendForReview}
      />
    </Stack>
  )
}

function ApprovedPreviewPane({ context }: PaneProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Vista final</Typography>
      {context.isRenderingHtml && <Alert severity="info">Preparando HTML aprobado...</Alert>}
      <Box
        component="iframe"
        title="Newsletter aprobado"
        srcDoc={context.renderedHtml || fallbackRenderedHtml}
        sx={{
          width: '100%',
          height: 'calc(100vh - 220px)',
          minHeight: 520,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          pointerEvents: 'none',
        }}
      />
    </Stack>
  )
}

function ApprovedActionPane({ context }: PaneProps) {
  return (
    <Stack spacing={2}>
      <Tabs value={0}>
        <Tab label="Exportar" />
      </Tabs>
      <Typography variant="h5">Listo para publicacion</Typography>
      <Typography variant="body2" color="text.secondary">
        El newsletter aprobado ya esta renderizado y disponible para exportar.
      </Typography>
      {context.exportOptions.map((option) => (
        <Button
          key={option.id}
          variant="contained"
          disabled={context.isExportingPng}
          onClick={() => {
            if (option.format === 'PNG') {
              void context.onExportToPng()
            }
          }}
        >
          {context.isExportingPng ? 'Exportando...' : option.label}
        </Button>
      ))}
    </Stack>
  )
}

function DiscardedPreviewPane() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Proceso descartado</Typography>
      <Alert severity="info">
        La generacion del newsletter fue cancelada y quedo archivada como descartada.
      </Alert>
    </Stack>
  )
}

function DiscardedActionPane() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Detalle archivado</Typography>
      <Typography variant="body2" color="text.secondary">
        No hay acciones disponibles para un newsletter descartado.
      </Typography>
    </Stack>
  )
}

const newsletterStateMap: Record<NewsletterState, StatePaneConfig> = {
  DRAFT: {
    PreviewPane: DraftPreviewPane,
    ActionPane: DraftActionPane,
  },
  IN_REVIEW: {
    PreviewPane: ReviewPreviewPane,
    ActionPane: ReviewActionPane,
  },
  CHANGES_REQUESTED: {
    PreviewPane: ChangesPreviewPane,
    ActionPane: ChangesActionPane,
  },
  RESUBMITTED: {
    PreviewPane: ReviewPreviewPane,
    ActionPane: ReviewActionPane,
  },
  APPROVED: {
    PreviewPane: ApprovedPreviewPane,
    ActionPane: ApprovedActionPane,
  },
  DISCARDED: {
    PreviewPane: DiscardedPreviewPane,
    ActionPane: DiscardedActionPane,
  },
}

function CreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const currentUserId = user?.id ?? 'anonymous'
  const currentUserRole = user?.role ?? 'USER'
  const newsletterId = 'newsletter-draft-001'
  const creatorUserId = '3'

  const [newsletterState, setNewsletterState] = useState<NewsletterState>('DRAFT')
  const [isGenerated, setIsGenerated] = useState(false)
  const [blocks, setBlocks] = useState<NewsletterBlock[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState(initialBlocks[0].id)
  const [newsletterComment, setNewsletterComment] = useState<string | null>(null)
  const [renderedHtml, setRenderedHtml] = useState('')
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([])
  const [isRenderingHtml, setIsRenderingHtml] = useState(false)
  const [isExportingPng, setIsExportingPng] = useState(false)

  const allCommentaries = useMemo(
    () =>
      [
        newsletterComment,
        ...blocks.map((block) => block.comment),
      ].filter((commentary): commentary is string => !emptyComment(commentary)),
    [blocks, newsletterComment],
  )

  const transitionNewsletterState = useCallback(
    (newState: NewsletterState): void => {
      setNewsletterState((previousState) => {
        if (previousState === newState) {
          return previousState
        }

        logStateChange({
          newsletter_id: newsletterId,
          previous_state: previousState,
          new_state: newState,
          reviewed_by_user_id: currentUserId,
          all_commentaries: allCommentaries,
          created_at: new Date().toISOString(),
        })

        return newState
      })
    },
    [allCommentaries, currentUserId, newsletterId],
  )

  const handleGenerate = useCallback(async () => {
    await generateNewsletter()
    setIsGenerated(true)
  }, [])

  const handleRenderHtml = useCallback(async () => {
    setIsRenderingHtml(true)

    try {
      setRenderedHtml(await renderNewsletterHtml(blocks))
    } finally {
      setIsRenderingHtml(false)
    }
  }, [blocks])

  const handleSendForReview = useCallback(async () => {
    await handleRenderHtml()
    transitionNewsletterState('IN_REVIEW')
  }, [handleRenderHtml, transitionNewsletterState])

  const handleCancel = useCallback(() => {
    transitionNewsletterState('DISCARDED')
    navigate('/dashboard')
  }, [navigate, transitionNewsletterState])

  const handleSendFeedback = useCallback(() => {
    transitionNewsletterState('CHANGES_REQUESTED')

    if (currentUserId !== creatorUserId) {
      navigate('/dashboard')
    }
  }, [creatorUserId, currentUserId, navigate, transitionNewsletterState])

  const handleExportToPng = useCallback(async () => {
    setIsExportingPng(true)

    try {
      await exportHtmlToPng()
    } finally {
      setIsExportingPng(false)
    }
  }, [])

  useEffect(() => {
    if (newsletterState !== 'APPROVED') {
      return undefined
    }

    const renderTimeoutId = window.setTimeout(() => {
      void handleRenderHtml()
    }, 0)

    void fetchExportOptions().then(setExportOptions)

    return () => {
      window.clearTimeout(renderTimeoutId)
    }
  }, [handleRenderHtml, newsletterState])

  const context = useMemo<CreatePageContext>(
    () => ({
      newsletterId,
      creatorUserId,
      currentUserId,
      currentUserRole,
      newsletterState,
      isGenerated,
      templates,
      blocks,
      selectedBlockId,
      newsletterComment,
      renderedHtml,
      exportOptions,
      isRenderingHtml,
      isExportingPng,
      onGenerate: handleGenerate,
      onCancel: handleCancel,
      onSendForReview: handleSendForReview,
      onSendFeedback: handleSendFeedback,
      onApprove: () => transitionNewsletterState('APPROVED'),
      onResendForReview: () => transitionNewsletterState('RESUBMITTED'),
      onSelectBlock: setSelectedBlockId,
      onUpdateBlockText: (blockId, value) =>
        setBlocks((currentBlocks) =>
          currentBlocks.map((block) =>
            block.id === blockId ? { ...block, text: value } : block,
          ),
        ),
      onUpdateBlockBackground: (blockId, value) =>
        setBlocks((currentBlocks) =>
          currentBlocks.map((block) =>
            block.id === blockId ? { ...block, backgroundColor: value } : block,
          ),
        ),
      onRegenerateBlockText: (blockId) =>
        setBlocks((currentBlocks) =>
          currentBlocks.map((block) =>
            block.id === blockId
              ? { ...block, text: `${block.text} Nueva variante sugerida.` }
              : block,
          ),
        ),
      onSaveNewsletterComment: (value) => setNewsletterComment(value.trim() || null),
      onSaveBlockComment: (blockId, value) =>
        setBlocks((currentBlocks) =>
          currentBlocks.map((block) =>
            block.id === blockId ? { ...block, comment: value.trim() || null } : block,
          ),
        ),
      onExportToPng: handleExportToPng,
    }),
    [
      blocks,
      creatorUserId,
      currentUserId,
      currentUserRole,
      exportOptions,
      handleCancel,
      handleExportToPng,
      handleGenerate,
      handleSendForReview,
      handleSendFeedback,
      isExportingPng,
      isGenerated,
      isRenderingHtml,
      newsletterComment,
      newsletterId,
      newsletterState,
      renderedHtml,
      selectedBlockId,
      transitionNewsletterState,
    ],
  )

  const { PreviewPane, ActionPane } = newsletterStateMap[newsletterState]

  return (
    <Box
      component="main"
      sx={{
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(380px, 0.72fr)' },
      }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          borderRight: { lg: '1px solid' },
          borderBottom: { xs: '1px solid', lg: 'none' },
          borderColor: 'divider',
          minWidth: 0,
        }}
      >
        <PreviewPane context={context} />
      </Box>

      <Box sx={{ p: { xs: 2, md: 3 }, minWidth: 0 }}>
        <Stack spacing={2}>
          <Stack spacing={0.75}>
            <Typography variant="overline">Estado: {newsletterState}</Typography>
            <Typography variant="h4">Builder de newsletter</Typography>
          </Stack>
          <ActionPane context={context} />
        </Stack>
      </Box>
    </Box>
  )
}

export default CreatePage
