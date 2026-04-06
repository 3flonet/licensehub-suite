import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Box,
  Layers,
  Search
} from 'lucide-react'
import apiClient from '@config/api'
import Button from '@components/Button'
import ProductEdit from './Edit'
import ProductCreate from './Create'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/admin/products')
      setProducts(res.data)
    } catch (err) {
      console.error('Failed to fetch products', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await apiClient.delete(`/admin/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading && products.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Listing Inventory...</p>
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
            <Package className="w-4 h-4" /> Inventory
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
            Product <span className="text-primary">Catalog</span>
          </h1>
          <p className="text-muted-foreground font-medium">Create and manage your digital software licenses.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto"
        >
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> New Product
          </button>
        </motion.div>
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="p-6 md:p-8 border-b border-border/50 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-left">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Software Repository</h2>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center max-w-sm mx-auto px-6">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Box className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">Manifest Empty</h3>
            <p className="text-muted-foreground text-sm">No products matched your search or the catalog is empty.</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Product Asset</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Version Control</th>
                    <th className="px-8 py-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-8 py-4 text-right font-black text-[10px] uppercase tracking-widest text-muted-foreground">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-primary/[0.02] transition-colors text-left">
                      <td className="px-8 py-6">
                        <div className="font-bold text-base tracking-tight group-hover:text-primary transition-colors">{product.name}</div>
                        <div className="text-[10px] font-black uppercase text-muted-foreground/60">Registered System Asset</div>
                      </td>
                      <td className="px-8 py-6">
                        <code className="bg-muted/50 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-border/50">
                          v{product.version}
                        </code>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          product.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {product.is_active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {product.is_active ? 'Active' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingId(product.id)}
                            className="p-2.5 bg-muted/50 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2.5 bg-muted/50 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-muted/30 border border-border/50 rounded-2xl overflow-hidden p-5 space-y-4 shadow-sm">
                  <div className="flex items-start justify-between text-left">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Box className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-black text-sm leading-tight mb-0.5">{product.name}</div>
                        <code className="text-[10px] font-bold text-muted-foreground">v{product.version}</code>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.is_active ? 'Active' : 'Offline'}
                    </span>
                  </div>

                  <div className="flex items-center justify-stretch gap-3 pt-4 border-t border-border/30">
                    <button 
                      onClick={() => setEditingId(product.id)}
                      className="flex-1 bg-muted/50 border border-border/50 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Modals/Overlays */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
                <ProductCreate onSuccess={() => { setShowCreate(false); fetchProducts(); }} onCancel={() => setShowCreate(false)} />
              </div>
            </motion.div>
          </div>
        )}

        {editingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingId(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
                <ProductEdit productId={editingId} onSuccess={() => { setEditingId(null); fetchProducts(); }} onCancel={() => setEditingId(null)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductList
