'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getAdminStores, 
  createStore, 
  updateStore, 
  deleteStore,
  AdminStore 
} from '@/lib/admin_api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, Store } from 'lucide-react';

export default function StoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);
  const [deleteStoreId, setDeleteStoreId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AdminStore>>({
    name: '',
    slug: '',
    description: '',
    location: '',
    email: '',
    phone: '',
    facebook_url: '',
    instagram_url: '',
    qpay_merchant_id: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStores();
    const action = searchParams.get('action');
    if (action === 'create') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const data = await getAdminStores();
      setStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedStore(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      location: '',
      email: '',
      phone: '',
      facebook_url: '',
      instagram_url: '',
      qpay_merchant_id: '',
      is_active: true,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (store: AdminStore) => {
    setSelectedStore(store);
    setFormData({
      name: store.name,
      slug: store.slug,
      description: store.description,
      location: store.location,
      email: store.email || '',
      phone: store.phone || '',
      facebook_url: store.facebook_url || '',
      instagram_url: store.instagram_url || '',
      qpay_merchant_id: store.qpay_merchant_id || '',
      is_active: store.is_active,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteStoreId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteStoreId) return;
    try {
      await deleteStore(deleteStoreId);
      await loadStores();
      setIsDeleteDialogOpen(false);
      setDeleteStoreId(null);
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Дэлгүүр устгахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      if (selectedStore) {
        await updateStore(selectedStore.id, formData);
      } else {
        await createStore(formData);
      }
      setIsDialogOpen(false);
      await loadStores();
    } catch (error: any) {
      if (error.message) {
        setErrors({ submit: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStores = (Array.isArray(stores) ? stores : []).filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Дэлгүүрүүд</h1>
          <p className="text-gray-600 mt-2">Дэлгүүрийн мэдээлэл удирдах</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Шинэ дэлгүүр
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>Байршил</TableHead>
                <TableHead>Бүтээгдэхүүн</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Дэлгүүр олдсонгүй
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.location || '-'}</TableCell>
                    <TableCell>{store.products_count}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        store.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(store)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(store.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStore ? 'Дэлгүүр засах' : 'Шинэ дэлгүүр'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тайлбар
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                rows={3}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Идэвхтэй
              </label>
            </div>

            {errors.submit && (
              <div className="text-sm text-red-600">{errors.submit}</div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Цуцлах
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Хадгалж байна...' : 'Хадгалах'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Дэлгүүр устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Дэлгүүр бүх бүтээгдэхүүнтэйгээ хамт устгагдана.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

