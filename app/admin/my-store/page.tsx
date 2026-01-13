'use client';

import { useEffect, useState } from 'react';
import { getCurrentAdminUser, getAdminStore, updateStore, AdminUser, AdminStore } from '@/lib/admin_api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, Save } from 'lucide-react';

export default function MyStorePage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [store, setStore] = useState<AdminStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<AdminStore>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentAdminUser();
      setUser(userData);
      
      if (userData.store) {
        const storeData = await getAdminStore(userData.store);
        setStore(storeData);
        setFormData({
          name: storeData.name,
          description: storeData.description,
          location: storeData.location,
          email: storeData.email || '',
          phone: storeData.phone || '',
          facebook_url: storeData.facebook_url || '',
          instagram_url: storeData.instagram_url || '',
          qpay_merchant_id: storeData.qpay_merchant_id || '',
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    
    setErrors({});
    setSubmitting(true);
    setSaved(false);

    try {
      await updateStore(store.id, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await loadData();
    } catch (error: any) {
      if (error.message) {
        setErrors({ submit: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Дэлгүүр олдсонгүй</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Миний дэлгүүр</h1>
        <p className="text-gray-600 mt-2">Дэлгүүрийн мэдээлэл засах</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {saved && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            Мэдээлэл амжилттай хадгалагдлаа
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дэлгүүрийн нэр <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тайлбар
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Байршил
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Утас
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имэйл
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook URL
              </label>
              <Input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram URL
              </label>
              <Input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QPay Merchant ID
            </label>
            <Input
              value={formData.qpay_merchant_id || ''}
              onChange={(e) => setFormData({ ...formData, qpay_merchant_id: e.target.value })}
              placeholder="792f1fb9-e418-4f67-869b-7c32f4ade2a0"
            />
          </div>

          {errors.submit && (
            <div className="text-sm text-red-600">{errors.submit}</div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={submitting} className="gap-2">
              <Save className="w-4 h-4" />
              {submitting ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

