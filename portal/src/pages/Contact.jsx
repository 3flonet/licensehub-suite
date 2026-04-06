import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Phone, 
  Clock, 
  ArrowRight,
  Loader2
} from 'lucide-react'
import useStore from '@store/useStore'
import apiClient from '@config/api'

const ContactCard = ({ icon: Icon, title, description, action, link, color }) => {
  const colors = {
    primary: {
      bg: 'bg-primary/10',
      hoverBg: 'group-hover:bg-primary/20',
      text: 'text-primary'
    },
    green: {
      bg: 'bg-green-500/10',
      hoverBg: 'group-hover:bg-green-500/20',
      text: 'text-green-500'
    },
    sky: {
      bg: 'bg-sky-500/10',
      hoverBg: 'group-hover:bg-sky-500/20',
      text: 'text-sky-500'
    }
  }

  const activeColor = colors[color] || colors.primary

  return (
    <motion.a
      href={link}
      target={link.startsWith('http') ? '_blank' : undefined}
      rel={link.startsWith('http') ? 'noreferrer' : undefined}
      whileHover={{ y: -8 }}
      className="p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-start gap-6 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden h-full shadow-sm hover:shadow-xl"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeColor.bg} group-hover:scale-110 shadow-inner group-hover:rotate-6`}>
        <Icon className={`w-7 h-7 ${activeColor.text}`} />
      </div>
      
      <div className="space-y-2 relative z-10">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
        {action}
        <ArrowRight className="w-4 h-4" />
      </div>

      {/* Background Decorative Gradient */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${activeColor.bg.replace('/10', '/5')} rounded-full blur-2xl ${activeColor.hoverBg.replace('/20', '/10')} transition-colors`} />
    </motion.a>
  )
}

const Contact = () => {
  const { siteSettings } = useStore()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await apiClient.post('/support/contact', formData)
      setSubmitted(true)
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' })
      // Reset success state after 10 seconds
      setTimeout(() => setSubmitted(false), 10000)
    } catch (err) {
      console.error('Failed to send message', err)
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="relative pb-24 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
          >
            <MessageCircle className="w-4 h-4" />
            Direct Support channel
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">Let's build <span className="text-primary italic">something</span> great.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Have questions about our enterprise plans or need technical help? 
            Our expert team is ready to scale your software security.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          <ContactCard 
            icon={Mail}
            title="Email Support"
            description="Our typical response time is under 12 hours for all technical inquiries."
            action="Email Us"
            link={`mailto:${siteSettings?.support_email || 'support@licensehub.id'}`}
            color="primary"
          />
          <ContactCard 
            icon={MessageCircle}
            title="Support WhatsApp"
            description="Chat directly with our team for quick help and product inquiries."
            action="Chat Now"
            link={`https://wa.me/${siteSettings?.support_whatsapp || '628123456789'}`}
            color="green"
          />
          <ContactCard 
            icon={Send}
            title="Telegram Group"
            description="Join our global community to discuss features and get peer support."
            action="Join Group"
            link={siteSettings?.telegram_group || '#'}
            color="sky"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl font-black mb-6">Send us a message</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fill out the form and we'll get back to you across the interwebs. 
                Whether you're looking for a partnership or just want to say hi, 
                we're only a message away.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Our Location</h4>
                  <p className="text-muted-foreground">{siteSettings?.company_address || 'Digital Park No. 22B, Sudirman Central Business District, Indonesia.'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Phone Inquiry</h4>
                  <p className="text-muted-foreground">+{siteSettings?.support_whatsapp || '628123456789'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[3rem] bg-card border border-border shadow-2xl shadow-primary/5 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Message Sent!</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Thank you for reaching out. A human will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-black uppercase tracking-widest hover:underline"
                  >
                    Send another?
                  </button>
                </motion.div>
              ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        {error}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text" 
                        placeholder="John Doe"
                        className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</label>
                      <input 
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email" 
                        placeholder="john@company.com"
                        className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                    <input 
                      required
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Pricing Inquiry / Technical Support"
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                    <textarea 
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your needs..."
                      className="w-full px-6 py-4 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full py-5 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-2xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Launch Message
                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
            
            {/* Background decorative ring */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact
