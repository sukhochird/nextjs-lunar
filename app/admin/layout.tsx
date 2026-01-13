'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentAdminUser, adminLogout, AdminUser } from '@/lib/admin_api';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  FolderTree, 
  Users, 
  ShoppingCart,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getCurrentAdminUser()
      .then((userData) => {
        setUser(userData);
        // Redirect to login if not admin
        if (userData.role !== 'super_admin' && userData.role !== 'store_admin') {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isSuperAdmin = user.role === 'super_admin';

  const superAdminMenu = [
    { name: 'Хяналтын самбар', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Дэлгүүрүүд', path: '/admin/stores', icon: Store },
    { name: 'Бүтээгдэхүүнүүд', path: '/admin/products', icon: Package },
    { name: 'Ангиллууд', path: '/admin/categories', icon: FolderTree },
    { name: 'Админууд', path: '/admin/users', icon: Users },
    { name: 'Захиалгууд', path: '/admin/orders', icon: ShoppingCart },
  ];

  const storeAdminMenu = [
    { name: 'Хяналтын самбар', path: '/admin/store-dashboard', icon: LayoutDashboard },
    { name: 'Миний дэлгүүр', path: '/admin/my-store', icon: Store },
    { name: 'Бүтээгдэхүүнүүд', path: '/admin/my-products', icon: Package },
    { name: 'Захиалгууд', path: '/admin/my-orders', icon: ShoppingCart },
  ];

  const menuItems = isSuperAdmin ? superAdminMenu : storeAdminMenu;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">Админ панел</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{user.username}</p>
              <p className="text-xs">{user.role_display}</p>
              {user.store_name && (
                <p className="text-xs text-primary">{user.store_name}</p>
              )}
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => {
                        router.push(item.path);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors
                        ${isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start gap-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Гарах</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1" />
            <div className="text-sm text-gray-600">
              {user.first_name} {user.last_name}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

