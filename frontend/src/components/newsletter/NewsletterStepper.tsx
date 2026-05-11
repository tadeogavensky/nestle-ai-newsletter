import { Box, Step, StepLabel, Stepper } from '@mui/material'

const STEPS = ['Configurar', 'Editar', 'Revisión', 'Aprobado']

interface Props {
  activeStep: number
}

export function NewsletterStepper({ activeStep }: Props) {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 1.5,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}
