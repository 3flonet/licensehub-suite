import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProduct } from '../services/productService'
import Button from '../components/Button'
import useCartStore from '../store/cartStore'
import { ROUTES } from '../utils/constants'
import { Shield, Zap, Globe, Package, ArrowLeft, Check, Info, Eye } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCartStore()
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (product) {
       document.title = `${product.name} - Details`
    }
  }, [product])

  const handleBuy = (plan) => {
    const cartItem = {
      id: plan.id,
      product_id: product.id,
      name: product.name,
      plan_name: plan.name,
      price: plan.price,
      version: product.version,
      quantity: 1,
      selected_plan_id: plan.id,
      logo: product.logo
    }
    addToCart(cartItem)
    navigate(ROUTES.CART)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
  
  if (error) return (
    <div className="max-w-7xl mx-auto p-8 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block border border-red-100">
            <h2 className="text-xl font-bold mb-2">Error Loading Product</h2>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate(ROUTES.PRODUCTS)}>Back to Store</Button>
        </div>
    </div>
  )

  if (!product) return (
     <div className="max-w-7xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold">Product not found.</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate(ROUTES.PRODUCTS)}>Back to Store</Button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:p-8">
      {/* Back link */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
        Back to Products
      </button>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Product Info & Images */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Main Logo/Icon */}
            {product.logo ? (
                <div className="w-28 h-28 md:w-40 md:h-40 bg-card rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-border p-3 md:p-4 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={`${backendUrl}/storage/${product.logo}`} alt={product.name} className="w-full h-full object-contain rounded-[1.5rem] md:rounded-[1.8rem]" />
                </div>
            ) : (
                <div className="w-28 h-28 md:w-40 md:h-40 bg-primary/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shrink-0">
                    <Package className="w-14 h-14 md:w-20 md:h-20 text-primary" />
                </div>
            )}

            <div className="flex-grow pt-2 md:pt-4">
                <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">{product.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20">v{product.version}</span>
                    <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border border-green-500/20">
                        <Check className="w-4 h-4" /> Ready for Production
                    </span>
                </div>
                <div className="mt-8 flex flex-wrap gap-6">
                    {product.documentation_url && (
                        <a href={product.documentation_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base font-semibold text-primary hover:opacity-80 transition underline decoration-2 underline-offset-4">
                             Documentation →
                        </a>
                    )}
                    {product.preview_url && (
                        <a href={product.preview_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base font-semibold text-primary hover:opacity-80 transition underline decoration-2 underline-offset-4">
                             Live Preview →
                        </a>
                    )}
                </div>
            </div>
          </div>

          {/* Product Gallery (Screenshots) */}
          {product.images && product.images.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Product Screenshots
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.images.map((img, idx) => (
                        <div key={idx} className="group relative aspect-video bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-zoom-in">
                            <img 
                                src={`${backendUrl}/storage/${img}`} 
                                alt={`${product.name} screen ${idx + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Rich Text Overview */}
          <div className="bg-card border border-border rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                Detailed Overview
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed rich-text-content">
                <div 
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                />
            </div>
          </div>
        </div>

        {/* Right: Pricing Plans */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <div className="sticky top-8">
            <h2 className="text-3xl font-black mb-8 tracking-tight">Available Licenses</h2>
            <div className="space-y-5">
                {product.license_plans?.map(plan => (
                <div key={plan.id} className="bg-card border border-border rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group relative">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold transition group-hover:text-primary mb-1">{plan.name}</h3>
                            <div className="inline-flex items-center px-3 py-1 rounded-lg bg-muted text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                {plan.billing_model.replace('_', ' ')}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-foreground">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(plan.price)}</div>
                            <div className="text-xs font-bold text-muted-foreground/60 mt-1 italic">
                                {plan.billing_model === 'monthly' ? 'per month' : plan.billing_model === 'annual' ? 'per year' : 'lifetime access'}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border w-full mb-6" />

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Globe className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground">Support for <strong className="text-foreground">{plan.max_domains === 0 ? 'Unlimited' : plan.max_domains}</strong> domains</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Zap className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="text-muted-foreground">Immediate License Key Delivery</span>
                        </li>
                        <li className="flex items-center gap-3 text-sm font-medium">
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-muted-foreground">Certified Security Updates</span>
                        </li>
                    </ul>

                    <Button 
                        variant="solid" 
                        className="w-full py-7 text-lg font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
                        onClick={() => handleBuy(plan)}
                    >
                        Purchase License
                    </Button>
                </div>
                ))}
            </div>

            <div className="bg-primary/5 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-primary/10 mt-10 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <Package className="w-32 h-32" />
                </div>
                <h4 className="font-black text-lg mb-2 relative z-10">Custom Enterprise Solutions?</h4>
                <p className="text-sm text-muted-foreground relative z-10 leading-relaxed italic">
                    If your business requires a high-volume license or a custom white-label agreement, our team is ready to assist you personally.
                </p>
                <div className="mt-6">
                    <button className="text-sm font-black text-primary hover:underline">Contact Sales Support →</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
