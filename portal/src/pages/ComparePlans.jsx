import { useEffect, useState } from 'react'
import { getProducts } from '@services/productService'
import { Check, X, Shield, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/Button'
import useCartStore from '@store/cartStore'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@utils/constants'

const ComparisonRow = ({ label, values, highlight = false }) => (
  <tr className={`${highlight ? 'bg-primary/5' : 'bg-transparent'} border-b border-border`}>
    <td className="py-5 px-6 font-medium text-foreground">{label}</td>
    {values.map((val, idx) => (
      <td key={idx} className="py-5 px-6 text-center">
        {val === true ? (
           <Check className="w-5 h-5 text-green-500 mx-auto" />
        ) : val === false ? (
          <X className="w-5 h-5 text-red-400 mx-auto" />
        ) : (
          <span className="text-sm">{val}</span>
        )}
      </td>
    ))}
  </tr>
)

export const ComparePlans = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  const handleBuy = (product, plan) => {
    const cartItem = {
      id: plan.id,
      product_id: product.id,
      name: product.name,
      plan_name: plan.name,
      price: plan.price,
      version: product.version,
      quantity: 1,
      selected_plan_id: plan.id
    }
    addToCart(cartItem)
    navigate(ROUTES.CART)
  }

  if (loading) return <div className="p-20 text-center animate-pulse">Comparing plans...</div>

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            Compare <span className="text-primary">License Plans</span>
          </motion.h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect fit for your workflow. Detailed breakdown of all our license tiers.
          </p>
        </div>

        {products.map(product => {
          // Identify all unique feature names across all plans for this product
          const allFeatureNames = [...new Set(
            product.license_plans?.flatMap(plan => plan.features?.map(f => f.name) || [])
          )];

          return (
            <div key={product.id} className="mb-24 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <div className="p-8 border-b border-border bg-primary/5">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  {product.name}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Comparing available plans for {product.name} v{product.version}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-8 px-6 bg-muted/30 w-1/4">Features</th>
                      {product.license_plans?.map(plan => (
                        <th key={plan.id} className="py-8 px-6 text-center min-w-[200px]">
                          <div className="text-xl font-bold mb-2">{plan.name}</div>
                          <div className="mb-4">
                            <span className="text-3xl font-black">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(plan.price)}
                            </span>
                            <span className="text-xs text-muted-foreground block uppercase mt-1">
                               {plan.billing_model.replace('_', ' ')}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="solid" 
                            className="w-full"
                            onClick={() => handleBuy(product, plan)}
                          >
                            Choose {plan.name}
                          </Button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                     <ComparisonRow 
                      label="Domain Activations" 
                      values={product.license_plans?.map(p => p.max_domains === 0 ? 'Unlimited' : `${p.max_domains} Domain`)} 
                      highlight
                    />
                    
                    {/* Dynamic Features from Admin Panel */}
                    {allFeatureNames.map((featName, fIdx) => (
                      <ComparisonRow 
                        key={fIdx}
                        label={featName}
                        values={product.license_plans?.map(plan => {
                          const feat = plan.features?.find(f => f.name === featName);
                          if (!feat) return false;
                          // If 'value' is provided, show it. If not, fallback to boolean 'is_enabled' icon
                          return feat.value || feat.is_enabled;
                        })}
                      />
                    ))}

                    {/* Default Fallback for New Plans without features defined yet */}
                    {allFeatureNames.length === 0 && (
                      <ComparisonRow 
                        label="Standard Features" 
                        values={product.license_plans?.map(() => true)} 
                      />
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Info Box */}
        <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-border flex gap-4 items-start">
          <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-bold mb-1">Need a custom enterprise plan?</h4>
            <p className="text-sm text-muted-foreground">
              If your requirements exceed our standard plans, we offer custom enterprise solutions with unlimited domains and dedicated infrastructure. 
              <a href="/contact" className="text-primary hover:underline ml-1">Contact our sales team</a> for a tailored quote.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparePlans
