import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Cookie as CookieIcon, 
  Info, 
  Settings, 
  Clock, 
  FileText,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react'

const PolicySection = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="p-8 md:p-10 rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/20 transition-all duration-500 relative overflow-hidden group mb-10"
  >
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black">{title}</h2>
    </div>
    <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
      {children}
    </div>
    
    {/* Decorative blur */}
    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />
  </motion.section>
)

const CookieCategory = ({ title, description, items, essential = false }) => (
  <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold">{title}</h3>
      {essential && (
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
          Essential
        </span>
      )}
    </div>
    <p className="text-muted-foreground mb-6 mb-4">{description}</p>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

const Cookies = () => {
  return (
    <div className="relative pb-24 overflow-hidden pt-20">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 -z-10 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest mb-8 border border-primary/20"
          >
            <CookieIcon className="w-4 h-4" />
            Cookie Policy
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Respecting your <span className="text-primary italic">privacy</span>.
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            At LicenseHub, transparency is at our core. Learn how we use cookies to provide a seamless, secure, and professional experience.
          </motion.p>
        </div>

        {/* Content sections */}
        <div className="space-y-2">
          <PolicySection icon={Info} title="What are Cookies?" delay={0.3}>
            <p>
              Cookies are small text files stored on your device when you visit most websites. They help the website remember your preferences, provide security features, and analyze how users interact with the site to improve the service.
            </p>
            <p>
              Think of them as "digital signatures" that let us know you're you, so you don't have to keep logging in or resetting your preferences every time you switch pages.
            </p>
          </PolicySection>

          <PolicySection icon={Settings} title="How we use them" delay={0.4}>
            <p>
              We use cookies to enhance your journey through LicenseHub. This includes:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <CookieCategory 
                title="Strictly Necessary"
                description="Essential for the website to function. Without these, you wouldn't be able to log in or make purchases."
                essential
                items={['Authentication status', 'Security / CSRF protection', 'Cart persistence', 'Session identifiers']}
              />
              <CookieCategory 
                title="Performance"
                description="Help us understand how visitors use the site so we can make it faster and easier to navigate."
                items={['Page load monitoring', 'Navigation flow analysis', 'Error reporting', 'Traffic origins']}
              />
              <CookieCategory 
                title="Functional"
                description="Remember your settings like theme choice, language, or currency preference."
                items={['Dark mode setting', 'Language preference', 'Recently viewed products', 'Dismissed notices']}
              />
              <CookieCategory 
                title="Targeting / Marketing"
                description="Used to deliver relevant ads and track the effectiveness of our marketing campaigns."
                items={['Ad tracking pixels', 'Campaign attribution', 'Retargeting tokens', 'Social sharing analytics']}
              />
            </div>
          </PolicySection>

          <PolicySection icon={ShieldCheck} title="Managing Cookies" delay={0.5}>
            <p>
              You're in control. Most browsers allow you to manage cookie preferences through their settings. You can choose to block all cookies, accept only some, or clear your history periodically.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {['Google Chrome', 'Mozilla Firefox', 'Safari (iOS/macOS)', 'Microsoft Edge'].map(browser => (
                <div key={browser} className="px-6 py-3 rounded-2xl bg-muted/50 border border-border/50 text-sm font-bold flex items-center gap-2 hover:border-primary/20 transition-all cursor-default">
                  <ExternalLink className="w-4 h-4 text-primary" />
                  {browser}
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4">
              <Lock className="w-6 h-6 text-primary shrink-0 mt-1" />
              <p className="text-sm italic">
                Note: Disabling strictly necessary cookies may prevent us from providing a secure checkout experience or maintaining your login session.
              </p>
            </div>
          </PolicySection>

          <PolicySection icon={Clock} title="Policy Updates" delay={0.6}>
            <p>
              We may update this policy occasionally to reflect changes in our practices or for legal, regulatory, or operational reasons. Please revisit this page regularly to stay informed about our use of cookies.
            </p>
            <div className="flex items-center gap-2 pt-6 text-sm">
              <span className="font-black uppercase tracking-widest text-primary/50">Last Updated:</span>
              <span className="font-bold">March 12, 2026</span>
            </div>
          </PolicySection>

          {/* Bottom Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center space-y-8"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-8">
                If you have any questions about our use of cookies or other technologies, please contact our privacy team.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 group"
              >
                Contact Privacy Team
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cookies
