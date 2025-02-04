import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { parseGpxData } from '@/utils/gpx'
import { ApiError } from '@/utils/api'
import { Auth } from '@/utils/auth'
import { createAndExecuteMintNftTransaction } from '@/utils/sui'

dayjs.extend(utc)
dayjs.extend(timezone)

// Network Variable Hook
export function useNetworkVariable<T>(
  _mainnetValue: T,
  testnetValue: T
): T {
  // For now, always return testnet value since we're only using testnet
  return testnetValue
}

// Sui Wallet Hook
export function useSuiWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsConnected(Auth.isAuthenticated())
  }, [])

  const mintNft = async (
    location: string,
    description: string,
    imageUrl: string,
    participants: number,
    maxElevation: number,
    duration: number,
    date: string,
    startTime: string,
    endTime: string
  ) => {
    if (!isConnected) throw new Error('Not authenticated')
    if (!Auth.walletAddress()) throw new Error('No wallet address')
    
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await createAndExecuteMintNftTransaction({
        location,
        description,
        imageUrl,
        participants,
        maxElevation,
        duration,
        date,
        startTime,
        endTime
      })

      return result
    } catch (error) {
      let errorMessage = 'An unexpected error occurred'
      
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setError(new Error(errorMessage))
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isConnected,
    isLoading,
    error,
    mintNft
  }
}

// Device Detection Hook
export const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent
    const mobile = Boolean(
      userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
    )
    setIsMobile(mobile)
  }, [])

  return isMobile
}

export const useGpxUpload = (
  onSuccess: (data: {
    maxElevation: number
    date: dayjs.Dayjs
    startTime: string
    endTime: string
    duration: number
    totalDistance: number
    gpxFile: File
  }) => void
) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGpxUpload = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      console.log('Processing GPX file:', file.name, 'size:', file.size)
      
      const content = await file.text()
      console.log('File content loaded, length:', content.length)
      
      const gpxData = parseGpxData(content)
      console.log('GPX data parsed successfully:', gpxData)
      
      const startTime = dayjs(gpxData.startTime).tz('Asia/Seoul')
      const endTime = dayjs(gpxData.endTime).tz('Asia/Seoul')
      
      const data = {
        maxElevation: gpxData.maxElevation,
        date: startTime,
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm'),
        duration: endTime.diff(startTime, 'minute'),
        totalDistance: gpxData.totalDistance,
        gpxFile: file,
      }
      
      console.log('Processed data:', data)
      onSuccess(data)
    } catch (error) {
      console.error('Error in handleGpxUpload:', error)
      setError('Failed to parse GPX file')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    handleGpxUpload,
    loading,
    error
  }
} 