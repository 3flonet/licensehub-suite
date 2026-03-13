// src/pages/Portal/LicenseDelivery.jsx
import { useEffect, useState } from 'react'
import apiClient from '../../config/apiClient'

const LicenseDelivery = () => {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiClient.get('/licenses')
      .then(res => setLicenses(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Mengambil data lisensi...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lisensi Anda</h1>
      {licenses.length === 0 ? (
        <p>Belum ada lisensi yang tersedia.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Produk</th>
              <th className="p-2 border">Kode Lisensi</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Tanggal Aktif</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map(license => (
              <tr key={license.id}>
                <td className="p-2 border">{license.product_name}</td>
                <td className="p-2 border font-mono">{license.key}</td>
                <td className="p-2 border">{license.status}</td>
                <td className="p-2 border">{new Date(license.activated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default LicenseDelivery
