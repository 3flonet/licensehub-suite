import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '@services/productService'
import Button from '@components/Button'
import useCartStore from '@store/cartStore'
import { ROUTES } from '@utils/constants'
import { Shield, Zap, Globe, Package, Eye } from 'lucide-react'

const Storefront = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCartStore()
  const navigate = useNavigate()
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => setError('Gagal memuat produk. Silakan coba lagi nanti.'))
      .finally(() => setLoading(false))
  }, [])

  const handleBuy = (product, plan) => {
    const cartItem = {
      id: plan.id, // Using plan ID as unique identifier in cart
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

  if (loading) return <div className="p-20 text-center text-muted-foreground animate-pulse">Loading amazing products...</div>
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold mb-4">Software Solutions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect licensing plan for your needs. Professional tools for professional results.
        </p>
      </div>

      <div className="space-y-24">
        {products.map(product => (
          <div key={product.id} className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Product Info */}
            <div className="lg:col-span-1 space-y-6">
              {product.logo ? (
                <div className="w-24 h-24 bg-card rounded-2xl shadow-sm border border-border p-2 flex items-center justify-center overflow-hidden">
                   <img src={`${backendUrl}/storage/${product.logo}`} alt={product.name} className="w-full h-full object-contain rounded-xl" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Package className="w-10 h-10 text-primary" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold mb-3">{product.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <span className="bg-muted px-3 py-1 rounded-full">v{product.version}</span>
                {product.documentation_url && (
                  <a href={product.documentation_url} target="_blank" rel="noreferrer" className="text-primary hover:underline cursor-pointer">
                    Documentation →
                  </a>
                )}
                {product.preview_url && (
                  <a href={product.preview_url} target="_blank" rel="noreferrer" className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Live Preview
                  </a>
                )}
              </div>
            </div>

            {/* Plans List */}
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {product.license_plans?.map(plan => (
                <div key={plan.id} className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition duration-300">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{plan.billing_model.replace('_', ' ')}</p>
                  </div>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-black">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(plan.price)}</span>
                    <span className="text-muted-foreground text-sm ml-2">
                        {plan.billing_model === 'monthly' ? '/mo' : plan.billing_model === 'annual' ? '/yr' : ''}
                    </span>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-3 text-sm">
                        <Globe className="w-4 h-4 text-primary" />
                        {plan.max_domains === 0 ? 'Unlimited' : plan.max_domains} Domain Activations
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                        <Shield className="w-4 h-4 text-primary" />
                        Full Security Updates
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                        <Zap className="w-4 h-4 text-primary" />
                        Instant Key Delivery
                    </li>
                  </ul>

                  <Button 
                    variant="solid" 
                    className="w-full py-6 font-bold"
                    onClick={() => handleBuy(product, plan)}
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Storefront
