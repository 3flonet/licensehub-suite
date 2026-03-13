import { Shield, Zap, Globe, BarChart3, Bell, Smartphone, Headphones, Lock, RefreshCcw, Layout } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '@store/useStore'

const features = [
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: 'Secure License Keys',
    description: 'Military-grade encryption for all license keys ensuring your software remains protected against piracy.'
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'Instant Activation',
    description: 'Seamless API integration allows for lightning-quick activation and verification across any platform.'
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: 'Domain Management',
    description: 'Easily manage and track which domains are using your software with built-in activation limits.'
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: 'Detailed Analytics',
    description: 'Get insights into license usage, activation trends, and customer behavior with comprehensive reports.'
  },
  {
    icon: <Bell className="w-8 h-8 text-primary" />,
    title: 'WhatsApp Notifications',
    description: 'Keep your customers informed with automated order and payment notifications via WhatsApp.'
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: 'PWA Support',
    description: 'Access your license portal from any device with our fully responsive Progressive Web App.'
  },
  {
    icon: <Headphones className="w-8 h-8 text-primary" />,
    title: 'Priority Support',
    description: 'Dedicated support channels to help you and your customers with any licensing or technical issues.'
  },
  {
    icon: <Lock className="w-8 h-8 text-primary" />,
    title: 'Fraud Prevention',
    description: 'Advanced algorithms to detect and prevent license sharing and unauthorized distribution.'
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-primary" />,
    title: 'Auto-Renewal System',
    description: 'Simplify subscription management with automated recurring billing and license renewals.'
  }
]

export const Features = () => {
  const { siteSettings } = useStore()
  const siteName = siteSettings?.site_name || '3Flo LicenseHub'

  return (
    <div className="py-20 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-extrabold mb-6"
          >
            Powerful Features for <span className="text-primary">Modern Software</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            {siteName} provides everything you need to manage, distribute, and protect your digital products effectively.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-32 p-12 rounded-3xl bg-primary text-primary-foreground text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to scale your software?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of developers who trust our platform to protect their intellectual property.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/products" 
              className="px-8 py-4 bg-white text-primary rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Explore Pricing
            </a>
            <a 
              href="/register" 
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition"
            >
              Get Started for Free
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Features
