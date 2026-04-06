import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Key, 
  DollarSign, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Package,
  Activity
} from 'lucide-react'
import apiClient from '@config/api'

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

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/admin/dashboard')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error('Admin Dashboard Sync Error:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Synchronizing Multi-Terminal Metrics...</p>
    </div>
  )

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-1 text-left"
      >
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-tighter">
          <ShieldCheck className="w-4 h-4" /> System Administrator
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
          Control <span className="text-primary">Center</span>
        </h1>
        <p className="text-muted-foreground font-medium">Real-time business performance and metric aggregation.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Product" 
          value={stats?.products ?? 0} 
          icon={Package} 
          color="text-primary"
          delay={0.1}
        />
        <StatCard 
          title="Active Orders" 
          value={stats?.orders ?? 0} 
          icon={TrendingUp} 
          color="text-green-500"
          delay={0.2}
        />
        <StatCard 
          title="Issued Licenses" 
          value={stats?.licenses ?? 0} 
          icon={Key} 
          color="text-blue-500"
          delay={0.3}
        />
        <StatCard 
          title="Customer Base" 
          value={stats?.customers ?? 0} 
          icon={Users} 
          color="text-yellow-500"
          delay={0.4}
        />
      </div>

      {/* Analytics Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Revenue Velocity
            </h2>
          </div>
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
            <BarChart3 className="w-12 h-12 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest text-[10px]">Aggregating Data Flows...</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Fulfillment Queue
            </h2>
          </div>
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-2">
            <DollarSign className="w-12 h-12 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest text-[10px]">Awaiting Transaction Sync...</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
