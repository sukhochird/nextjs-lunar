'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminLogin, getCurrentAdminUser } from '@/lib/admin_api';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      try {
        const user = await getCurrentAdminUser();
        // Redirect based on role
        if (user.role === 'super_admin') {
          router.replace('/admin/dashboard');
        } else if (user.role === 'store_admin') {
          router.replace('/admin/store-dashboard');
        } else {
          // Not an admin, show login form
          setCheckingAuth(false);
        }
      } catch (error: any) {
        // Not logged in or error occurred, show login form
        console.log('Auth check error:', error?.message || 'Нэвтрээгүй байна');
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminLogin(username, password);
      
      // Redirect based on role
      if (response.user.role === 'super_admin') {
        router.replace('/admin/dashboard');
      } else if (response.user.role === 'store_admin') {
        router.replace('/admin/store-dashboard');
      } else {
        setError('Та админ эрхгүй байна');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err?.message || 'Нэвтрэхэд алдаа гарлаа';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Шалгаж байна...</p>
        </div>
      </div>
    );
  }

  // Show error if there's a critical error
  if (error && (error.includes('Failed to fetch') || error.includes('Network'))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Холболтын алдаа
              </h1>
              <p className="text-gray-600 mb-4">
                Сервертэй холбогдох боломжгүй байна. Дахин оролдоно уу.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90"
              >
                Дахин оролдох
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Админ нэвтрэх
            </h1>
            <p className="text-gray-600">
              Админ панелд нэвтрэх
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нэвтрэх нэр
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Нэвтрэх нэр оруулна уу"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Нууц үг оруулна уу"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ← Нүүр хуудас руу буцах
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

