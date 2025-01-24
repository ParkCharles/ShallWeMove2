/**
 * Root component that defines the application structure and routes
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { HowTo } from '@/pages/HowTo'
import { Hiking } from '@/pages/Hiking'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { TermsOfService } from '@/pages/TermsOfService'
import { Auth } from '@/pages/Auth'
import { Box } from '@mui/material'

function App() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          position: 'relative',
          zIndex: 0
        }}
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="how-to" element={<HowTo />} />
            <Route path="hiking" element={<Hiking />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </Box>
    </Router>
  );
}

export default App 