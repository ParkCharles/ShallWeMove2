/**
 * Provides Sui blockchain connectivity and wallet integration for the application
 */
import { ReactNode, useEffect } from 'react'
import { WalletProvider, SuiClientProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerStashedWallet } from '@mysten/zksend'
import { EnokiFlowProvider } from '@mysten/enoki/react'

const networks = {
  testnet: { url: getFullnodeUrl('testnet') }
}

const queryClient = new QueryClient()

// Stashed 지갑 등록
const initializeStashed = () => {
  registerStashedWallet('Stashed Wallet', {
    network: 'testnet',
    origin: 'https://getstashed.com'
  })
}

export function SuiProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initializeStashed()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <EnokiFlowProvider 
        apiKey={import.meta.env.VITE_ENOKI_API_KEY}
      >
        <SuiClientProvider 
          networks={networks} 
          defaultNetwork="testnet"
        >
          <WalletProvider 
            autoConnect
            preferredWallets={['Stashed', 'Sui Wallet']}
            enableUnsafeBurner={false}
          >
            {children}
          </WalletProvider>
        </SuiClientProvider>
      </EnokiFlowProvider>
    </QueryClientProvider>
  )
} 