import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import useStore from '@store/useStore'
import ProtectedRoute from '@components/ProtectedRoute'
import { ROUTES } from '@utils/constants'
import apiClient from '@config/api'

// Layout
import MainLayout from '@components/Layout/MainLayout'
import AdminLayout from '@components/Layout/AdminLayout'

// Public Pages
import HomePage from '@pages/Home'
import FeaturesPage from '@pages/Features'
import ComparePlansPage from '@pages/ComparePlans'
import FAQPage from '@pages/FAQ'
import DocsPage from '@pages/Docs'
import ContactPage from '@pages/Contact'
import CookiesPage from '@pages/Cookies'
import PrivacyPage from '@pages/Privacy'
import TermsPage from '@pages/Terms'
import LoginPage from '@pages/Auth/Login'
import RegisterPage from '@pages/Auth/Register'
import ForgotPasswordPage from '@pages/Auth/ForgotPassword'
import ResetPasswordPage from '@pages/Auth/ResetPassword'
import NotFoundPage from '@pages/NotFound'
import MaintenancePage from '@pages/Maintenance'

// Portal Pages (Protected)
import PortalDashboard from '@pages/Portal/Dashboard'
import OrderHistory from '@pages/Portal/OrderHistory'
import LicenseDelivery from '@pages/Portal/LicenseDelivery'
import LicenseDetail from '@pages/Portal/LicenseDetail'

// Admin Pages (Protected)
import AdminDashboard from '@pages/Admin/Dashboard'
import Storefront from '@pages/Storefront'
import Cart from '@pages/Cart'
import Checkout from '@pages/Checkout'
import OrderConfirmation from '@pages/OrderConfirmation'
import ProductDetail from '@pages/ProductDetail'
import PaymentSuccess from '@pages/PaymentSuccess'
import ProductList from '@pages/Admin/Products/List'
import ProductEdit from '@pages/Admin/Products/Edit'
import OrderList from '@pages/Admin/Orders/List'
import OrderDetail from '@pages/Admin/Orders/Detail'

function App() {
  const { setTheme, isDarkMode, siteSettings, setSiteSettings } = useStore()

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setTheme(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      setTheme(false)
      document.documentElement.removeAttribute('data-theme')
    }
  }, [setTheme])

  // Fetch Site Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/settings/site')
        setSiteSettings(res.data)
      } catch (err) {
        console.error('Failed to fetch site settings', err)
      }
    }
    fetchSettings()
  }, [setSiteSettings])

  // Apply Site Settings to Meta/Title
  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.site_name) {
        document.title = `${siteSettings.site_name} | ${siteSettings.site_tagline || ''}`
        const ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) ogTitle.content = siteSettings.site_name
      }
      if (siteSettings.site_description) {
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc) metaDesc.content = siteSettings.site_description
        const ogDesc = document.querySelector('meta[property="og:description"]')
        if (ogDesc) ogDesc.content = siteSettings.site_description
      }
      if (siteSettings.site_favicon) {
        let link = document.querySelector("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        const backendUrl = apiClient.defaults.baseURL.replace('/api/v1', '')
        link.href = `${backendUrl}/storage/${siteSettings.site_favicon}`
      }
    }
  }, [siteSettings])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.FEATURES} element={<FeaturesPage />} />
          <Route path={ROUTES.COMPARE_PLANS} element={<ComparePlansPage />} />
          <Route path={ROUTES.FAQ} element={<FAQPage />} />
          <Route path={ROUTES.DOCS} element={<DocsPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.COOKIES} element={<CookiesPage />} />
          <Route path={ROUTES.PRIVACY} element={<PrivacyPage />} />
          <Route path={ROUTES.TERMS} element={<TermsPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.PRODUCTS} element={<Storefront />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
          <Route path={ROUTES.ORDER_CONFIRM} element={<OrderConfirmation />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
        </Route>

        {/* Standalone Pages - No Layout */}
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Portal Routes (Protected) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.PORTAL_DASHBOARD} element={<PortalDashboard />} />
          <Route path={ROUTES.PORTAL_BILLING} element={<OrderHistory />} />
          <Route path={ROUTES.PORTAL_LICENSES} element={<LicenseDelivery />} />
          <Route path={ROUTES.PORTAL_LICENSE_DETAIL} element={<LicenseDetail />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<ProductList />} />
          <Route path={ROUTES.ADMIN_PRODUCT_EDIT} element={<ProductEdit />} />
          <Route path={ROUTES.ADMIN_ORDERS} element={<OrderList />} />
          <Route path={ROUTES.ADMIN_ORDER_DETAIL} element={<OrderDetail />} />
        </Route>

        {/* Catch all - Not Found */}
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
