import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, ArrowRight, Package, Loader2 } from 'lucide-react'
import useStore from '@store/useStore'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useStore()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown redirect ke portal dashboard
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (isAuthenticated) {
            navigate('/portal/dashboard', { replace: true })
          } else {
            navigate('/login', { replace: true })
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, isAuthenticated])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-30" />
          <div className="relative w-24 h-24 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Pembayaran Berhasil!</h1>
          <p className="text-muted-foreground text-lg">
            Terima kasih atas pembelian Anda. Lisensi Anda sedang diproses dan akan segera tersedia.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-card border border-border rounded-xl p-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Lisensi Anda Sedang Diproses</p>
              <p className="text-xs text-muted-foreground">
                License key akan dikirim via Email & WhatsApp dalam beberapa menit.
              </p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirect ke Dashboard dalam <strong className="text-primary">{countdown}</strong> detik...</span>
          </div>

          <button
            onClick={() => navigate(isAuthenticated ? '/portal/dashboard' : '/login', { replace: true })}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Ke Dashboard Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
