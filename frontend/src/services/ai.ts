import axios from 'axios'

export type ImproveTextRequest = {
  text: string
}

export type ImproveTextResponse = {
  originalText: string
  improvedText: string
  provider: 'openai' | 'gemini'
  model: string
}

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export async function improveText(
  request: ImproveTextRequest,
): Promise<ImproveTextResponse> {
  const response = await axios.post<ImproveTextResponse>(
    `${apiBaseUrl}/ai/improve-text`,
    request,
  )


  return response.data
}
