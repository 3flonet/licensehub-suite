// src/components/MidtransPayment.jsx
import { useEffect } from 'react'

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY
const MIDTRANS_ENV = import.meta.env.VITE_MIDTRANS_ENVIRONMENT || 'sandbox'

const MidtransPayment = ({ token, onSuccess, onPending, onError, onClose }) => {
  useEffect(() => {
    // Load Midtrans Snap script
    if (!window.snap) {
      const script = document.createElement('script')
      const isProd = MIDTRANS_ENV === 'production'
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
      window.snap.pay(token, {
        onSuccess,
        onPending,
        onError,
        onClose,
      })
    }
  }, [token, onSuccess, onPending, onError, onClose])

  return null // No UI, Snap popup will show
}

export default MidtransPayment
