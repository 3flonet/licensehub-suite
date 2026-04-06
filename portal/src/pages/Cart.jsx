// src/pages/Cart.jsx
import useCartStore from '@store/cartStore'
import Button from '@components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@utils/constants'
import { ShieldCheck } from 'lucide-react'

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const navigate = useNavigate()
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')

  const handleCheckout = () => {
    navigate(ROUTES.CHECKOUT)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">
          <Button variant="outline" size="md">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      <ul className="divide-y">
        {items.map(item => (
          <li key={item.id} className="py-4 flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              {item.logo ? (
                <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                  <img src={`${backendUrl}/storage/${item.logo}`} alt={item.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-primary opacity-40" />
                </div>
              )}
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">Plan: {item.plan_name} (v{item.version})</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateQuantity(item.id, Number(e.target.value))}
                className="w-16 border rounded px-2"
              />
              <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
        <Button variant="solid" onClick={handleCheckout}>Checkout</Button>
      </div>
    </div>
  )
}

export default Cart
