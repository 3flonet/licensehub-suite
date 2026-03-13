import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@utils/constants'

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[999]"
        >
          <div className="bg-card/80 backdrop-blur-2xl border border-primary/20 shadow-2xl p-6 rounded-[2rem] relative overflow-hidden group">
            {/* Background sparkle */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-primary animate-pulse" />
              </div>
              
              <div className="flex-1 space-y-3">
                <h4 className="font-black text-lg">Cookie Notice</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience and secure our platform. By continuing, you agree to our 
                  <Link to={ROUTES.COOKIES} className="text-primary hover:underline font-bold mx-1">
                    Cookie Policy
                  </Link>.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={handleAccept}
                    className="flex-1 py-3 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    Accept All
                  </button>
                  <button 
                    onClick={handleDecline}
                    className="flex-1 py-3 bg-muted border border-border text-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:bg-muted/80 transition-all active:scale-95"
                  >
                    Essential Only
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent
