import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard, 
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Hash
} from 'lucide-react'
import apiClient from '@config/api'
import MidtransPayment from '@components/MidtransPayment'
import { ROUTES } from '@utils/constants'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentSnapToken, setCurrentSnapToken] = useState(null)

  useEffect(() => {
    apiClient.get('/portal/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error('Failed to load orders:', err)
        setError('Gagal memuat riwayat pesanan')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Retrieving Transactions...</p>
    </div>
  )

  if (error) return (
    <div className="p-8 text-center max-w-md mx-auto">
      <div className="bg-red-50 dark:bg-red-950/30 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 text-left">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-black mb-2 text-center">Sync Failed</h2>
        <p className="text-red-600/70 text-sm mb-6 text-center">{error}</p>
        <button onClick={() => window.location.reload()} className="w-full bg-red-500 text-white px-8 py-3 rounded-xl font-bold text-sm">Try Again</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-left"
      >
        <Link 
          to={ROUTES.PORTAL_DASHBOARD} 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Intelligence Dashboard
        </Link>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2">
          Billing <span className="text-primary">Ledger</span>
        </h1>
        <p className="text-muted-foreground font-medium">Review your transaction history and pending settlements.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-left">Purchase Logs</h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="p-16 md:p-24 text-center max-w-sm mx-auto px-6">
            <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">Empty Ledger</h3>
            <p className="text-muted-foreground text-sm mb-8">No transactions found in your records. Initialize your first purchase to see data here.</p>
            <Link to={ROUTES.PRODUCTS} className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
              Go to Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Reference</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Asset</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Timestamp</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-8 py-4 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-primary/[0.02] transition-colors text-left">
                      <td className="px-8 py-6">
                        <code className="text-[10px] font-black font-mono bg-muted/50 px-2.5 py-1.5 rounded-xl border border-border/50 whitespace-nowrap overflow-hidden text-ellipsis block max-w-[150px]">
                          {order.id}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{order.plan?.product?.name || 'Unknown Product'}</div>
                        <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60">{order.plan?.name || 'N/A'}</div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {order.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {order.status}
                          </span>
                          
                          {order.status === 'pending' && order.snap_token && (
                            <button 
                              onClick={() => setCurrentSnapToken(order.snap_token)}
                              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                              <CreditCard className="w-3 h-3" /> Settle Now
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-sm tabular-nums whitespace-nowrap">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border/30 bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-left">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <code className="text-[9px] font-black font-mono break-all line-clamp-1">{order.id}</code>
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase">{new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start text-left">
                      <div>
                        <div className="font-black text-sm text-primary mb-1">{order.plan?.product?.name || 'Unknown'}</div>
                        <div className="text-[10px] font-black tracking-widest uppercase text-muted-foreground/60">{order.plan?.name || 'N/A'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black tabular-nums">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      
                      {order.status === 'pending' && order.snap_token && (
                        <button 
                          onClick={() => setCurrentSnapToken(order.snap_token)}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                          <CreditCard className="w-4 h-4" /> Settle Now <ChevronRight className="w-3 h-3 ml-auto" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Midtrans Modal Integration */}
      <AnimatePresence>
        {currentSnapToken && (
          <MidtransPayment 
            token={currentSnapToken}
            onSuccess={() => {
              setCurrentSnapToken(null)
              window.location.reload()
            }}
            onPending={() => setCurrentSnapToken(null)}
            onError={() => {
              setCurrentSnapToken(null)
              alert('Pembayaran gagal, silakan coba lagi.')
            }}
            onClose={() => setCurrentSnapToken(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrderHistory
