import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import useAuth from '@hooks/useAuth'
import Button from '@components/Button'
import { ROUTES } from '@utils/constants'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    try {
      await login(email, password)
      const from = location.state?.from || ROUTES.PORTAL_DASHBOARD
      navigate(from, { replace: true })
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground mb-8">
          Sign in to your account to manage licenses
        </p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              Don't have an account?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <Link to={ROUTES.REGISTER}>
          <Button variant="outline" className="w-full">
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
