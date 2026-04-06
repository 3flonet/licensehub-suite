// src/components/MidtransPayment.jsx
import { useEffect } from 'react'
import useStore from '../store/useStore'

const MidtransPayment = ({ token, onSuccess, onPending, onError, onClose }) => {
  const { siteSettings } = useStore()
  
  useEffect(() => {
    // Wait for site settings to be loaded
    if (!siteSettings || !siteSettings.midtrans) return

    const MIDTRANS_CLIENT_KEY = siteSettings.midtrans.client_key
    const isProd = siteSettings.midtrans.is_production

    // Load Midtrans Snap script
    if (!window.snap) {
      const script = document.createElement('script')
      script.src = isProd 
        ? 'https://app.midtrans.com/snap/snap.js'
        : 'https://app.sandbox.midtrans.com/snap/snap.js'
      
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY)
      script.async = true
      document.body.appendChild(script)
      script.onload = () => {
        if (window.snap && token) {
          window.snap.pay(token, {
            onSuccess,
            onPending,
            onError,
            onClose,
          })
        }
      }
    } else if (token) {
      // If snap is already loaded but from a different environment, 
      // we might need to RELOAD it. But usually, switching modes 
      // involves a settings save which causes a fresh state in the next checkout.
      window.snap.pay(token, {
        onSuccess,
        onPending,
        onError,
        onClose,
      })
    }
  }, [token, siteSettings, onSuccess, onPending, onError, onClose])

  return null // No UI, Snap popup will show
}

export default MidtransPayment
