import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import useAuth from '@hooks/useAuth'
import Button from '@components/Button'
import { ROUTES } from '@utils/constants'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    company: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      // Error will be shown via error state
      return
    }

    try {
      await register(formData)
      setSuccess(true)
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 2000)
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-lg border border-border p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
          <p className="text-muted-foreground mb-6">
            Your account has been successfully created. Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-muted-foreground mb-8">
          Join us to start managing licenses
        </p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              At least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                name="passwordConfirm"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Company Field (Optional) */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <input
              id="company"
              type="text"
              name="company"
              placeholder="Your Company Inc."
              className="w-full px-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* Show Password Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm text-muted-foreground">Show password</span>
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Sign In Link */}
        <Link to={ROUTES.LOGIN}>
          <Button variant="outline" className="w-full">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
