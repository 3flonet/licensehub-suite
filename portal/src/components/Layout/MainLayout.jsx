import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import CookieConsent from '../CookieConsent'
import MobileBottomNav from './MobileBottomNav'

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <MobileBottomNav />
    </div>
  )
}

export default MainLayout
