import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Key,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import useAuth from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: ROUTES.ADMIN_DASHBOARD,
  },
  {
    label: 'Products',
    icon: Package,
    href: ROUTES.ADMIN_PRODUCTS,
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    href: ROUTES.ADMIN_ORDERS,
  },
  {
    label: 'Customers',
    icon: Users,
    href: ROUTES.ADMIN_CUSTOMERS,
  },
  {
    label: 'Licenses',
    icon: Key,
    href: ROUTES.ADMIN_LICENSES,
  },
  {
    label: 'Reports',
    icon: BarChart3,
    href: ROUTES.ADMIN_REPORTS,
  },
]

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {isOpen && (
            <h1 className="font-bold text-lg text-primary">Admin</h1>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-muted rounded transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-muted rounded-lg transition"
                title={!isOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
