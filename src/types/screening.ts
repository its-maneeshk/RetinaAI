export type ModelType = 'DEMO' | 'TRAINED'
export type QualityStatus = 'ACCEPTABLE' | 'WARNING' | 'REJECTED'
export type Grade = 0 | 1 | 2 | 3 | 4
export const GRADE_LABELS = ['No DR', 'Mild DR', 'Moderate DR', 'Severe DR', 'Proliferative DR'] as const

export interface CaseMetadata {
  case_id: string
  patient_reference: string
  age: string
  screening_date: string
  eye: 'LEFT' | 'RIGHT' | 'UNSPECIFIED'
}

export interface ExplanationData {
  method: 'GRAD_CAM'
  model_version: string
  original_image: string
  heatmap_image: string
}

export interface ScreeningRecord {
  explainability?: ExplanationData | null
  record_id: string
  case_id: string
  patient_reference: string
  age: number | null
  eye: CaseMetadata['eye']
  screening_date: string
  predicted_grade: Grade
  predicted_label: string
  model_score: number
  model_version: string
  model_type: ModelType
  quality_status: QualityStatus
  quality_messages: string[]
  timestamp: string
  is_demo: boolean
  is_saved: boolean
  probabilities: number[]
  image_available: boolean
  image_width: number
  image_height: number
  analysis_ms: number
}

export interface HistoryResponse {
  records: ScreeningRecord[]
  total: number
  page: number
  page_size: number
}
export interface HealthResponse {
  status: string
  model_loaded: boolean
  model_type: ModelType
  model_version: string
  deletion_enabled: boolean
  synthetic_only: boolean
}
export interface ActivityPoint {
  date: string
  count: number
}
export interface DashboardResponse {
  total: number
  this_week: number
  quality_pass_rate: number
  average_analysis_ms: number
  previous_period: number
  distribution: { grade: Grade; count: number }[]
  activity: ActivityPoint[]
  recent: ScreeningRecord[]
  model_type: ModelType
}
