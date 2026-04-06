import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Lock, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '@components/Button'
import { ROUTES } from '@utils/constants'
import apiClient from '@config/api'

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const navigate = useNavigate()
  const location = useLocation()

  // Parse URL query parameters to retrieve token and email
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing password reset token. Please request a new password reset.')
    }
  }, [token, email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== passwordConfirm) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      await apiClient.post('/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirm,
      })
      setSuccess(true)
      setTimeout(() => {
        navigate(ROUTES.LOGIN)
      }, 3000)
    } catch (err) {
      const respData = err.response?.data
      const errorMsg = respData?.email?.[0] || respData?.password?.[0] || respData?.message || 'Gagal mengubah password. Token mungkin kedaluwarsa.'
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-lg border border-border p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your password has been successfully updated. You can now log in with your new credentials.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
        <p className="text-muted-foreground mb-8">
           Enter your new password below. Ensure it is at least 8 characters long.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field (readonly just for visual confirmation) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              value={email || ''}
              readOnly
              className="w-full px-4 py-2 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
              />
            </div>
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                id="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 pb-4">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-input text-primary"
            />
            <span className="text-sm text-muted-foreground">Show passwords</span>
          </label>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !token || !email}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
