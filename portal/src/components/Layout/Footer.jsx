import { Link } from 'react-router-dom'
import { ROUTES } from '@utils/constants'
import useStore from '@store/useStore'

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { siteSettings } = useStore()
  
  const siteName = siteSettings?.site_name || '3Flo LicenseHub'
  const siteDesc = siteSettings?.site_tagline || 'Professional license management system for your products.'
  const company = siteSettings?.company_name || '3Flo'

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">{siteName}</h3>
            <p className="text-sm text-muted-foreground">
              {siteDesc}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.PRODUCTS} className="hover:text-primary">
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FEATURES} className="hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link to={ROUTES.COMPARE_PLANS} className="hover:text-primary">
                  Compare Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.FAQ} className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to={ROUTES.DOCS} className="hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.PRIVACY} className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS} className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to={ROUTES.COOKIES} className="hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {company}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {siteSettings?.social_facebook && (
                <a href={siteSettings.social_facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  Facebook
                </a>
              )}
              {siteSettings?.social_instagram && (
                <a href={siteSettings.social_instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  Instagram
                </a>
              )}
              {siteSettings?.social_twitter && (
                 <a href={siteSettings.social_twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                   Twitter
                 </a>
              )}
              {/* If no specific URL exists but there is a handle, link to x.com */}
              {!siteSettings?.social_twitter && siteSettings?.twitter_handle && (
                 <a href={`https://x.com/${siteSettings.twitter_handle.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                   Twitter
                 </a>
              )}
              {siteSettings?.social_github && (
                <a href={siteSettings.social_github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  GitHub
                </a>
              )}
              {siteSettings?.social_linkedin && (
                <a href={siteSettings.social_linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                  LinkedIn
                </a>
              )}
              {siteSettings?.social_youtube && (
                 <a href={siteSettings.social_youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                   YouTube
                 </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
