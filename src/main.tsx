/**
 * Application entry point with provider configurations
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { EnokiFlowProvider } from '@mysten/enoki/react'
import { SuiProvider } from './components/common/SuiProvider'
import { theme } from '@/theme'
import App from './App'  // router 대신 App을 import

const queryClient = new QueryClient()

document.title = 'Shall We Move'

// 개발 환경에서만 콘솔 로그를 출력
if (import.meta.env.DEV) {
  console.log('Development mode');
} else {
  // 프로덕션 환경에서는 콘솔 로그를 비활성화
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <EnokiFlowProvider apiKey={import.meta.env.VITE_ENOKI_API_KEY}>
            <SuiProvider>
              <App />  {/* RouterProvider 대신 App 컴포넌트 사용 */}
            </SuiProvider>
          </EnokiFlowProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
)
