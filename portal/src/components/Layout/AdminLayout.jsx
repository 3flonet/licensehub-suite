import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
