import { motion } from 'framer-motion'
import { Hammer, ArrowLeft, Mail, MessageCircle } from 'lucide-react'
import useStore from '@store/useStore'
import Button from '@components/Button'

const Maintenance = () => {
  const { siteSettings } = useStore()
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
          className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Hammer className="w-16 h-16 text-primary" />
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black mb-6"
        >
          Under <span className="text-primary">Maintenance</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 leading-relaxed"
        >
          {siteSettings?.maintenance_message || "We're currently performing some scheduled maintenance to improve our services. We'll be back online shortly!"}
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a href="/">
            <Button variant="outline" size="lg" className="rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Try Reloading
            </Button>
          </a>
          
          <a href={`https://wa.me/${siteSettings?.support_whatsapp}`} target="_blank" rel="noreferrer">
            <Button size="lg" className="rounded-2xl bg-green-500 hover:bg-green-600 border-none">
              <MessageCircle className="w-4 h-4 mr-2" /> Contact Support
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          {siteSettings?.support_email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{siteSettings.support_email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">© {new Date().getFullYear()} {siteSettings?.company_name || 'LicenseHub'}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Maintenance
