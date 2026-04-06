import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Book, 
  Code, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Zap, 
  ChevronRight, 
  ExternalLink,
  Cpu,
  Globe,
  Lock,
  Settings,
  AlertTriangle,
  Server,
  Activity,
  UserCheck,
  Search
} from 'lucide-react'

const DOCS_NAV = [
  {
    title: 'Getting Started',
    items: [
      { id: 'introduction', label: 'Introduction', icon: Book },
      { id: 'quickstart', label: 'Quick Start Guide', icon: Zap },
      { id: 'workflow', label: 'How it Works', icon: Cpu },
    ]
  },
  {
    title: 'Integration',
    items: [
      { id: 'php-integration', label: 'Native PHP & Laravel', icon: Code },
      { id: 'license-middleware', label: 'License Middleware', icon: Lock },
      { id: 'heartbeat-ping', label: 'Heartbeat & Pinging', icon: Activity },
      { id: 'rest-api', label: 'REST API Reference', icon: Terminal },
    ]
  },
  {
    title: 'Management',
    items: [
      { id: 'domains', label: 'Managing Domains', icon: Globe },
      { id: 'status-lifecycle', label: 'License Statuses', icon: Activity },
      { id: 'security', label: 'Security Best Practices', icon: ShieldCheck },
    ]
  },
  {
    title: 'Support',
    items: [
      { id: 'testing-qa', label: 'Testing & Verification', icon: ShieldCheck },
      { id: 'troubleshooting', label: 'Common Issues', icon: AlertTriangle },
    ]
  }
]

const CodeBlock = ({ code, lang = 'javascript' }) => (
  <div className="relative group mt-4 mb-6">
    <div className="absolute top-2 right-4 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <span className="text-[10px] font-black tracking-widest uppercase text-white/40 bg-white/5 px-2 py-1 rounded inline-block">{lang}</span>
    </div>
    <pre className="bg-slate-950 text-slate-300 p-6 rounded-2xl overflow-x-auto font-mono text-[13px] leading-relaxed border border-white/5 shadow-2xl">
      <code>{code}</code>
    </pre>
  </div>
)

