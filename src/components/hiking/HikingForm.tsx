import { Grid, TextField, Paper, Button, Typography, Stack, CircularProgress, Alert, AlertTitle, Box, Skeleton, Collapse} from '@mui/material'
import { Upload as UploadIcon } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { TimePicker } from '@mui/x-date-pickers'
import { useRef, useEffect, useState, memo } from 'react'
import { 
  HikingFormProps, 
  ErrorDisplayProps, 
  OptimizedImageProps,
  HikingError
} from '@/types'
import { useSuiWallet } from '@/hooks'

// ErrorDisplay Component
const ErrorDisplay = memo(function ErrorDisplay({ error, onClose }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <Collapse in={!!error}>
      <Alert 
        severity={error.type} 
        onClose={onClose}
        sx={{ mb: 2 }}
      >
        <AlertTitle sx={{ textTransform: 'capitalize' }}>{error.type}</AlertTitle>
        {error.message}
        {error.details && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {error.details}
          </Typography>
        )}
      </Alert>
    </Collapse>
  )
})

// OptimizedImage Component
const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = '100%',
  height = 'auto',
  objectFit = 'contain',
  priority = false,
  sx,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    if (!priority) {
      setIsLoading(true)
    }

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setError(new Error('Failed to load image'))
      setIsLoading(false)
    }

    img.src = src
  }, [src, priority])

  if (error) {
    return (
      <Box
        {...props}
        sx={{
          width,
          height,
          bgcolor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          ...sx
        }}
      >
        Failed to load image
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        animation="wave"
        sx={sx}
      />
    )
  }

  return (
    <Box
      component="img"
      src={imageSrc || src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
      sx={{
        width,
        height,
        objectFit,
        transition: 'opacity 0.3s ease',
        opacity: imageSrc ? 1 : 0,
        ...sx
      }}
    />
  )
})

// Main HikingForm Component
const HikingForm = ({
  formData, 
  onFormChange, 
  onImageChange,
  onSubmit,
  loading,
  error: formError,
  onGpxUpload,
  account,
}: HikingFormProps) => {
  const { isLoading, error } = useSuiWallet();
  const [gpxError, setGpxError] = useState<HikingError | null>(null)

  const handleGpxFileUpload = async (file: File) => {
    try {
      console.log('Starting GPX file upload:', file.name)
      setGpxError(null)
      if (onGpxUpload) {
        console.log('Calling onGpxUpload with file:', file)
        await onGpxUpload(file)
        console.log('GPX upload completed successfully')
      } else {
        console.warn('onGpxUpload is not provided')
      }
    } catch (error) {
      console.error('Error in handleGpxFileUpload:', error)
      setGpxError({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process GPX file'
      })
    }
  }

  const hasNoData = !formData.gpxFile && 
    !formData.maxElevation && 
    !formData.duration && 
    !formData.totalDistance &&
    !formData.location

  const manualInputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (formData.gpxFile && manualInputRef.current) {
      manualInputRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [formData.gpxFile])

  return (
    <Paper 
      component="form" 
      onSubmit={onSubmit}
      elevation={0}
      sx={{ p: 4 }}
    >
      <Grid container spacing={3}>
        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error.message}
            </Alert>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <ErrorDisplay error={formError || gpxError} />
        </Grid>

        {/* Original Form Content */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Choose how to record your hiking details
          </Typography>
        </Grid>

        {/* Section 1: GPX Upload */}
        <Grid item xs={12}>
          <Paper 
            variant="outlined" 
            sx={{ p: 3 }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              1. Upload GPX File (Recommended)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload your GPX file to automatically fill in elevation, duration, and distance details.
              Most hiking apps can export your trail data as a GPX file.
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              disabled={loading}
              fullWidth
            >
              Upload GPX
              <input
                type="file"
                accept=".gpx"
                hidden
                onChange={(e) => {
                  console.log('File input change event triggered')
                  const file = e.target.files?.[0]
                  if (file) {
                    console.log('File selected:', file.name)
                    handleGpxFileUpload(file)
                  } else {
                    console.log('No file selected')
                  }
                }}
              />
            </Button>
          </Paper>
        </Grid>

        {/* Section 2: Manual Input */}
        <Grid item xs={12} ref={manualInputRef}>
          <Paper 
            variant="outlined" 
            sx={{ p: 3 }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              2. Manual Input
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don't have a GPX file? No problem! You can manually enter your hiking details below.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => newValue && onFormChange({ date: newValue })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TimePicker
                  label="Start Time"
                  value={formData.date.set('hour', parseInt(formData.startTime.split(':')[0] || '0')).set('minute', parseInt(formData.startTime.split(':')[1] || '0'))}
                  onChange={(newValue) => newValue && onFormChange({ startTime: newValue.format('HH:mm') })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TimePicker
                  label="End Time"
                  value={formData.date.set('hour', parseInt(formData.endTime.split(':')[0] || '0')).set('minute', parseInt(formData.endTime.split(':')[1] || '0'))}
                  onChange={(newValue) => newValue && onFormChange({ endTime: newValue.format('HH:mm') })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Max Elevation (m)"
                  type="number"
                  value={formData.maxElevation || ''}
                  onChange={(e) => onFormChange({ maxElevation: parseInt(e.target.value) || 0 })}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value === '0') target.value = '';
                  }}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => onFormChange({ duration: parseInt(e.target.value) || 0 })}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value === '0') target.value = '';
                  }}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Total Distance (m)"
                  type="number"
                  value={formData.totalDistance || ''}
                  onChange={(e) => onFormChange({ totalDistance: parseInt(e.target.value) || 0 })}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value === '0') target.value = '';
                  }}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} ref={manualInputRef}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', mt: 2 }}>
                  Additional Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <TextField
                    label="Location"
                    value={formData.location}
                    onChange={(e) => onFormChange({ location: e.target.value })}
                    fullWidth
                    placeholder="Mountain name or trail"
                    required
                  />
                  
                  <TextField
                    type="number"
                    label="Participants"
                    value={formData.participants || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : Number(e.target.value)
                      onFormChange({ participants: value })
                    }}
                    fullWidth
                    inputProps={{ min: 0 }}
                    required
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => onFormChange({ description: e.target.value })}
                  multiline
                  rows={5}
                  fullWidth
                  sx={{ 
                    height: '100%',
                    '& .MuiInputBase-root': {
                      height: '100%'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Section 3: Photo Upload */}
        <Grid item xs={12}>
          <Paper 
            variant="outlined" 
            sx={{ p: 3 }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              3. Upload Photo
            </Typography>
            {hasNoData && !formData.imageFile && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please either upload a GPX file or fill in the hiking details before uploading a photo. 
                This information will be used to create a watermark on your photo.
              </Alert>
            )}
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadIcon />}
              disabled={loading}
              fullWidth
            >
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    onImageChange(file)
                  }
                }}
              />
            </Button>

            {formData.processedImageUrl && (
              <Box sx={{ mt: 2 }}>
                <OptimizedImage
                  src={formData.processedImageUrl}
                  alt="Processed hiking photo"
                  height={400}
                  sx={{
                    width: '100%',
                    borderRadius: 2
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Section 4: Store Memory */}
        <Grid item xs={12}>
          <Paper 
            variant="outlined" 
            sx={{ p: 3 }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              4. Store Memory
            </Typography>

            {/* 에러 메시지 표시 */}
            {(formError || !account) && (
              <Alert 
                severity={formError?.type || "warning"} 
                sx={{ mb: 2 }}
              >
                {formError?.message || "Please connect your wallet first"}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !account}
              fullWidth
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Store Memory'
              )}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default HikingForm; 