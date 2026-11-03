const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface PredictionRequest {
  image: string;
  patientInfo?: {
    id?: string;
    age?: string;
    eye?: 'left' | 'right' | '';
  };
}

export interface PredictionResponse {
  success: boolean;
  prediction: {
    class: string;
    confidence: number;
    severity: 'none' | 'mild' | 'moderate' | 'severe' | 'proliferative';
    description: string;
    recommendation: string;
    urgency: 'routine' | 'moderate' | 'urgent' | 'emergency';
  };
  patient_info?: any;
  timestamp: string;
  model_accuracy: number;
  error?: string;
}

export interface ClassInfo {
  class: string;
  severity: string;
  description: string;
  recommendation: string;
  urgency: string;
}

export interface ClassesResponse {
  classes: ClassInfo[];
  total_classes: number;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  timestamp: string;
}

class ApiService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>('/health');
  }

  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    return this.makeRequest<PredictionResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getClasses(): Promise<ClassesResponse> {
    return this.makeRequest<ClassesResponse>('/classes');
  }
}

export const apiService = new ApiService();