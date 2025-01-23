import { uploadToWalrus } from './walrus'

/**
 * Processes an image with watermark and resizes to square
 */
export const processImage = async (file: File, watermarkInfo: { 
  location: string;
  line2: string;
  line3: string 
}) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  const img = await createImageBitmap(file)
  
  // Crop and resize to 500x500
  const size = 500
  const sourceSize = Math.min(img.width, img.height)
  const sourceX = (img.width - sourceSize) / 2
  const sourceY = (img.height - sourceSize) / 2

  // Set canvas dimensions
  canvas.width = size
  canvas.height = size

  // Draw image centered and cropped
  ctx.drawImage(
    img,
    sourceX, sourceY,    // Source image starting point
    sourceSize, sourceSize,    // Source image crop size
    0, 0,               // Canvas starting point
    size, size          // Canvas draw size
  )

  // Watermark background (gradient from transparent to dark)
  const backgroundHeight = canvas.height * 0.175
  const gradient = ctx.createLinearGradient(
    0, canvas.height - backgroundHeight,
    0, canvas.height
  )

  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.5)')
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, canvas.height - backgroundHeight, canvas.width, backgroundHeight)

  // Set watermark style
  ctx.fillStyle = 'white'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  
  // Auto-adjust text size function
  const fitTextToWidth = (text: string, maxWidth: number) => {
    let fontSize = 24  // Reduced from 48 to 24
    ctx.font = `bold ${fontSize}px Inter`
    
    while (ctx.measureText(text).width > maxWidth && fontSize > 8) {  // Minimum size 8px
      fontSize--
      ctx.font = `bold ${fontSize}px Inter`
    }
    return fontSize
  }

  const padding = 30
  const maxWidth = canvas.width - (padding * 2)
  const lineHeight = 1.4

  // Calculate and set font sizes for each line
  const fontSize1 = fitTextToWidth(watermarkInfo.location, maxWidth)
  const fontSize2 = fitTextToWidth(watermarkInfo.line2, maxWidth)
  const fontSize3 = fitTextToWidth(watermarkInfo.line3, maxWidth)

  // Add text shadow and outline effect
  const drawTextWithOutline = (text: string, x: number, y: number) => {
    // Text outline
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.strokeText(text, x, y)
    
    // Shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    // Main text
    ctx.fillStyle = 'white'
    ctx.fillText(text, x, y)
    
    // Reset effects
    ctx.shadowColor = 'transparent'
    ctx.strokeStyle = 'transparent'
  }

  // Draw first line (location)
  ctx.font = `bold ${fontSize1}px Inter`
  drawTextWithOutline(watermarkInfo.location, canvas.width - padding, canvas.height - padding - (fontSize2 * lineHeight) - (fontSize3 * lineHeight))

  // Draw second line
  ctx.font = `bold ${fontSize2}px Inter`
  drawTextWithOutline(watermarkInfo.line2, canvas.width - padding, canvas.height - padding - (fontSize3 * lineHeight))

  // Draw third line
  ctx.font = `bold ${fontSize3}px Inter`
  drawTextWithOutline(watermarkInfo.line3, canvas.width - padding, canvas.height - padding)

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9)
  })

  // Create file from blob
  const processedFile = new File([blob], file.name, { type: 'image/jpeg' })

  // Upload to Walrus and return URL
  return await uploadToWalrus(processedFile)
} 