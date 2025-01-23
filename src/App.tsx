/**
 * Root component that defines the application structure and routes
 */
import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { HowTo } from '@/pages/HowTo'
import { Hiking } from '@/pages/Hiking'
import { Auth } from '@/pages/Auth'
import { Box } from '@mui/material'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'how-to', element: <HowTo /> },
      { path: 'hiking', element: <Hiking /> },
      { path: 'auth', element: <Auth /> },
    ]
  }
])

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        zIndex: 0
      }}
    >
      {/* ... rest of your app ... */}
    </Box>
  );
}

export default App 