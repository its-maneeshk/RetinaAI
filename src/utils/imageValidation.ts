export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export function validateImage(file: File): string | null {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    return 'Choose a JPEG, PNG, or WebP image. Other file types are not supported.'
  if (!/\.(jpe?g|png|webp)$/i.test(file.name)) return 'The image filename must end in .jpg, .jpeg, .png, or .webp.'
  if (file.size > MAX_IMAGE_BYTES) return 'This image exceeds the 10 MB limit. Please choose a smaller image.'
  if (file.size === 0) return 'This file is empty. Please choose a valid image.'
  return null
}
export function createMetadata() {
  const now = new Date()
  const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
  return {
    case_id: `CASE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    patient_reference: `SYN-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    age: '',
    screening_date: date,
    eye: 'UNSPECIFIED' as const,
  }
}
export const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', options ?? { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
