import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search, MessageCircle, HelpCircle, Mail, Loader2 } from 'lucide-react'
import useStore from '@store/useStore'
import { getFaqs } from '@services/productService'

const STATIC_FAQ = [
  {
    category: 'General',
    questions: [
      {
        id: 'g1',
        question: 'What is LicenseHub?',
        answer: 'LicenseHub is a professional software license management platform. It allows developers to sell, manage, and verify software licenses with ease, including domain-locked activations and subscription management.'
      },
      {
        id: 'g2',
        question: 'Do I need an active internet connection to use the software?',
        answer: 'For initial activation, an internet connection is required. After that, your software can function offline, but it will need to "ping" our server periodically (heartbeat) to verify the license status based on your plan settings.'
      }
    ]
  },
  {
    category: 'Licensing',
    questions: [
      {
        id: 'l1',
        question: 'How do domain limits work?',
        answer: 'Each license plan has a specific domain limit. For example, a "Single Domain" license can only be active on one host at a time. If you need to move the license, you can deactivate the old domain via your customer portal.'
      },
      {
        id: 'l2',
        question: 'Can I use one license for multiple subdomains?',
        answer: 'By default, subdomains like <code>dev.brand.com</code> and <code>app.brand.com</code> are treated as separate hostnames. However, we offer "Wildcard" plans for enterprise users who need unlimited subdomain activations.'
      }
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        id: 't1',
        question: 'What languages are supported?',
        answer: 'LicenseHub provides a universal REST API, meaning it can be integrated with <strong>PHP, Java, C++, Python, Node.js</strong>, and any other language that supports HTTP requests.'
      },
      {
        id: 't2',
        question: 'Is my data secure during activation?',
        answer: 'Absolutely. All communication is encrypted via SSL/TLS. Additionally, sensitive requests require a <code>X-Product-Secret</code> header that is unique to your application binary.'
      }
    ]
  },
  {
    category: 'Payments',
    questions: [
      {
        id: 'p1',
        question: 'What payment methods do you accept?',
        answer: 'We support various payment methods in Indonesia through Midtrans, including <strong>Gopay, OVO, ShopeePay, Virtual Accounts (BCA, Mandiri, BNI)</strong>, and Credit Cards.'
      },
      {
        id: 'p2',
        question: 'Can I get a refund if I change my mind?',
        answer: 'Due to the digital nature of software licenses, we generally do not offer refunds once a license key has been issued. We recommend trying our "Free Tier" or "Demo" before making a purchase.'
      }
    ]
  }
]

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className={`border border-border rounded-2xl mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'bg-muted/30 shadow-md ring-1 ring-primary/20' : 'bg-card hover:border-primary/30'}`}>
    <button
      onClick={onClick}
      className="w-full text-left p-6 flex justify-between items-center gap-4"
    >
      <span className="font-bold text-lg">{question}</span>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-muted'}`}>
        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div 
            className="px-6 pb-6 text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const FAQ = () => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { siteSettings } = useStore()

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const data = await getFaqs()
      if (data && data.length > 0) {
        // Group by category
        const groups = data.reduce((acc, current) => {
          const category = current.category || 'General'
          if (!acc[category]) acc[category] = []
          acc[category].push({
            id: current.id,
            question: current.question,
            answer: current.answer
          })
          return acc
        }, {})

        const formatted = Object.keys(groups).map(key => ({
          category: key,
          questions: groups[key]
        }))
        setFaqs(formatted)
        if (formatted[0]?.questions[0]?.id) {
          setOpenId(formatted[0].questions[0].id)
        }
      } else {
        setFaqs(STATIC_FAQ)
        setOpenId('g1')
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error)
      setFaqs(STATIC_FAQ)
      setOpenId('g1')
    } finally {
      setLoading(false)
    }
  }

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Support Center
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-6">Frequently Asked <span className="text-primary">Questions</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find quick answers to common questions about our license management platform.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full pl-16 pr-6 py-5 bg-card border border-border rounded-3xl text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-12 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p>Fetching the latest answers...</p>
            </div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 ml-2">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openId === faq.id}
                      onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border text-muted-foreground">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No matches found for "{searchQuery}"</p>
              <button onClick={() => setSearchQuery('')} className="text-primary font-bold mt-2 hover:underline select-none cursor-pointer">
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-24 p-8 md:p-12 bg-primary rounded-[2.5rem] text-white overflow-hidden relative"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
              <p className="text-white/80 text-lg max-w-md">
                Can't find the answer you're looking for? Please chat with our friendly team.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href={`https://wa.me/${siteSettings?.support_whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-primary px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-white/90 transition shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
              <a 
                href={`mailto:${siteSettings?.support_email}`}
                className="bg-primary-foreground/10 text-white px-8 py-4 rounded-2xl font-black border border-white/20 flex items-center gap-3 hover:bg-white/10 transition"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </div>
  )
}

export default FAQ
