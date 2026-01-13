'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getUsers, 
  getAdminStores,
  createUser, 
  updateUser, 
  deleteUser,
  AdminUser,
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
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function UsersPage() {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AdminUser> & { password?: string }>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'store_admin',
    phone: '',
    store: undefined,
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    const action = searchParams.get('action');
    if (action === 'create') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, storesData] = await Promise.all([
        getUsers(),
        getAdminStores(),
      ]);
      setUsers(usersData);
      setStores(storesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: 'store_admin',
      phone: '',
      store: undefined,
      password: '',
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone,
      store: user.store,
      password: '',
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId);
      await loadData();
      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Хэрэглэгч устгахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const submitData = { ...formData };
      if (selectedUser && !submitData.password) {
        delete submitData.password;
      }
      
      if (selectedUser) {
        await updateUser(selectedUser.id, submitData);
      } else {
        if (!submitData.password) {
          setErrors({ password: 'Нууц үг шаардлагатай' });
          setSubmitting(false);
          return;
        }
        await createUser(submitData as AdminUser & { password: string });
      }
      setIsDialogOpen(false);
      await loadData();
    } catch (error: any) {
      if (error.message) {
        setErrors({ submit: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Хэрэглэгчид</h1>
          <p className="text-gray-600 mt-2">Админ хэрэглэгч удирдах</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Шинэ админ
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Бүх эрх</option>
            <option value="super_admin">Super Admin</option>
            <option value="store_admin">Store Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэвтрэх нэр</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead>Имэйл</TableHead>
                <TableHead>Эрх</TableHead>
                <TableHead>Дэлгүүр</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Хэрэглэгч олдсонгүй
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.first_name} {user.last_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {user.role_display}
                      </span>
                    </TableCell>
                    <TableCell>{user.store_name || '-'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
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
              {selectedUser ? 'Хэрэглэгч засах' : 'Шинэ админ'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэвтрэх нэр <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имэйл <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр
                </label>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Овог
                </label>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Нууц үг {!selectedUser && <span className="text-red-500">*</span>}
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!selectedUser}
                placeholder={selectedUser ? 'Өөрчлөхгүй бол хоосон үлдээнэ үү' : ''}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Эрх <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any, store: e.target.value === 'store_admin' ? formData.store : undefined })}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  required
                >
                  <option value="store_admin">Store Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {formData.role === 'store_admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дэлгүүр <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.store || ''}
                    onChange={(e) => setFormData({ ...formData, store: parseInt(e.target.value) })}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Сонгох...</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                </div>
              )}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active !== false}
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
            {errors.password && (
              <div className="text-sm text-red-600">{errors.password}</div>
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
            <AlertDialogTitle>Хэрэглэгч устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй.
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

