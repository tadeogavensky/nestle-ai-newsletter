import axios from 'axios'
import { apiBaseUrl } from '../config/api'

export type ImproveTextRequest = {
  text: string
}

export type ImproveTextResponse = {
  originalText: string
  improvedText: string
  provider: 'nestle' | 'gemini'
  model: string
}

export async function improveText(
  request: ImproveTextRequest,
): Promise<ImproveTextResponse> {
  const response = await axios.post<ImproveTextResponse>(
    `${apiBaseUrl}/ai/improve-text`,
    request,
  )


  return response.data
}
