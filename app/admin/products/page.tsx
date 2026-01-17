'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  getAdminProducts, 
  getAdminStores,
  getAdminCategories,
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadFile,
  getCurrentAdminUser,
  AdminProduct,
  AdminStore,
  AdminCategory,
  AdminUser
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
import { Plus, Edit, Trash2, Search, Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    title: '',
    slug: '',
    description: '',
    price: '',
    original_price: '',
    store: undefined,
    category: undefined,
    image: '',
    is_active: true,
  });
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [productImages, setProductImages] = useState<File[]>([]);
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<Array<{name: string; price_modifier: number; order: number; is_active: boolean}>>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
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
      const [userData, productsData, storesData, categoriesData] = await Promise.all([
        getCurrentAdminUser(),
        getAdminProducts(),
        getAdminStores(),
        getAdminCategories(),
      ]);
      setCurrentUser(userData);
      setProducts(productsData);
      setStores(storesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Calculate discount percentage
  const calculateDiscount = (original: string, price: string) => {
    if (!original || !price) return 0;
    const orig = parseFloat(original);
    const pr = parseFloat(price);
    if (orig <= pr) return 0;
    return Math.round(((orig - pr) / orig) * 100);
  };

  // Calculate price from original and discount
  const calculatePrice = (original: string, discount: number) => {
    if (!original || discount <= 0) return original;
    const orig = parseFloat(original);
    return (orig * (1 - discount / 100)).toFixed(2);
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ image: 'Зөвхөн зураг файл оруулах боломжтой' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ image: 'Файлын хэмжээ 10MB-аас их байна' });
      return;
    }

    setMainImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const fakeEvent = {
        target: { files: [file] }
      } as any;
      handleMainImageChange(fakeEvent);
    }
  };

  const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setProductImages([...productImages, ...imageFiles]);

    // Create previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
    setProductImagePreviews(productImagePreviews.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      price: '',
      original_price: '',
      store: stores[0]?.id,
      category: undefined,
      image: '',
      is_active: true,
    });
    setDiscountPercentage(0);
    setMainImageFile(null);
    setMainImagePreview('');
    setProductImages([]);
    setProductImagePreviews([]);
    setProductOptions([]);
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleEdit = (product: AdminProduct) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: product.price,
      original_price: product.original_price || '',
      store: product.store,
      category: product.category,
      image: product.image,
      is_active: product.is_active,
    });
    const discount = calculateDiscount(product.original_price || '', product.price);
    setDiscountPercentage(discount);
    setMainImageFile(null);
    setMainImagePreview(product.image || '');
    setProductImages([]);
    setProductImagePreviews(product.color_images || []);
    // Load product options
    if (product.options && product.options.length > 0) {
      setProductOptions(product.options.map(opt => ({
        name: opt.name,
        price_modifier: opt.price_modifier,
        order: opt.order,
        is_active: opt.is_active
      })));
    } else {
      setProductOptions([]);
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteProductId) return;
    try {
      await deleteProduct(deleteProductId);
      await loadData();
      setIsDeleteDialogOpen(false);
      setDeleteProductId(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Бүтээгдэхүүн устгахад алдаа гарлаа');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    if (!formData.title) {
      setErrors({ title: 'Нэр шаардлагатай' });
      return;
    }
    if (!formData.original_price || parseFloat(formData.original_price) <= 0) {
      setErrors({ original_price: 'Анхны үнэ шаардлагатай' });
      return;
    }
    if (!formData.store) {
      setErrors({ store: 'Дэлгүүр сонгох шаардлагатай' });
      return;
    }
    if (!mainImageFile && !formData.image) {
      setErrors({ image: 'Гол зураг шаардлагатай' });
      return;
    }

    setSubmitting(true);
    setUploadingImages(true);

    try {
      // Upload main image if selected
      let imageUrl = formData.image;
      if (mainImageFile) {
        try {
          const uploadResult = await uploadFile(mainImageFile);
          imageUrl = uploadResult.url;
        } catch (uploadError: any) {
          setErrors({ image: uploadError.message || 'Зураг upload хийхэд алдаа гарлаа' });
          setSubmitting(false);
          setUploadingImages(false);
          return;
        }
      }
      
      if (!imageUrl) {
        setErrors({ image: 'Гол зураг шаардлагатай' });
        setSubmitting(false);
        setUploadingImages(false);
        return;
      }

      // Upload product images
      const uploadedImageUrls: string[] = [];
      for (const file of productImages) {
        try {
          const uploadResult = await uploadFile(file);
          uploadedImageUrls.push(uploadResult.url);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
        }
      }

      // Calculate price if discount percentage is set
      let finalPrice = formData.price;
      if (formData.original_price && discountPercentage > 0) {
        finalPrice = calculatePrice(formData.original_price, discountPercentage);
      }

      const submitData: any = {
        ...formData,
        image: imageUrl,
        price: finalPrice,
      };

      // Add product images if uploaded
      if (uploadedImageUrls.length > 0) {
        submitData.product_images = uploadedImageUrls;
      }

      // Add product options if any
      if (productOptions.length > 0) {
        submitData.product_options = productOptions.map((opt, index) => ({
          name: opt.name,
          price_modifier: parseFloat(opt.price_modifier.toString()) || 0,
          order: opt.order || index,
          is_active: opt.is_active !== false
        }));
      }

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, submitData);
      } else {
        await createProduct(submitData);
      }
      setIsDialogOpen(false);
      // Reset form
      setFormData({
        title: '',
        slug: '',
        description: '',
        price: '',
        original_price: '',
        store: stores[0]?.id,
        category: undefined,
        image: '',
        is_active: true,
      });
      setDiscountPercentage(0);
      setMainImageFile(null);
      setMainImagePreview('');
      setProductImages([]);
      setProductImagePreviews([]);
      setProductOptions([]);
      setErrors({});
      await loadData();
    } catch (error: any) {
      if (error.message) {
        setErrors({ submit: error.message });
      }
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.store_name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Бүтээгдэхүүнүүд</h1>
          <p className="text-gray-600 mt-2">Бүтээгдэхүүний мэдээлэл удирдах</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Шинэ бүтээгдэхүүн
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
                <TableHead>Гарчиг</TableHead>
                <TableHead>Дэлгүүр</TableHead>
                <TableHead>Үнэ</TableHead>
                <TableHead>Борлуулалт</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Бүтээгдэхүүн олдсонгүй
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>{product.store_name}</TableCell>
                    <TableCell>
                      {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) ? (
                        <div>
                          <span className="text-red-600 line-through">{parseFloat(product.original_price).toLocaleString()}₮</span>
                          <span className="ml-2 font-bold">{parseFloat(product.price).toLocaleString()}₮</span>
                        </div>
                      ) : (
                        <span className="font-bold">{parseFloat(product.price).toLocaleString()}₮</span>
                      )}
                    </TableCell>
                    <TableCell>{product.sales}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Идэвхтэй' : 'Идэвхгүй'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Бүтээгдэхүүн засах' : 'Шинэ бүтээгдэхүүн'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Үндсэн мэдээлэл
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр <span className="text-red-500">*</span>
                </label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({ 
                    ...formData, 
                    title,
                    slug: generateSlug(title)
                  });
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                required
                placeholder="Бүтээгдэхүүний нэр"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (автоматаар үүсгэгдэнэ)
              </label>
              <Input
                value={formData.slug}
                readOnly
                className="bg-gray-50"
                placeholder="Slug автоматаар үүсгэгдэнэ"
              />
            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тайлбар
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                    placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар оруулна уу..."
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description?.length || 0}/2000 тэмдэгт
                  </p>
                </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Үнэ, хямдрал
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Анхны үнэ <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) => {
                    const original = e.target.value;
                    const discount = discountPercentage;
                    const price = discount > 0 ? calculatePrice(original, discount) : original;
                    setFormData({ 
                      ...formData, 
                      original_price: original,
                      price: price
                    });
                    if (errors.original_price) {
                      setErrors({ ...errors, original_price: '' });
                    }
                  }}
                  required
                  placeholder="0.00"
                  className={errors.original_price ? 'border-red-500' : ''}
                />
                {errors.original_price && (
                  <p className="text-xs text-red-500 mt-1">{errors.original_price}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хямдралын хувь (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => {
                    const discount = parseInt(e.target.value) || 0;
                    setDiscountPercentage(discount);
                    if (formData.original_price) {
                      const price = calculatePrice(formData.original_price, discount);
                      setFormData({ ...formData, price });
                    }
                  }}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Борлуулах үнэ
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  readOnly
                  className="bg-gray-50 font-bold"
                  placeholder="Автоматаар тооцоологдоно"
                />
              </div>
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Борлуулалт
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.sales || 0}
                  onChange={(e) => setFormData({ ...formData, sales: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category & Store */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Ангилал, дэлгүүр
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дэлгүүр <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.store || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, store: parseInt(e.target.value) });
                      if (errors.store) {
                        setErrors({ ...errors, store: '' });
                      }
                    }}
                    className={`w-full rounded-lg border px-3 py-2 text-sm ${errors.store ? 'border-red-500' : ''}`}
                    required
                  >
                    <option value="">Сонгох...</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                  </select>
                  {errors.store && (
                    <p className="text-xs text-red-500 mt-1">{errors.store}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ангилал
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  >
                    <option value="">Сонгох...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Зургууд
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Гол зураг <span className="text-red-500">*</span>
                </label>
              {mainImagePreview ? (
                <div className="relative mb-2">
                  <img 
                    src={mainImagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImageFile(null);
                      setMainImagePreview('');
                      setFormData({ ...formData, image: '' });
                      if (errors.image) {
                        setErrors({ ...errors, image: '' });
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label 
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    errors.image 
                      ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Зураг сонгох</span> эсвэл чирж тавих
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      handleMainImageChange(e);
                      if (errors.image) {
                        setErrors({ ...errors, image: '' });
                      }
                    }}
                  />
                </label>
              )}
              {errors.image && (
                <p className="text-xs text-red-500 mt-1">{errors.image}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Бүтээгдэхүүний зургууд
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {productImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeProductImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <label className="flex items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-primary transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="w-6 h-6 mb-1 text-gray-500" />
                  <p className="text-sm text-gray-500">Зураг нэмэх</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleProductImagesChange}
                />
              </label>
            </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex-1">
                  Сонголтууд
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProductOptions([...productOptions, {
                      name: '',
                      price_modifier: 0,
                      order: productOptions.length,
                      is_active: true
                    }]);
                  }}
                  className="ml-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Сонголт нэмэх
                </Button>
              </div>
              
              {productOptions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Сонголт байхгүй. "Сонголт нэмэх" товч дараад нэмнэ үү.
                </p>
              ) : (
                <div className="space-y-3">
                  {productOptions.map((option, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Нэр
                          </label>
                          <Input
                            value={option.name}
                            onChange={(e) => {
                              const newOptions = [...productOptions];
                              newOptions[index].name = e.target.value;
                              setProductOptions(newOptions);
                            }}
                            placeholder="Жишээ: Жижиг, Том, Улаан..."
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Үнэний өөрчлөлт (₮)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            value={option.price_modifier}
                            onChange={(e) => {
                              const newOptions = [...productOptions];
                              newOptions[index].price_modifier = parseFloat(e.target.value) || 0;
                              setProductOptions(newOptions);
                            }}
                            placeholder="0.00"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          checked={option.is_active}
                          onChange={(e) => {
                            const newOptions = [...productOptions];
                            newOptions[index].is_active = e.target.checked;
                            setProductOptions(newOptions);
                          }}
                          className="w-4 h-4"
                          title="Идэвхтэй"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newOptions = productOptions.filter((_, i) => i !== index);
                            // Reorder
                            newOptions.forEach((opt, i) => {
                              opt.order = i;
                            });
                            setProductOptions(newOptions);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Төлөв
              </h3>
              
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
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {errors.submit}
              </div>
            )}

            {uploadingImages && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                Зургууд upload хийж байна...
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setErrors({});
                }}
                disabled={submitting}
              >
                Цуцлах
              </Button>
              <Button 
                type="submit" 
                disabled={submitting || uploadingImages}
                className="bg-primary hover:bg-primary/90"
              >
                {submitting ? 'Хадгалж байна...' : uploadingImages ? 'Зураг upload хийж байна...' : 'Хадгалах'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Бүтээгдэхүүн устгах уу?</AlertDialogTitle>
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

