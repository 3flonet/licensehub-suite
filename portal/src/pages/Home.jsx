import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@components/Button'
import { ROUTES } from '@utils/constants'
import { CheckCircle, Zap, Lock, BarChart3, Package, ArrowRight, Eye, Sparkles } from 'lucide-react'
import { getProducts } from '@services/productService'

export const HomePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data.slice(0, 3)))
      .catch(err => console.error('Failed to fetch products', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/20 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 border border-primary/20 animate-bounce">
            <Sparkles className="w-4 h-4" /> Trusted by 5,000+ Developers
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
            Professional License <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Management Made Simple</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Manage, distribute, and monitor software licenses with ease.
            Our platform provides everything you need to protect and scale your digital products.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to={ROUTES.PRODUCTS}>
              <Button size="xl" className="px-10 py-8 text-lg rounded-2xl shadow-xl shadow-primary/20">View Digital Products</Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="xl" className="px-10 py-8 text-lg rounded-2xl">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Premium Digital Products</h2>
                <p className="text-lg text-muted-foreground italic">Empower your business with our top-rated software solutions, tested for performance and security.</p>
            </div>
            <Link to={ROUTES.PRODUCTS} className="hidden md:flex items-center gap-2 text-primary font-bold group">
                Browse All Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-80 bg-muted animate-pulse rounded-[2.5rem]" />
                ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card p-8 rounded-[2.5rem] border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-8">
                    {product.logo ? (
                        <div className="w-20 h-20 bg-card rounded-2xl shadow-inner border border-border p-3 flex items-center justify-center overflow-hidden transition group-hover:scale-110 duration-500">
                            <img src={`${backendUrl}/storage/${product.logo}`} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition duration-500">
                            <Package className="w-10 h-10 text-primary" />
                        </div>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-muted rounded-full text-muted-foreground">v{product.version}</span>
                  </div>

                  <h3 className="text-2xl font-black mb-4 group-hover:text-primary transition">{product.name}</h3>
                  <p className="text-muted-foreground mb-8 line-clamp-3 text-sm leading-relaxed flex-grow">
                     {product.short_description || "High-performance software solution designed to streamline your business workflow and maximize efficiency."}
                  </p>

                  <div className="pt-6 border-t border-border mt-auto">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full group/btn hover:bg-primary hover:text-white rounded-xl py-6 font-bold flex items-center justify-center gap-2"
                        onClick={() => navigate(`/products/${product.slug}`)}
                    >
                        <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to={ROUTES.PRODUCTS}>
                <Button variant="outline" className="w-full rounded-2xl py-6 font-bold flex items-center justify-center gap-2">
                    Browse All Products <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black mb-6 tracking-tight">Why Choose 3FloLicenseHub?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">We provide a robust infrastructure designed for serious software vendors who value security, speed, and reliability above all else.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: 'Secure Shield',
                description: 'Advanced RSA-2048 encryption protocols to ensure your licenses remain tamper-proof.',
                color: 'text-primary'
              },
              {
                icon: Zap,
                title: 'Instant Delivery',
                description: 'Automated fulfillment system delivers license keys to customers in under 5 seconds.',
                color: 'text-amber-500'
              },
              {
                icon: CheckCircle,
                title: 'Enterprise Uptime',
                description: 'Leveraging globally distributed servers to guarantee 99.99% availability for your business.',
                color: 'text-green-500'
              },
              {
                icon: BarChart3,
                title: 'Global Analytics',
                description: 'Gain deep insights into your sales patterns and geographic reach with real-time data.',
                color: 'text-blue-500'
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-8 rounded-[2.5rem] bg-card border border-border hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-16 text-center">
            <Link to={ROUTES.FEATURES}>
              <Button variant="outline" className="rounded-2xl px-10 py-7 font-bold flex items-center gap-2 mx-auto hover:bg-primary hover:text-white transition-all duration-300 group">
                Lihat Daftar Fitur Lengkap
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden shadow-2xl shadow-primary/40">
           {/* CTA Background blobs */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -ml-20 -mb-20" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tighter">Ready to protect your revenue?</h2>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed italic">
              Join thousands of digital entrepreneurs who have simplified their licensing process with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to={ROUTES.PRODUCTS}>
                    <Button variant="outline" className="bg-white text-primary hover:bg-white/90 px-12 py-8 text-lg font-black border-none rounded-2xl">
                        Browse Digital Products
                    </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                    <Button variant="ghost" className="text-white hover:bg-white/10 px-12 py-8 text-lg font-bold rounded-2xl">
                        Create Account Free
                    </Button>
                </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
