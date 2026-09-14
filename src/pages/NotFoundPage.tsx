import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-primary-600">404</p>
        <h1 className="mt-4 text-xl font-bold text-secondary-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-secondary-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Go Home
        </Link>
      </div>
    </div>
  )
}
