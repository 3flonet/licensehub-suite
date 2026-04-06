import { motion } from 'framer-motion'
import { 
  FileText, 
  Users, 
  Ban, 
  Gavel, 
  CreditCard, 
  AlertTriangle, 
  Scale,
  ChevronRight,
  Shield
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
  <div className="mt-6 p-4 rounded-2xl bg-secondary/5 border-l-4 border-secondary italic text-sm text-foreground/80">
    <strong className="block mb-1 not-italic text-secondary">Ringkasan Bahasa Indonesia:</strong>
    {children}
  </div>
)

const Terms = () => {
  const { siteSettings } = useStore()
  const siteName = siteSettings?.site_name || 'LicenseHub'

  return (
    <div className="relative pb-24 overflow-hidden pt-20">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 left-0 -z-10 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -translate-x-1/3" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Header content */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-black uppercase tracking-widest mb-8 border border-secondary/20"
          >
            <Users className="w-4 h-4" />
            Terms of Service
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Professional <span className="text-primary italic">agreements</span>.
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Read our terms carefully to ensure a secure and fair usage of {siteName} products and services.
          </motion.p>
        </div>

        {/* Content sections */}
        <div className="space-y-2">
          <PolicySection icon={Users} title="1. License Usage & Restrictions" delay={0.3}>
            <p>
              By purchasing a license for our software, you are granted a non-exclusive, non-transferable right to use the software on the number of domains specified in your purchased plan.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Licenses are strictly limited to the number of domain activations purchased.</li>
              <li>Unauthorized distribution of your license key will result in immediate termination without refund.</li>
              <li>Any attempts to automate activation outside of our official API are prohibited.</li>
            </ul>
            <IndoSummary>
              Lisensi yang Anda beli hanya boleh digunakan di jumlah domain sesuai paket. Distribusi kunci lisensi secara ilegal akan berakibat pada pemblokiran akun dan kunci secara permanen tanpa pengembalian dana.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={Ban} title="2. Prohibited Content & Actions" delay={0.4}>
            <p>
              Fair usage is a mutual responsibility. You agree not to engage in the following prohibited activities:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Reverse engineering or deobfuscating the source code for the purpose of cloning our license server logic.</li>
              <li>Using the license for adult, gambling, or other illegally considered content under Indonesian ITE Law.</li>
              <li>Attempting to bypass license verification via "nulling" or unauthorized patch scripts.</li>
            </ul>
            <IndoSummary>
              Dilarang memodifikasi kode lisensi untuk cloning server, dilarang menggunakan software untuk konten ilegal (judi, pornografi), serta dilarang menggunakan script patch bajakan.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={CreditCard} title="3. Payments & Refund Policy" delay={0.5}>
            <p>
              Our products are provided as digital software licenses. Due to the digital nature of our products:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>No Refunds:</strong> Once a license key has been issued and sent to the customer, no refunds or cancellations can be made.</li>
              <li><strong>Payments:</strong> All transactions are processed through verified gateways. Any chargebacks will result in automatic license suspension.</li>
              <li><strong>Currency:</strong> Unless otherwise stated, all pricing is in IDR (Indonesian Rupiah).</li>
            </ul>
            <IndoSummary>
              Karena produk berbentuk aset digital, tidak ada pengembalian dana (refund) setelah kunci lisensi diterbitkan. Pembayaran dilakukan via gateway resmi dan biaya tercantum dalam Rupiah (IDR).
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={AlertTriangle} title="4. Limitation of Liability" delay={0.6}>
            <p>
              {siteName} shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our products. This includes, but is not limited to, server downtime, data loss, or conflicts with other third-party extensions on your server.
            </p>
            <IndoSummary>
              Kami tidak bertanggung jawab atas kerugian tidak langsung seperti server down di pihak Anda, kehilangan data, atau konflik sistem yang disebabkan oleh integrasi software kami di server Anda.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={Gavel} title="5. Governing Law & Jurisdiction" delay={0.7}>
            <p>
              These Terms of Service are governed by the **laws of the Republic of Indonesia (Hukum Republik Indonesia)**.
            </p>
            <p>
              Any disputes arising from these agreements shall be resolved through negotiation in the first instance. If a settlement cannot be reached, the dispute will be submitted to the exclusive jurisdiction of the Courts in our registered company domisili.
            </p>
            <IndoSummary>
              Syarat dan Ketentuan ini diatur oleh hukum Republik Indonesia. Perselisihan akan diselesaikan melalui musyawarah terlebih dahulu sebelum dibawa ke jalur hukum yang berlaku.
            </IndoSummary>
          </PolicySection>

          <PolicySection icon={Shield} title="6. Service Termination" delay={0.8}>
            <p>
              We reserve the right to suspend or terminate your license immediately if you are found in breach of any of these terms. Suspended licenses will not be reactivated unless proof of compliance is provided and verified by our auditing team.
            </p>
            <IndoSummary>
              Kami berhak menghentikan layanan atau mencabut lisensi Anda secara sepihak jika ditemukan pelanggaran terhadap syarat dan ketentuan ini.
            </IndoSummary>
          </PolicySection>

          {/* Bottom call to action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center space-y-8"
          >
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-secondary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Acceptance of Terms</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                By purchasing or using our software, you agree to be bound by these professional agreements.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-secondary-foreground font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-secondary/20 group"
              >
                Inquire about Terms
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Terms
