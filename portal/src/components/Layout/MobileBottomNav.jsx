import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Package, 
  User, 
  MessageSquare, 
  LayoutDashboard,
  ShoppingCart
} from 'lucide-react'
import { ROUTES } from '@utils/constants'
import useStore from '@store/useStore'
import useCartStore from '@store/cartStore'
import { motion, AnimatePresence } from 'framer-motion'

const NavItem = ({ to, icon: Icon, label, isActive }) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center justify-center flex-1 relative py-2 transition-colors duration-300 ${
      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    <div className="relative">
      <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-primary/10 rounded-xl -z-10"
          initial={false}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      )}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>
  </Link>
)

const MobileBottomNav = () => {
  const location = useLocation()
  const { isAuthenticated } = useStore()
  const { items } = useCartStore()
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  
  const currentPath = location.pathname

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] px-6 pb-6 pointer-events-none">
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-card/80 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-[2.5rem] flex items-center justify-around h-20 px-4 pointer-events-auto overflow-hidden relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        
        <NavItem 
          to={ROUTES.HOME} 
          icon={Home} 
          label="Home" 
          isActive={currentPath === ROUTES.HOME} 
        />
        
        <NavItem 
          to={ROUTES.PRODUCTS} 
          icon={Package} 
          label="Store" 
          isActive={currentPath === ROUTES.PRODUCTS} 
        />

        <Link 
            to={ROUTES.CART} 
            className={`flex flex-col items-center justify-center flex-1 relative py-2 transition-colors duration-300 ${
            currentPath === ROUTES.CART ? 'text-primary' : 'text-muted-foreground'
            }`}
        >
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 -mt-8 relative border-4 border-background">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary shadow-sm">
                        {cartItemCount}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">Cart</span>
        </Link>
        
        <NavItem 
          to={ROUTES.CONTACT} 
          icon={MessageSquare} 
          label="Help" 
          isActive={currentPath === ROUTES.CONTACT} 
        />
        
        {isAuthenticated ? (
          <NavItem 
            to={ROUTES.PORTAL_DASHBOARD} 
            icon={LayoutDashboard} 
            label="Portal" 
            isActive={currentPath.startsWith('/portal')} 
          />
        ) : (
          <NavItem 
            to={ROUTES.LOGIN} 
            icon={User} 
            label="Login" 
            isActive={currentPath === ROUTES.LOGIN} 
          />
        )}
      </motion.nav>
    </div>
  )
}

export default MobileBottomNav
