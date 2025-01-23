import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import Footer from '../common/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const MainLayout = styled(Box)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative;
  padding-top: ${({ theme }) => theme.breakpoints.up('md') ? '64px' : 0};
  
  & main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }
`

export const Layout = () => {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      })
    }, 0)
  }, [pathname])

  return (
    <MainLayout>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </MainLayout>
  )
}

export default Layout 