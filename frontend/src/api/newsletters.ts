import axios from 'axios'
import type {
  Newsletter,
  CreateNewsletterPayload,
  UpdateNewsletterPayload,
} from '../types/newsletter'

export type NewsletterStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'RESUBMITTED'
  | 'APPROVED'
  | 'DISCARDED'

const API_BASE = '/newsletters'

export async function createNewsletter(
  payload: CreateNewsletterPayload,
): Promise<Newsletter> {
  const response = await axios.post<Newsletter>(API_BASE, {
    title: payload.title ?? payload.generationRequest?.topic ?? 'Nuevo Newsletter',
    templateId: payload.templateId,
    brandKitId: payload.brandKitId,
    blocks: payload.blocks.map((b) => ({
      name: b.name,
      text: b.text,
      backgroundColor: b.backgroundColor,
    })),
  })

  return response.data
}

export async function getNewsletter(id: string): Promise<Newsletter> {
  const response = await axios.get<Newsletter>(`${API_BASE}/${id}`)
  return response.data
}

export async function getAllNewsletters(): Promise<Newsletter[]> {
  const response = await axios.get<{ data: Newsletter[] }>(API_BASE)
  return response.data.data
}

export async function updateNewsletter(
  id: string,
  payload: UpdateNewsletterPayload,
): Promise<Newsletter> {
  const body: Record<string, unknown> = {}

  if (payload.brandKitId !== undefined) body.brandKitId = payload.brandKitId
  if (payload.state !== undefined) body.state = payload.state
  if (payload.blocks !== undefined) {
    body.blocks = payload.blocks.map((b) => ({
      name: b.name,
      text: b.text,
      backgroundColor: b.backgroundColor,
    }))
  }

  const response = await axios.patch<Newsletter>(`${API_BASE}/${id}`, body)
  return response.data
}

export async function deleteNewsletter(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`)
}

export async function updateNewsletterStatus(
  newsletterId: string,
  state: NewsletterStatus,
): Promise<Newsletter> {
  const response = await axios.post<Newsletter>(
    `${API_BASE}/${newsletterId}/status`,
    { state },
  )
  return response.data
}

export function generateNewsletterId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
