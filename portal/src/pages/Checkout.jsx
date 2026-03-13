import useCartStore from '@store/cartStore'
import useStore from '@store/useStore'
import Button from '@components/Button'
import { getSnapToken, validatePromo } from '@services/productService'
import MidtransPayment from '@components/MidtransPayment'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreditCard, ArrowLeft, ShieldCheck, ShoppingCart, Tag, CheckCircle2, X } from 'lucide-react'

const Checkout = () => {
  const { items, clearCart } = useCartStore()
  const { isAuthenticated } = useStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snapToken, setSnapToken] = useState(null)
  
  // Promo states
  const [promoInput, setPromoInput] = useState('')
  const [validatingPromo, setValidatingPromo] = useState(false)
  const [promoResult, setPromoResult] = useState(null) // { original_subtotal, discount_amount, final_total, promo: { code } }
  const [promoError, setPromoError] = useState(null)
  
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')

  const navigate = useNavigate()

  const subtotalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const finalAmount = promoResult ? promoResult.final_total : subtotalAmount

  const handleCheckout = async () => {
    if (items.length === 0) return

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const planId = items[0].selected_plan_id || items[0].id 
      const codeToApply = promoResult ? promoResult.promo.code : null
      
      const result = await getSnapToken(planId, codeToApply)
      
      if (result.snap_token) {
        setSnapToken(result.snap_token)
      } else {
        throw new Error('Gagal mendapatkan token pembayaran')
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat memproses pesanan')
      setLoading(false)
    }
  }

  const handleApplyPromo = async (e) => {
    e.preventDefault()
    if (!promoInput.trim()) return

    setValidatingPromo(true)
    setPromoError(null)

    try {
      const payload = {
        code: promoInput,
        items: items.map(item => ({
          plan_id: item.selected_plan_id || item.id,
          quantity: item.quantity
        }))
      }
      
      const result = await validatePromo(payload)
      setPromoResult(result)
      setPromoInput('')
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Invalid promo code.')
      setPromoResult(null)
    } finally {
      setValidatingPromo(false)
    }
  }

  const removePromo = () => {
    setPromoResult(null)
    setPromoError(null)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center py-24">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Choose a product from our store to get started.</p>
        <Link to="/products">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <Link to="/products" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>
            <div className="divide-y divide-border">
              {items.map(item => (
                <div key={item.id} className="p-6 flex gap-4">
                  {item.logo ? (
                    <div className="w-16 h-16 bg-white border border-border rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                      <img src={`${backendUrl}/storage/${item.logo}`} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-8 h-8 text-primary opacity-40" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Plan: {item.plan_name || 'Standard'}</p>
                      </div>
                      <p className="font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold mb-4 text-center">Payment Info</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(subtotalAmount)}</span>
              </div>
              
              {/* Promo Code Input */}
              {!promoResult ? (
                <form onSubmit={handleApplyPromo} className="pt-2 pb-2">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Promo code" 
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase transition"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="outline" 
                      size="sm"
                      disabled={!promoInput.trim() || validatingPromo}
                    >
                      {validatingPromo ? '...' : 'Apply'}
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
                </form>
              ) : (
                <div className="flex justify-between text-sm items-center bg-green-500/10 text-green-600 border border-green-500/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold">{promoResult.promo.code}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">- {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(promoResult.discount_amount)}</span>
                    <button onClick={removePromo} className="text-green-600/50 hover:text-red-500 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (0%)</span>
                <span>Rp 0</span>
              </div>
              <div className="border-t border-border pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(finalAmount)}</span>
              </div>
            </div>

            <Button 
                variant="solid" 
                size="lg" 
                className="w-full py-6 text-lg font-bold"
                onClick={handleCheckout} 
                disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Pay Now
                </span>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs text-center border border-red-100 italic">
                {error}
              </div>
            )}

            <p className="text-[10px] text-center text-muted-foreground">
              Secure payment processed by <b>Midtrans</b>. Your license will be delivered instantly after confirmation.
            </p>
          </div>
        </div>
      </div>

      {snapToken && (
        <MidtransPayment
          token={snapToken}
          onSuccess={(result) => {
            clearCart()
            navigate('/payment-success', { replace: true })
          }}
          onPending={(result) => {
            clearCart()
            navigate('/payment-success', { replace: true })
          }}
          onError={(err) => {
            setError('Pembayaran gagal. Silakan coba lagi.')
            setSnapToken(null)
            setLoading(false)
          }}
          onClose={() => {
            setSnapToken(null)
            setLoading(false)
          }}
        />
      )}
    </div>
  )
}

export default Checkout
