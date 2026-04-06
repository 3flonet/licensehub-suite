// src/pages/OrderConfirmation.jsx
import { useParams, Link } from 'react-router-dom'
import Button from '../components/Button'

const OrderConfirmation = () => {
  const { orderId } = useParams()

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
      <p className="mb-4">Thank you for your purchase!</p>
      <p className="mb-6">Your order ID is <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderId}</span></p>
      <Link to="/portal/dashboard">
        <Button variant="solid" size="md">Go to Portal</Button>
      </Link>
      <Link to="/products" className="ml-4">
        <Button variant="outline" size="md">Back to Storefront</Button>
      </Link>
    </div>
  )
}

export default OrderConfirmation