const Docs = () => {
  const [activeSection, setActiveSection] = useState('introduction')

  const allItems = DOCS_NAV.flatMap(group => group.items)
  const currentIndex = allItems.findIndex(item => item.id === activeSection)
  const prevItem = allItems[currentIndex - 1]
  const nextItem = allItems[currentIndex + 1]

  const handlePageChange = (id) => {
    setActiveSection(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Introduction</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              LicenseHub is an enterprise-grade license management system designed to protect your software assets and automate your revenue growth.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all">
                <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                <h3 className="font-bold text-xl mb-3">Domain Locking</h3>
                <p className="text-muted-foreground leading-relaxed">Prevent illegal redistribution by locking license keys to specific domains or IP addresses.</p>
              </div>
              <div className="p-8 rounded-3xl bg-secondary/5 border border-secondary/10 hover:border-secondary/20 transition-all">
                <Activity className="w-10 h-10 text-secondary mb-6" />
                <h3 className="font-bold text-xl mb-3">Real-time Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">Monitor every activation and ping in real-time from your centralized management dashboard.</p>
              </div>
            </div>
          </motion.div>
        )
      case 'quickstart':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <h1 className="text-4xl font-black mb-6">Quick Start Guide</h1>
             <p className="text-xl text-muted-foreground mb-12">Follow this 5-minute guide to launch your first licensed product.</p>
             
             <div className="space-y-16">
               <div className="relative">
                  <div className="absolute -left-12 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic shadow-xl shadow-primary/20 z-10 lg:flex hidden">1</div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic lg:hidden">1</span>
                    Configure your Product
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Head to the <strong>Admin Panel &gt; Products</strong> and click "Create New". You will get a <code>product_slug</code> and an <code>X-Product-Secret</code>. Keep the secret safe; it acts as the primary authentication for your app instances.
                  </p>
                  <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4 border-l-4 border-l-primary">
                    <Settings className="w-5 h-5 text-primary" />
                    <p className="text-sm">Don't forget to upload your product logo for a professional storefront appearance.</p>
                  </div>
               </div>
               
               <div className="relative">
                  <div className="absolute -left-12 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic shadow-xl shadow-primary/20 z-10 lg:flex hidden">2</div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic lg:hidden">2</span>
                    Set up License Plans
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Each product needs plans (e.g., Basic, Pro, Lifetime). Define the <strong>price</strong>, <strong>duration</strong>, and <strong>domain limit</strong>. These plans will automatically appear on your storefront.
                  </p>
               </div>
               
               <div className="relative">
                  <div className="absolute -left-12 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic shadow-xl shadow-primary/20 z-10 lg:flex hidden">3</div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic lg:hidden">3</span>
                    Install the Verification Code
                  </h3>
                  <p className="text-muted-foreground mb-4">Integrate the activation logic during your app's installation. Use our universal endpoint:</p>
                  <CodeBlock code={`// Using cURL or any HTTP library
POST https://licensehub.id/api/v1/licenses/verify
Headers: { "X-Product-Secret": "your_secret_here" }
Body: {
  "license_key": "XXXX-XXXX",
  "domain": "customer-domain.com",
  "product_slug": "your-app"
}`} lang="http" />
               </div>
               
               <div className="relative">
                  <div className="absolute -left-12 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic shadow-xl shadow-primary/20 z-10 lg:flex hidden">4</div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic lg:hidden">4</span>
                    Monitor Activations
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Sit back and watch the activations roll in. Use the **Admin Dashboard** to see where your license keys are being used geographically and check the daily heartbeat signals from your users.
                  </p>
               </div>

               <div className="relative">
                  <div className="absolute -left-12 top-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic shadow-xl shadow-primary/20 z-10 lg:flex hidden">5</div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black italic lg:hidden">5</span>
                    Customer Self-Management
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your customers can log in to their own **Customer Portal** to view their purchase history and manage their active domains. This reduces your support burden significantly.
                  </p>
               </div>
             </div>
          </motion.div>
        )
      case 'workflow':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">How it Works</h1>
            <p className="text-muted-foreground mb-12">Understanding the communication flow between your app, the user, and LicenseHub.</p>
            
            <div className="relative space-y-16 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                   <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="font-black text-primary mb-1">1. Purchase</div>
                  <p className="text-sm text-muted-foreground">User buys a license plan via the LicenseHub storefront. A unique key is generated.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                   <Terminal className="w-4 h-4 text-primary" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="font-black text-primary mb-1">2. Activation</div>
                  <p className="text-sm text-muted-foreground">Your app sends the Key + Domain to LicenseHub. If valid, the domain is paired permanently.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                   <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="font-black text-primary mb-1">3. Heartbeat</div>
                  <p className="text-sm text-muted-foreground">App pings everyday. LicenseHub checks status (expired? revoked?) and sends back instructions.</p>
                </div>
              </div>

            </div>
          </motion.div>
        )
      case 'php-integration':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Native PHP & Laravel Integration</h1>
            <p className="text-muted-foreground mb-8">
              This guide demonstrates how to integrate your products securely using our <strong>Digital Passport</strong> system.
            </p>
            
            <h2 className="text-2xl font-bold mb-4">The LicenseHandler Class</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Copy this class into your project to handle activations and heartbeat pings with built-in signature verification.
            </p>
            
            <CodeBlock code={`<?php
class LicenseHandler {
    private $apiUrl = "https://your-server.com/api/v1"; 
    private $productSlug = "dineflo"; 
    private $apiSecret = "lh_xxxxxxx"; // Get from Admin Panel

    public function activate($licenseKey) {
        $data = [
            'license_key'  => $licenseKey,
            'domain'       => $_SERVER['HTTP_HOST'],
            'product_slug' => $this->productSlug,
        ];
        return $this->callApi('/licenses/verify', $data);
    }

    private function callApi($endpoint, $data) {
        $ch = curl_init($this->apiUrl . $endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $res = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($res, true);
        if ($status === 200 && $this->verifySignature($result)) {
            return $result;
        }
        throw new Exception($result['message'] ?? 'Connection Error');
    }

    private function verifySignature($data) {
        $sig = $data['signature'];
        unset($data['signature']);
        ksort($data);
        return hash_equals(hash_hmac('sha256', json_encode($data), $this->apiSecret), $sig);
    }
}`} lang="php" />

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4 mt-8">
               <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
               <p className="text-sm text-muted-foreground">
                 The <strong>verifySignature</strong> method ensures the response hasn't been faked by local redirects or proxy tools.
               </p>
            </div>
          </motion.div>
        )
      case 'license-middleware':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">License Middleware</h1>
            <p className="text-muted-foreground mb-8">Protect your routes by enforcing the stored license status from your database or environment.</p>
            
            <CodeBlock code={`namespace App\\Http\\Middleware;

class CheckLicense 
{
    public function handle($request, Closure $next)
    {
        $status = config('app.license_status');
        
        if (in_array($status, ['revoked', 'expired', 'suspended'])) {
            auth()->logout();
            return redirect('/login')->with('error', 'Your license is no longer active.');
        }

        return $next($request);
    }
}`} lang="php" />
          </motion.div>
        )
      case 'heartbeat-ping':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Heartbeat & Pinging</h1>
            <p className="text-muted-foreground mb-8">Keep the user's license status fresh by pinging our API periodically.</p>
            
            <h3 className="text-xl font-bold mb-4">Artisan Command</h3>
            <CodeBlock code={`// In your Console Kernel
$schedule->command('license:ping')->daily();

// The Command Logic
$response = Http::withHeaders([
    'X-Product-Secret' => config('license.secret'),
])->post(config('license.url') . '/api/v1/licenses/ping', [
    'license_key' => config('license.key'),
    'domain'      => config('license.domain'),
]);

if ($response->json('status') === 'success') {
    $this->updateLocalLicenseStatus($response->json('data.license.status'));
}`} lang="php" />
          </motion.div>
        )
      case 'rest-api':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">REST API Reference</h1>
            <p className="text-muted-foreground mb-12">Low-level documentation for custom integration in any language.</p>
            
            <div className="space-y-20">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded">POST</span>
                  <code className="text-lg font-bold">/v1/licenses/verify</code>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Verify and activate a license for a specific domain.</p>
                <CodeBlock code={`{
  "license_key": "string",
  "domain": "string",
  "product_slug": "string"
}`} lang="json" />
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded">POST</span>
                  <code className="text-lg font-bold">/v1/licenses/ping</code>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Send periodic heartbeat to sync license status.</p>
                <CodeBlock code={`{
  "license_key": "string",
  "domain": "string"
}`} lang="json" />
              </section>
            </div>
          </motion.div>
        )
      case 'domains':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Managing Domains</h1>
            <p className="text-muted-foreground mb-8">Each license plan has a limit on the number of domains it can be activated on.</p>
            
            <div className="space-y-12">
               <div>
                  <h3 className="text-xl font-bold mb-4">Domain Matching</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    By default, subdomains are treated as separate entities. For example, <code>shop.example.com</code> and <code>dev.example.com</code> would count as two separate activations unless your product logic handles wildcard normalization.
                  </p>
               </div>

               <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10">
                  <h4 className="font-bold flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    How to reset domains?
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Users can manage their activations from the Customer Portal. If they reach their limit, they must delete an old domain activation before they can activate the license on a new host. 
                  </p>
               </div>
            </div>
          </motion.div>
        )
      case 'status-lifecycle':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">License Statuses</h1>
            <p className="text-muted-foreground mb-12">Understanding the lifecycle of a license key.</p>
            
            <div className="grid gap-6">
               <div className="flex gap-6 p-6 rounded-3xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Active</h4>
                    <p className="text-sm text-muted-foreground">The license is paid, valid, and within its expiration date. Product features are fully available.</p>
                  </div>
               </div>

               <div className="flex gap-6 p-6 rounded-3xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Expired</h4>
                    <p className="text-sm text-muted-foreground">The validity period has ended. The user may still be in a "Grace Period" if configured in the plan.</p>
                  </div>
               </div>

               <div className="flex gap-6 p-6 rounded-3xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Revoked</h4>
                    <p className="text-sm text-muted-foreground">Manually disabled by the administrator (e.g., due to a refund or policy violation). Activations are immediately invalidated.</p>
                  </div>
               </div>

               <div className="flex gap-6 p-6 rounded-3xl border border-border bg-card">
                  <div className="w-12 h-12 rounded-2xl bg-slate-500/20 text-slate-500 flex items-center justify-center shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Suspended</h4>
                    <p className="text-sm text-muted-foreground">Temporarily disabled. Usually used for technical investigations or payment disputes.</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Security Best Practices</h1>
            <p className="text-muted-foreground mb-8">Best practices to keep your product secure from cracking/bypassing.</p>
            
            <div className="space-y-6">
               <div className="p-6 rounded-2xl bg-card border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Obfuscate Your Secret
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Never hardcode your product secret in plain text. Use environment variables or obfuscate them if compiling binaries (e.g., C++ or Java).</p>
               </div>
               
               <div className="p-6 rounded-2xl bg-card border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Signed Responses
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Advanced integration can use RSA signatures to verify that the API response actually came from LicenseHub and hasn't been intercepted by a local proxy.</p>
               </div>
            </div>
          </motion.div>
        )
      case 'testing-qa':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Testing & Verification</h1>
            <p className="text-muted-foreground mb-12">Run these test cases to ensure your application is fully protected.</p>
            
            <div className="space-y-8">
               <div className="bg-muted p-8 rounded-3xl border border-border">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    1. Security Tamper Test (Critical)
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    In your code, manually change the state of the API response before verification (e.g. change <code>active</code> to <code>expired</code>).
                  </p>
                  <div className="text-[11px] font-bold text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                    EXPECTED: Your signature verification method MUST return FALSE and block access.
                  </div>
               </div>

               <div className="bg-muted p-8 rounded-3xl border border-border">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-blue-500" />
                    2. Domain Enforcement
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    Try activating a "Single-Site" license on a second domain or local host with a different URL.
                  </p>
                  <div className="text-[11px] font-bold text-blue-500 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                    EXPECTED: API should return 422 with "Max domain count exceeded" message.
                  </div>
               </div>

               <div className="bg-muted p-8 rounded-3xl border border-border">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-amber-500" />
                    3. Expiration Flow
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    Set the license expiration date to "Yesterday" in the LicenseHub Admin Panel.
                  </p>
                  <div className="text-[11px] font-bold text-amber-500 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                    EXPECTED: Application detects "expired" status and triggers your renewal UI.
                  </div>
               </div>
            </div>
          </motion.div>
        )
      case 'troubleshooting':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-6">Troubleshooting</h1>
            <p className="text-muted-foreground mb-12">Common errors and how to solve them during integration.</p>
            
            <div className="space-y-8">
               <div className="p-6 rounded-2xl bg-card border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    401 Unauthorized
                  </h4>
                  <p className="text-sm text-muted-foreground">Your <code>X-Product-Secret</code> is missing or incorrect. Double check your product settings in the Admin Panel.</p>
               </div>
               
               <div className="p-6 rounded-2xl bg-card border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-amber-500">
                    <Activity className="w-4 h-4" />
                    403 Domain Limit Reached
                  </h4>
                  <p className="text-sm text-muted-foreground">The license key has reached its maximum domain count. Your customer needs to deactivate an old domain from their portal.</p>
               </div>

               <div className="p-6 rounded-2xl bg-card border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-slate-500">
                    <Search className="w-4 h-4" />
                    404 License Not Found
                  </h4>
                  <p className="text-sm text-muted-foreground">The provided license key does not exist in our system. Ensure there are no typos or trailing spaces.</p>
               </div>
            </div>
          </motion.div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 opacity-20" />
             </div>
             <p className="text-lg">Section content coming soon...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-20">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Sidebar */}
          <aside className="sticky top-28 space-y-8 lg:block hidden">
            {DOCS_NAV.map((group, idx) => (
              <div key={idx}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 px-4">{group.title}</h4>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => handlePageChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 translate-x-1' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className="p-6 rounded-[2rem] bg-slate-900 text-white mt-12 relative overflow-hidden group border border-white/5">
               <div className="relative z-10">
                 <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">
                   <ShieldCheck className="w-4 h-4 text-primary" />
                   Need help?
                 </h4>
                 <p className="text-[11px] text-white/50 mb-5 leading-relaxed">Our support team is available 24/7 for tailored integration help.</p>
                 <button className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all">Support Desk</button>
               </div>
               <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all" />
            </div>
          </aside>

          {/* Mobile Selector */}
          <div className="lg:hidden mb-12">
             <select 
               className="w-full p-4 bg-muted border border-border rounded-2xl font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat"
               value={activeSection}
               onChange={(e) => handlePageChange(e.target.value)}
             >
               {DOCS_NAV.map(group => group.items.map(item => (
                 <option key={item.id} value={item.id}>{item.label}</option>
               )))}
             </select>
          </div>

          {/* Main Content Area */}
          <main className="min-w-0">
            <div className="max-w-[800px]">
               {renderContent()}
            </div>

            <hr className="my-16 border-border" />
            
            <div className="grid grid-cols-2 gap-4">
               {prevItem ? (
                 <button 
                  onClick={() => handlePageChange(prevItem.id)}
                  className="p-6 rounded-3xl border border-border hover:border-primary/30 transition text-left group"
                 >
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-50">Previous</p>
                    <p className="font-bold text-lg group-hover:text-primary transition">{prevItem.label}</p>
                 </button>
               ) : <div />}
               
               {nextItem ? (
                 <button 
                  onClick={() => handlePageChange(nextItem.id)}
                  className="p-6 rounded-3xl border border-border hover:border-primary/30 transition text-right group"
                 >
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-50">Next Topic</p>
                    <p className="font-bold text-lg group-hover:text-primary transition">{nextItem.label}</p>
                 </button>
               ) : <div />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Docs
