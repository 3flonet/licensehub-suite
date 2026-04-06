import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  Server, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react'
import useStore from '@store/useStore'

const PolicySection = ({ icon: Icon, title, id, children, delay = 0 }) => (
  <motion.section
    id={id}
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

const IndoSummary = ({ children }) => (
  <div className="mt-6 p-4 rounded-2xl bg-primary/5 border-l-4 border-primary italic text-sm text-foreground/80">
    <strong className="block mb-1 not-italic text-primary">Ringkasan Bahasa Indonesia:</strong>
    {children}
  </div>
)

const Privacy = () => {
  const { siteSettings } = useStore()
  const siteName = siteSettings?.site_name || 'LicenseHub'

  return (
    <div className="relative pb-24 overflow-hidden pt-20">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 -z-10 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-1/2 left-0 -z-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -translate-x-1/3" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest mb-8 border border-primary/20"
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Your data, <span className="text-primary italic">secured</span>.
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Privacy is not an option; it's a fundamental right. Learn how {siteName} protects your professional information in accordance with Indonesian PDP Law.
          </motion.p>
        </div>

        {/* Content sections */}
        <div className="space-y-2">
          <PolicySection icon={Eye} title="1. Information We Collect" delay={0.3}>
            <p>
              We collect several types of information purely for the purpose of license verification and security:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Account Information:</strong> Name, professional email address, and WhatsApp number.</li>
              <li><strong>License & Domain Data:</strong> We record the URL/domain where our software is activated to prevent unauthorized use.</li>
              <li><strong>Payment Information:</strong> Financial data is processed securely via <strong>Midtrans</strong>. We do not store your credit card or full bank details on our servers.</li>
            </ul>
            <IndoSummary>
              Kami mengumpulkan data akun (nama, email, WA), domain tempat lisensi aktif, serta data pembayaran yang diproses secara aman melalui Midtrans tanpa menyimpan detail kartu Anda.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={Database} title="2. Purpose of Data Processing" delay={0.4}>
            <p>
              Your data is processed based on the following professional requirements:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>To provide and maintain the stability of your license system.</li>
              <li>To send automated notifications (license expiry, activation alerts) via **Fonnte**.</li>
              <li>To prevent fraud, piracy, and unauthorized distribution of our software products.</li>
              <li>To comply with legal obligations under Indonesian ITE and PDP laws.</li>
            </ul>
            <IndoSummary>
              Data Anda digunakan untuk memelihara sistem lisensi, mengirimkan notifikasi WA otomatis, mencegah pembajakan, serta mematuhi hukum ITE dan PDP di Indonesia.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={Lock} title="3. Data Security & Encryption" delay={0.5}>
            <p>
              We prioritize your security. All sensitive data, including secret keys and license identifiers, are stored using advanced AES-256 encryption.
            </p>
            <p>
              Communication between your application and our license server is strictly protected via SSL/TLS protocols to ensure that no third party can intercept or manipulate your activation requests.
            </p>
            <IndoSummary>
              Kami menggunakan enkripsi tingkat tinggi (AES-256) untuk menyimpan kunci rahasia dan semua komunikasi server dilindungi oleh SSL/TLS yang aman.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={UserCheck} title="4. Your Rights (Law No. 27/2022)" delay={0.6}>
            <p>
              In accordance with the <strong>Indonesian Personal Data Protection Law (UU PDP)</strong>, you have the right to:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request the correction or deletion (erasure) of your personal data.</li>
              <li>Withdraw consent for data processing where applicable.</li>
              <li>Object to the processing of your data for specific marketing purposes.</li>
            </ul>
            <IndoSummary>
              Sesuai UU Pelindungan Data Pribadi (UU PDP No. 27/2022), Anda berhak mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda dari sistem kami.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={Server} title="5. Data Retention" delay={0.7}>
            <p>
              We retain your information as long as your account is active or as needed to provide you with the services. Activation history for domain tracking is kept for auditing purposes even after a license expires, ensuring a history of compliance for both parties.
            </p>
            <IndoSummary>
              Kami menyimpan data Anda selama akun aktif. Riwayat aktivasi domain tetap disimpan untuk keperluan audit meskipun lisensi sudah habis masa berlakunya.
            </IndoSummary>
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
              <h3 className="text-2xl font-bold mb-4">Questions about your privacy?</h3>
              <p className="text-muted-foreground mb-8">
                If you have concerns about how your data is handled, our dedicated privacy team is ready to assist you.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 group"
              >
                Contact Data Officer
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
