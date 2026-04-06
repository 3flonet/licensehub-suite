import { Link } from 'react-router-dom'
import Button from '@components/Button'
import { AlertCircle } from 'lucide-react'
import { ROUTES } from '@utils/constants'

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl font-semibold text-foreground mb-2">
          Page Not Found
        </p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={ROUTES.HOME}>
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
