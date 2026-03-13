// src/pages/Admin/Products/Create.jsx
import { useState } from 'react'
import apiClient from '@config/apiClient'
import Button from '@components/Button'

const ProductCreate = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    version: '',
    description: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await apiClient.post('/admin/products', form)
      setForm({ name: '', version: '', description: '', is_active: true })
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Tambah Produk</h2>
      <div className="mb-3">
        <label className="block mb-1">Nama Produk</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Versi</label>
        <input name="version" value={form.version} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
      </div>
      <div className="mb-3">
        <label className="block mb-1">Deskripsi</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-3">
        <label className="inline-flex items-center">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          <span className="ml-2">Aktif</span>
        </label>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button variant="solid" size="md" type="submit" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan Produk'}
      </Button>
    </form>
  )
}

export default ProductCreate
