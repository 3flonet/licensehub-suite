# 3FloLicenseHub Frontend

Professional License Management System - React SPA

## Features

- 🛒 **Storefront**: Browse and purchase license plans
- 🔐 **Authentication**: Secure login/register with JWT tokens
- 📊 **Customer Portal**: Manage your licenses and activations
- 👨‍💼 **Admin Dashboard**: Full business management interface
- 🌙 **Dark Mode**: Built-in dark/light theme support
- 📱 **Responsive**: Mobile-first design with Tailwind CSS
- ⚡ **Fast**: Built with Vite for optimal performance

## Tech Stack

- **React 18** - User interface library
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Simple state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Efficient form handling
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
cd licensehub-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your values
```

### Development

```bash
# Start development server
npm run dev

# The app will open at http://localhost:3000
```

### Building

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components for routing
├── services/       # API service functions
├── store/          # Zustand state management
├── hooks/          # Custom React hooks
├── utils/          # Utility functions & constants
├── styles/         # CSS files
├── config/         # Configuration files
├── assets/         # Images, logos, etc
├── App.jsx         # Root component
└── main.jsx        # Entry point
```

## API Integration

The frontend consumes the Laravel backend API:

```
API_URL: http://localhost:8000
Auth: Bearer token (stored in localStorage)
```

### Main Endpoints

- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login customer
- `GET /api/products` - List all products
- `GET /api/licenses` - List customer licenses
- `POST /api/orders` - Create new order
- `POST /api/licenses/{id}/activate` - Activate license

## Authentication

Uses JWT tokens stored in localStorage:

```javascript
// Login response
{
  "access_token": "eyJ...",
  "user": {
    "id": "uuid",
    "name": "John",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

Token is automatically included in all API requests via axios interceptors.

## State Management

Using Zustand for global state:

```javascript
import useStore from '@store/useStore'

const MyComponent = () => {
  const { user, isAuthenticated, setAuth, logout } = useStore()
  // ...
}
```

## Component Examples

### Button

```jsx
import Button from '@components/Button'

<Button variant="solid" size="md">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Danger</Button>
```

### Protected Routes

```jsx
import ProtectedRoute from '@components/ProtectedRoute'

<Route
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=3FloLicenseHub
VITE_MIDTRANS_CLIENT_KEY=YOUR_KEY
VITE_MIDTRANS_ENVIRONMENT=sandbox
```

## Development Tips

### Hot Module Replacement

Vite supports HMR out of the box. Changes to your components will reflect immediately.

### Debugging

Open browser DevTools:
- React DevTools extension recommended
- Redux/Zustand DevTools for state inspection

### Testing

```bash
# Future: Add test runner setup
npm run test
```

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub, connect to Vercel
# Auto-deploys on push to main
```

### Self-Hosted (Nginx)

```bash
# Build
npm run build

# Copy dist/ folder to your server
# Configure nginx to serve dist/index.html for all routes
```

## Common Tasks

### Add New Page

1. Create file in `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Add route constant in `utils/constants.js`

### Add New API Service

1. Create file in `src/services/newService.js`
2. Use `apiClient` from config
3. Export service methods
4. Create hook in `src/hooks/` for React integration

### Add New Component

1. Create file in `src/components/`
2. Use Tailwind for styling
3. Import/export in component file
4. Use in pages

## Troubleshooting

### CORS Errors

Make sure Laravel backend has CORS headers configured:

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
```

### API Requests Failing

Check:
1. Backend is running on correct port
2. `VITE_API_URL` matches backend URL
3. Authentication token is valid
4. Check browser console for details

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## License

This project is part of 3FloLicenseHub.

## Support

For issues and questions:
1. Check documentation at `/docs`
2. Review FAQ at `/faq`
3. Contact support via `/contact`
