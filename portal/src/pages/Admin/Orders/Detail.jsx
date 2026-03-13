// src/pages/Admin/Orders/Detail.jsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '@config/apiClient'
import Button from '@components/Button'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get(`/admin/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => setError('Gagal mengambil detail pesanan'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div>Memuat detail pesanan...</div>
  if (error) return <div>Error: {error}</div>
  if (!order) return <div>Pesanan tidak ditemukan.</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Pesanan</h1>
      <div className="mb-2">Order ID: <span className="font-mono">{order.id}</span></div>
      <div className="mb-2">Customer: {order.customer_name} ({order.customer_email})</div>
      <div className="mb-2">Status: {order.status}</div>
      <div className="mb-2">Total: {order.total}</div>
      <h2 className="text-lg font-bold mt-4 mb-2">Items</h2>
      <ul className="list-disc pl-6">
        {order.items.map(item => (
          <li key={item.id}>{item.name} x {item.quantity} - {item.price}</li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Button variant="solid">Mark as Fulfilled</Button>
        <Button variant="destructive">Refund</Button>
      </div>
    </div>
  )
}

export default OrderDetail
