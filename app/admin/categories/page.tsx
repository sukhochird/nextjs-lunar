'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getAdminCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  AdminCategory 
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

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AdminCategory>>({
    name: '',
    slug: '',
    parent: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
    const action = searchParams.get('action');
    if (action === 'create') {
      setIsDialogOpen(true);
    }
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      parent: undefined,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (category: AdminCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parent: category.parent,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteCategoryId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteCategoryId) return;
    try {
      await deleteCategory(deleteCategoryId);
      await loadCategories();
      setIsDeleteDialogOpen(false);
      setDeleteCategoryId(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Ангилал устгахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      setIsDialogOpen(false);
      await loadCategories();
    } catch (error: any) {
      if (error.message) {
        setErrors({ submit: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Ангиллууд</h1>
          <p className="text-gray-600 mt-2">Ангиллын мэдээлэл удирдах</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Шинэ ангилал
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
                <TableHead>Slug</TableHead>
                <TableHead>Эцэг ангилал</TableHead>
                <TableHead>Бүтээгдэхүүн</TableHead>
                <TableHead>Дэд ангилал</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Ангилал олдсонгүй
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => {
                  const parentCategory = categories.find(c => c.id === category.parent);
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>{parentCategory?.name || '-'}</TableCell>
                      <TableCell>{category.products_count}</TableCell>
                      <TableCell>{category.subcategories_count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Ангилал засах' : 'Шинэ ангилал'}
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
                Эцэг ангилал
              </label>
              <select
                value={formData.parent || ''}
                onChange={(e) => setFormData({ ...formData, parent: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Сонгох...</option>
                {categories
                  .filter(c => c.id !== selectedCategory?.id)
                  .map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
              </select>
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
            <AlertDialogTitle>Ангилал устгах уу?</AlertDialogTitle>
            <AlertDialogDescription>
              Энэ үйлдлийг буцаах боломжгүй. Ангилал бүх бүтээгдэхүүнтэйгээ хамт устгагдана.
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

