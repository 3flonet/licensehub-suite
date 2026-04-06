import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useStore from '@store/useStore'
import apiClient from '@config/api'
import { ROUTES } from '@utils/constants'
import { 
  Key, 
  Calendar, 
  AlertCircle, 
  ExternalLink, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock,
  Box
} from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card/50 backdrop-blur-xl p-6 rounded-3xl border border-border/50 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group"
  >
    <div className="flex items-center justify-between text-left">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-primary transition-colors">{title}</p>
        <p className={`text-4xl font-black ${color}`}>{value}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-muted/50 group-hover:bg-primary/10 transition-colors`}>
        <Icon className={`w-8 h-8 ${color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`} />
      </div>
    </div>
  </motion.div>
)

const PortalDashboard = () => {
  const { user } = useStore()
  const [licenses, setLicenses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLicenses()
  }, [])

  const fetchLicenses = async () => {
    try {
      const res = await apiClient.get('/portal/licenses')
      setLicenses(res.data)
    } catch (err) {
      console.error('Failed to fetch licenses', err)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: licenses.length,
    active: licenses.filter(l => l.status === 'active').length,
    expiring: licenses.filter(l => {
      if (!l.expires_at) return false
      const expiry = new Date(l.expires_at)
      const diff = expiry.getTime() - new Date().getTime()
      return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000)
    }).length
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-tighter">
            <ShieldCheck className="w-4 h-4" /> Client Portal
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight md:leading-none">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-foreground">{user?.name}!</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage your digital assets and security keys.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Link 
            to={ROUTES.PORTAL_BILLING} 
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-muted/50 hover:bg-muted border border-border transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Order History
          </Link>
          <Link 
            to={ROUTES.PRODUCTS} 
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4" /> Upgrade Plan
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Licenses" 
          value={stats.total} 
          icon={Key} 
          color="text-primary"
          delay={0.1}
        />
        <StatCard 
          title="Active Now" 
          value={stats.active} 
          icon={ShieldCheck} 
          color="text-green-500"
          delay={0.2}
        />
        <StatCard 
          title="Expiring Soon" 
          value={stats.expiring} 
          icon={Clock} 
          color="text-yellow-500"
          delay={0.3}
        />
      </div>

      {/* Main Content Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between mb-4">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" /> Active Certificates
          </h2>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-[10px]">Synchronizing Keys...</p>
          </div>
        ) : licenses.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto px-6">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No Active Licenses</h3>
            <p className="text-muted-foreground text-sm mb-8">
              You haven't purchased any licenses yet. Start building your ecosystem today.
            </p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              Browse Marketplace <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Product Details</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">License Token</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Secret Token</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Validity</th>
                    <th className="px-8 py-4 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {licenses.map((license) => (
                    <tr key={license.id} className="group hover:bg-primary/[0.02] transition-colors text-left">
                      <td className="px-8 py-6">
                        <div className="font-bold text-base group-hover:text-primary transition-colors">{license.product?.name}</div>
                        <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60">{license.plan?.name}</div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="bg-muted/50 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-border/50">
                          {license.license_key}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <code className="bg-muted/50 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-border/50">
                          {license.product?.api_secret}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            license.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
                            'bg-gray-400'
                          }`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${
                            license.status === 'active' ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {license.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold">
                          {license.expires_at ? new Date(license.expires_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime Access'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          to={`/portal/licenses/${license.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all group/btn"
                        >
                          Control <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {licenses.map((license) => (
                <div key={license.id} className="bg-muted/30 border border-border/50 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 text-left">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Box className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-bold text-sm leading-tight">{license.product?.name}</div>
                        <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60">{license.plan?.name}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      license.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {license.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">License Key</p>
                    <code className="block bg-background/50 border border-border/50 px-3 py-2 rounded-xl text-xs font-mono font-bold break-all">
                      {license.license_key}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Secret Key</p>
                    <code className="block bg-background/50 border border-border/50 px-3 py-2 rounded-xl text-xs font-mono font-bold break-all">
                      {license.product?.api_secret}
                    </code>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <div className="text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Validity</p>
                      <p className="text-xs font-bold">
                        {license.expires_at ? new Date(license.expires_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Lifetime'}
                      </p>
                    </div>
                    <Link 
                      to={`/portal/licenses/${license.id}`}
                      className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-primary/20"
                    >
                      Manage <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default PortalDashboard
