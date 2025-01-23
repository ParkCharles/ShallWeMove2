/**
 * Application entry point with provider configurations
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './App'
import { SuiProvider } from './components/common/SuiProvider'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { EnokiFlowProvider } from '@mysten/enoki/react'
import '@mysten/dapp-kit/dist/index.css'

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* EnokiFlowProvider 추가 */}
        <EnokiFlowProvider apiKey={import.meta.env.VITE_ENOKI_API_KEY}>
          <SuiProvider>
            <RouterProvider router={router} />
          </SuiProvider>
        </EnokiFlowProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
)
