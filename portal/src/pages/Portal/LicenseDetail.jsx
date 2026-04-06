import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import apiClient from '../../config/apiClient'
import { ChevronLeft, Globe, Shield, Calendar, Trash2, AlertCircle, Download, Package } from 'lucide-react'
import Button from '../../components/Button'

const LicenseDetail = () => {
  const { id } = useParams()
  const [license, setLicense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(null)
  
  const backendUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')

  useEffect(() => {
    fetchLicenseDetail()
  }, [id])

  const fetchLicenseDetail = async () => {
    try {
      const res = await apiClient.get(`/portal/licenses/${id}`)
      setLicense(res.data)
    } catch (err) {
      setError('Gagal mengambil data lisensi')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async (activationId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus aktivasi domain ini?')) return
    
    setIsDeleting(activationId)
    try {
      await apiClient.delete(`/portal/activations/${activationId}`)
      // Refetch
      fetchLicenseDetail()
    } catch (err) {
      alert('Gagal menonaktifkan domain: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsDeleting(null)
    }
  }

  if (loading) return <div className="p-8 text-center">Memuat data lisensi...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>
  if (!license) return <div className="p-8 text-center">Lisensi tidak ditemukan.</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb */}
      <Link to="/portal/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            {license.product?.logo ? (
              <div className="w-16 h-16 mb-4 bg-white border border-border rounded-xl p-2 flex items-center justify-center overflow-hidden shadow-sm">
                <img src={`${backendUrl}/storage/${license.product.logo}`} alt={license.product.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            )}
            <h1 className="text-xl font-bold mb-4">{license.product?.name}</h1>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary opacity-70" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold capitalize">{license.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary opacity-70" />
                <div>
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="text-sm font-semibold">
                    {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'Lifetime Access'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">License Key</p>
            <code className="text-sm break-all font-mono font-bold text-primary">{license.license_key}</code>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Product Secret Key</p>
            <code className="text-sm break-all font-mono font-bold text-primary">{license.product?.api_secret}</code>
          </div>

          {/* Download Action */}
          {license.product?.download_url && (
            <div className="bg-green-500/5 p-6 rounded-lg border border-green-500/20 space-y-4">
               <div>
                 <h3 className="text-sm font-bold text-green-700 flex items-center gap-2">
                   <Download className="w-4 h-4" /> Download Files
                 </h3>
                 <p className="text-xs text-green-600/80 mt-1">Version {license.product.version || '1.0.0'}</p>
               </div>
               <a 
                 href={license.product.download_url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="block"
               >
                 <Button variant="solid" className="w-full bg-green-600 hover:bg-green-700 border-none shadow-lg shadow-green-600/20">
                    Download Now
                 </Button>
               </a>
            </div>
          )}
        </div>

        {/* Right Column: Activations */}
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Globe className="w-5 h-5" /> Managed Domains
              </h2>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                Usage: {license.activations?.length || 0} / {license.plan?.max_domains || '∞'}
              </span>
            </div>

            {license.activations && license.activations.length > 0 ? (
              <div className="divide-y divide-border">
                {license.activations.map(act => (
                  <div key={act.id} className="p-6 flex justify-between items-center hover:bg-muted/30 transition">
                    <div>
                      <p className="font-bold text-lg">{act.domain}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>IP: {act.ip_address}</span>
                        <span>Last Ping: {act.last_ping_at ? new Date(act.last_ping_at).toLocaleString() : 'Never'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeactivate(act.id)}
                      disabled={isDeleting === act.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Deactivate Domain"
                    >
                      {isDeleting === act.id ? <span className="animate-spin text-xs">...</span> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No domains activated yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Activate this product from within the installer or settings.</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="text-sm font-bold mb-2">How to activate?</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Copy the <b>License Key</b> and <b>Product Secret Key</b> and paste them into the "Activation" or "Installer" section of your <b>{license.product?.name}</b> application. The system will automatically register your domain here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LicenseDetail
