import { Link } from 'react-router-dom'
import Button from '@components/Button'
import { ROUTES } from '@utils/constants'
import { CheckCircle, Zap, Lock, BarChart3 } from 'lucide-react'

export const HomePage = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Professional License Management{' '}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Manage, distribute, and monitor software licenses with ease.
            3FloLicenseHub provides everything you need to protect your digital products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={ROUTES.PRODUCTS}>
              <Button size="lg">View Plans</Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose 3FloLicenseHub?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: 'Secure',
                description: 'Military-grade encryption for all licenses',
              },
              {
                icon: Zap,
                title: 'Fast',
                description: 'Lightning-quick activation and verification',
              },
              {
                icon: CheckCircle,
                title: 'Reliable',
                description: '99.9% uptime SLA guarantee',
              },
              {
                icon: BarChart3,
                title: 'Analytics',
                description: 'Detailed reports and insights',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose a plan and start managing your licenses today.
            No credit card required.
          </p>
          <Link to={ROUTES.PRODUCTS}>
            <Button size="lg">Browse Plans</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
