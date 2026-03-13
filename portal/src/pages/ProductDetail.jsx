// src/pages/ProductDetail.jsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProduct } from '../services/productService'
import Button from '../components/Button'
import useCartStore from '../store/cartStore'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCartStore()

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Loading product...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found.</div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="mb-2 text-gray-600">{product.description}</p>
      <div className="mb-2">Version: {product.version}</div>
      {/* Add more product details as needed */}
      <Button variant="solid" size="md" onClick={() => addToCart(product)}>
        Add to Cart
      </Button>
    </div>
  )
}

export default ProductDetail
