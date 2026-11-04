const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '/api'
export const apiUrl = (path: string): string => `${API_BASE}${path}`

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(apiUrl(path), { ...options, credentials: 'same-origin', signal: options?.signal ?? AbortSignal.timeout(90000) })
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') throw new ApiError('The request was cancelled. You can try again.', 0)
    throw new ApiError('The screening service is unavailable. Please try again shortly.', 0)
  }
  if (!response.ok) {
    let message = 'The request could not be completed. Please try again.'
    try {
      const body: unknown = await response.json()
      if (typeof body === 'object' && body !== null && 'detail' in body && typeof body.detail === 'string') message = body.detail
      else if (response.status === 422) message = 'Some request inputs were not accepted. Please review your selections and try again.'
    } catch {
      /* A proxy can return a non-JSON error while the API is starting. */
    }
    throw new ApiError(message, response.status)
  }
  if (response.status === 204) return undefined as T
  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('The service returned an unexpected response. Check the Python API connection and try again.', 502)
  }
}

export const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : 'Something went wrong. Please try again.')
