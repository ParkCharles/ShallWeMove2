import { useState, useRef, useEffect } from 'react'
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { createAndExecuteMintNftTransaction } from '@/utils/sui'
import { uploadToWalrus } from '@/utils/walrus'
import { processImage } from '@/utils/image'
import dayjs from 'dayjs'
import HikingForm from '@/components/hiking/HikingForm'
import type { HikingFormData, HikingError } from '@/types'
import { useGpxUpload, useSuiWallet } from '@/hooks'
import type { SuiSignAndExecuteTransactionOutput } from '@mysten/wallet-standard'
import type { SuiObjectChange } from '@mysten/sui/client'
import { Container, Box, Typography, Link as MuiLink } from '@mui/material'
import { HikingResult } from '@/components/hiking/HikingResult'
import { LinearGradient } from 'react-text-gradients'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Auth } from '@/utils/auth'

/**
 * Main component for handling hiking record creation and NFT minting
 */
export function Hiking() {
  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  const account = useCurrentAccount()
  const { enokiFlow } = useSuiWallet()
  
  const [formData, setFormData] = useState<HikingFormData>({
    location: '',
    description: '',
    imageFile: null,
    imageUrl: '',
    participants: 0,
    maxElevation: 0,
    duration: 0,
    date: dayjs(),
    startTime: '',
    endTime: '',
    processedImageUrl: '',
    totalDistance: 0,
    gpxFile: null
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<HikingError | null>(null)
  const [objectId, setObjectId] = useState<string | null>(null)

  const processedImageRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Handle auth callback
    const hash = window.location.hash;
    if (hash) {
      const idToken = new URLSearchParams(hash.substring(1)).get('id_token');
      if (idToken) {
        sessionStorage.setItem('sui_jwt_token', idToken);
        // 페이지 리로드하여 상태 업데이트
        window.location.reload();
      }
    }
  }, []);

  /**
   * Scrolls to a specified element with smooth behavior
   */
  const scrollToElement = (ref: React.RefObject<HTMLElement>, isImage: boolean = false) => {
    if (!ref.current) return
    
    if (isImage) {
      // For images, scroll to show the bottom of the element at 90% of viewport height
      const elementBottom = ref.current.getBoundingClientRect().bottom + window.pageYOffset
      window.scrollTo({
        top: elementBottom - (window.innerHeight * 0.9),
        behavior: 'smooth'
      })
    } else {
      // For other elements, scroll to the top
      const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  /**
   * Handles image upload and processing
   */
  const handleImageChange = async (file: File) => {
    try {
      console.log('Starting image processing:', {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)}KB`,
        fileType: file.type
      })
      
      setLoading(true)
      const watermarkInfo = {
        location: formData.location || 'Hiking',
        line2: `Max Elevation: ${formData.maxElevation} m`,
        line3: `Distance: ${(formData.totalDistance / 1000).toFixed(2)} km`
      }
      
      console.log('Processing image with watermark:', watermarkInfo)
      const processedImageUrl = await processImage(file, watermarkInfo)
      console.log('Image processed successfully')
      
      setFormData((prev) => ({ ...prev, processedImageUrl }))

      console.log('Converting processed image to blob')
      const response = await fetch(processedImageUrl)
      const blob = await response.blob()
      const processedFile = new File([blob], file.name, { type: 'image/jpeg' })
      
      console.log('Uploading processed image to Walrus')
      const url = await uploadToWalrus(processedFile)
      console.log('Walrus upload completed:', url)
      
      setFormData(prev => ({ 
        ...prev, 
        imageFile: processedFile, 
        imageUrl: url 
      }))

      setTimeout(() => scrollToElement(processedImageRef, true), 100)
    } catch (error) {
      console.error('Image processing/upload error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      setError({
        type: 'error',
        message: 'Failed to process or upload image'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (updates: Partial<HikingFormData>) => {
    console.log('Form data update:', updates)
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const { handleGpxUpload, loading: gpxLoading } = useGpxUpload((data) => {
    console.log('GPX data received:', data)
    setFormData((prev) => ({
      ...prev,
      ...data
    }))
  })

  const handleTransactionSuccess = async (response: SuiSignAndExecuteTransactionOutput) => {
    console.log('Transaction successful:', response)

    try {
      const transaction = await client.waitForTransaction({
        digest: response.digest,
        options: {
          showEffects: true,
          showObjectChanges: true
        }
      })

      console.log('Transaction details:', transaction)

      // Find the created NFT object
      const nftObject = transaction.objectChanges?.find((change: SuiObjectChange) => 
        change.type === 'created' && 
        change.objectType?.includes('::shallwemove::ShallWeMove')
      ) as { type: 'created', objectId: string } | undefined

      if (nftObject?.objectId) {
        console.log('Created NFT ID:', nftObject.objectId)
        setObjectId(nftObject.objectId)
        setTimeout(() => scrollToElement(resultRef), 100)
        return
      }

      console.log('No NFT object found in transaction')
    } catch (e) {
      console.error('Error processing transaction:', e)
      setError({
        type: 'error',
        message: 'Failed to process transaction result'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!account) {
        setError({
          type: 'warning',
          message: 'Please connect your wallet first'
        })
        return
      }

      if (!Auth.isAuthenticated()) {
        setError({
          type: 'warning',
          message: 'Please login first'
        })
        return
      }

      if (!formData.location || !formData.imageUrl) {
        setError({
          type: 'error',
          message: 'Location and image are required'
        })
        return
      }

      setLoading(true)
      console.log('Form data:', formData)
      
      console.log('Creating transaction...')
      const tx = await createAndExecuteMintNftTransaction(
        enokiFlow,
        {
          location: formData.location,
          description: formData.description,
          imageUrl: formData.imageUrl,
          participants: formData.participants,
          maxElevation: formData.maxElevation,
          duration: formData.duration,
          date: formData.date.unix(),
          startTime: dayjs(`${formData.date.format('YYYY-MM-DD')} ${formData.startTime}`).unix(),
          endTime: dayjs(`${formData.date.format('YYYY-MM-DD')} ${formData.endTime}`).unix()
        }
      );

      console.log('Executing transaction...')
      
      await signAndExecuteTransaction({
        transaction: tx
      }, {
        onSuccess: (result: SuiSignAndExecuteTransactionOutput) => {
          console.log('Transaction success:', result)
          handleTransactionSuccess(result)
        },
        onError: (error: Error) => {
          console.error('Transaction failed:', error)
          setError({
            type: 'error',
            message: error.message || 'Failed to mint NFT'
          })
        }
      })
      
    } catch (error) {
      console.error('Transaction error:', error)
      setError({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to mint NFT'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: '#f5f5f5', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container>
        <Box sx={{ mt: { xs: 8, md: 10 }, mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              mb: 4
            }}>
              <Box
                component="img"
                src="./shallwe.png"
                alt="Shallwe character"
                sx={{
                  width: { xs: '100px', md: '140px' },
                  height: 'auto',
                  animation: 'float 3s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                  }
                }}
              />
              
              <Box>
                <Typography variant="h3" gutterBottom>
                  <LinearGradient gradient={['to right', '#1a237e, #0d47a1']}>
                    Record Your Hiking Journey
                  </LinearGradient>
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ color: '#6e6e73' }}
                >
                  Store your memories permanently on the blockchain
                </Typography>
              </Box>
            </Box>

            <Typography 
              variant="body1" 
              textAlign="center"
              sx={{ color: '#6e6e73', mt: 2 }}
            >
              Need help? <MuiLink component={Link} to="/how-to">step-by-step guide</MuiLink>
            </Typography>
          </motion.div>
        </Box>

        <Box ref={processedImageRef}>
          <HikingForm
            formData={formData}
            onFormChange={handleFormChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            loading={loading || gpxLoading}
            error={error}
            onGpxUpload={handleGpxUpload}
            account={!!account}
          />
        </Box>
        
        {objectId && (
          <Box ref={resultRef}>
            <HikingResult 
              objectId={objectId}
              location={formData.location}
            />
          </Box>
        )}
      </Container>
    </Box>
  )
}
