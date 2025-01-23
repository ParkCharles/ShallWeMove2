import type { Dayjs } from 'dayjs'
import type { SxProps, Theme } from '@mui/material'

// Error Types
export type ErrorType = 'error' | 'warning' | 'info' | 'success'

export interface HikingError {
  type: ErrorType
  message: string
  details?: string
}

// Image Types
export interface OptimizedImageProps {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
  sx?: SxProps<Theme>
}

// Form Data Types
export interface HikingFormData {
  location: string
  description: string
  imageFile: File | null
  imageUrl: string
  participants: number
  maxElevation: number
  duration: number
  date: Dayjs
  startTime: string
  endTime: string
  totalDistance: number
  processedImageUrl: string
  gpxFile: File | null
}

// Component Props Types
export interface ErrorDisplayProps {
  error: HikingError | null
  onClose?: () => void
  sx?: SxProps<Theme>
}

export interface HikingFormProps {
  formData: HikingFormData
  onFormChange: (updates: Partial<HikingFormData>) => void
  onImageChange: (file: File) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  loading: boolean
  error: HikingError | null
  children?: React.ReactNode
  onGpxUpload?: (file: File) => Promise<void>
  account?: boolean,
} 