import { useState, useEffect } from 'react'
import { useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit'
import { useEnokiFlow } from '@mysten/enoki/react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { parseGpxData } from '@/utils/gpx'
import { STASHED_WALLET_NAME } from '@mysten/zksend'
import { toBase64,fromBase64 } from '@mysten/bcs'
import { ApiError } from '@/utils/api'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { api } from '@/utils/api'

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
  const account = useCurrentAccount()
  const { currentWallet } = useCurrentWallet()
  const [isConnected, setIsConnected] = useState(false)
  const [isStashedWallet, setIsStashedWallet] = useState(false)
  const enokiFlow = useEnokiFlow()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsConnected(!!account)
    setIsStashedWallet(currentWallet?.name === STASHED_WALLET_NAME)
  }, [account, currentWallet])

  const mintNft = async (
    location: string,
    description: string,
    imageUrl: string,
    participants: number,
    maxElevation: number,
    duration: number,
    date: number,
    startTime: number,
    endTime: number
  ) => {
    if (!isConnected) throw new Error('Wallet not connected')
    if (!account?.address) throw new Error('No wallet address')
    if (!enokiFlow) throw new Error('Enoki flow not initialized')
    
    setIsLoading(true)
    setError(null)
    
    try {
      // 1. Create transaction block
      const tx = new Transaction()
      tx.moveCall({
        target: `${import.meta.env.VITE_PACKAGE_ID}::shallwemove::mint`,
        arguments: [
          tx.pure.string(location),
          tx.pure.string(description),
          tx.pure.string(imageUrl),
          tx.pure.u16(participants),
          tx.pure.u16(maxElevation),
          tx.pure.u16(duration),
          tx.pure.string(dayjs.unix(date).format('YYYY-MM-DD')),
          tx.pure.string(dayjs.unix(startTime).format('HH:mm')),
          tx.pure.string(dayjs.unix(endTime).format('HH:mm'))
        ]
      })

      // 2. Get transaction bytes
      const client = new SuiClient({ url: getFullnodeUrl('testnet') })
      const txBytes = await tx.build({
        client,
        onlyTransactionKind: true,
      })

      // 3. Create sponsored transaction
      const sponsored = await api.createSponsoredTransaction(
        account.address,
        {
          transactionKindBytes: toBase64(txBytes),
        }
      )

      // 4. Sign transaction
      const signer = await enokiFlow.getKeypair()
      const signature = await signer.signTransaction(fromBase64(sponsored.bytes))
      
      if (!signature) {
        throw new Error('Failed to sign transaction')
      }

      // 5. Execute transaction
      const result = await api.executeTransaction(
        sponsored.digest,
        signature.signature
      )

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
    account,
    walletAddress: account?.address,
    isStashedWallet,
    enokiFlow,
    mintNft,
    isLoading,
    error
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