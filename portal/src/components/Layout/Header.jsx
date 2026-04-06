import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import useStore from '@store/useStore'
import useCartStore from '@store/cartStore'
import useAuth from '@hooks/useAuth'
import Button from '@components/Button'
import { ROUTES } from '@utils/constants'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, user, role, isDarkMode, toggleTheme, siteSettings } = useStore()
  const { items } = useCartStore()
  const { logout } = useAuth()
  
  const siteName = siteSettings?.site_name || '3Flo LicenseHub'
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')
  
  const lightLogo = siteSettings?.site_logo ? `${backendUrl}/storage/${siteSettings.site_logo}` : null
  const darkLogo = siteSettings?.site_logo_dark ? `${backendUrl}/storage/${siteSettings.site_logo_dark}` : null
  const logoUrl = isDarkMode ? (darkLogo || lightLogo) : lightLogo
  const navigate = useNavigate()

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 font-bold text-xl text-primary"
            >
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
              ) : (
                <>
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
                    {siteName.substring(0, 2).toUpperCase()}
                  </span>
                  <span>{siteName}</span>
                </>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to={ROUTES.HOME}
              className="text-sm text-foreground hover:text-primary transition"
            >
              Home
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-sm text-foreground hover:text-primary transition"
            >
              Products
            </Link>
            <Link
              to={ROUTES.FEATURES}
              className="text-sm text-foreground hover:text-primary transition"
            >
              Features
            </Link>
            <Link
              to={ROUTES.FAQ}
              className="text-sm text-foreground hover:text-primary transition"
            >
              FAQ
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="text-sm text-foreground hover:text-primary transition"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart - Hidden on Mobile because of Bottom Nav */}
            <Link
              to={ROUTES.CART}
              className="hidden md:flex p-2 hover:bg-muted rounded-lg transition relative"
              aria-label="View cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Buttons - Desktop Only in Header maybe? No, keep some access but let bottom nav handle main portal */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {user?.name}
                    </span>
                  </div>

                  {role === 'admin' && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="text-sm px-3 py-2 hover:bg-muted rounded transition"
                    >
                      Admin
                    </Link>
                  )}

                  <Link
                    to={ROUTES.PORTAL_DASHBOARD}
                    className="text-sm px-3 py-2 hover:bg-muted rounded transition"
                  >
                    Portal
                  </Link>

                  <Link
                    to={ROUTES.PORTAL_BILLING}
                    className="text-sm px-3 py-2 hover:bg-muted rounded transition"
                  >
                    Billing
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Optional, keeping for secondary links like FAQ/Docs */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t border-border">
            <Link
              to={ROUTES.HOME}
              className="block px-4 py-2 hover:bg-muted rounded transition"
            >
              Home
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="block px-4 py-2 hover:bg-muted rounded transition"
            >
              Products
            </Link>
            <Link
              to={ROUTES.FEATURES}
              className="block px-4 py-2 hover:bg-muted rounded transition"
            >
              Features
            </Link>
            <Link
              to={ROUTES.FAQ}
              className="block px-4 py-2 hover:bg-muted rounded transition"
            >
              FAQ
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="block px-4 py-2 hover:bg-muted rounded transition"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
