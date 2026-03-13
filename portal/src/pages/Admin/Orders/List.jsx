import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Eye,
  Hash,
  ArrowUpDown,
  Filter
} from 'lucide-react'
import apiClient from '@config/api'
import { Link } from 'react-router-dom'
import { ROUTES } from '@utils/constants'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/admin/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error('Failed to fetch admin orders', err)
        setError('Gagal mengambil data pesanan')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Processing Database...</p>
    </div>
  )

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-tighter">
            <ShoppingBag className="w-4 h-4" /> Operations
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
            Order <span className="text-primary">Management</span>
          </h1>
          <p className="text-muted-foreground font-medium">Control and monitor all incoming transactions.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button className="p-3 bg-muted/50 rounded-xl hover:bg-muted border border-border transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-3 bg-muted/50 rounded-xl hover:bg-muted border border-border transition-all">
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-left">Internal Transaction Log</h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto px-6">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">Zero Transactions</h3>
            <p className="text-muted-foreground text-sm">Waiting for incoming orders to be registered in the system.</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">ID</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Customer</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Timestamp</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-8 py-4 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground">Settlement</th>
                    <th className="px-8 py-4 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-primary/[0.02] transition-colors text-left">
                      <td className="px-8 py-6">
                        <code className="text-[10px] font-black font-mono bg-muted/50 px-2.5 py-1.5 rounded-xl border border-border/50">
                          {order.id}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-sm tracking-tight">{order.user?.name || 'Guest'}</div>
                        <div className="text-[10px] font-black uppercase text-muted-foreground/60">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-8 py-6 text-[11px] font-bold text-muted-foreground uppercase">
                        {new Date(order.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {order.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-sm tabular-nums">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link 
                          to={`/admin/orders/${order.id}`}
                          className="p-2.5 bg-muted/50 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center float-right"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border/30 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-left">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <code className="text-[9px] font-black font-mono break-all line-clamp-1">{order.id}</code>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start text-left">
                      <div>
                        <div className="font-black text-sm leading-tight mb-1">{order.user?.name || 'Guest'}</div>
                        <div className="text-[10px] font-bold text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black tabular-nums">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                      >
                        Details <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
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

export default OrderList
