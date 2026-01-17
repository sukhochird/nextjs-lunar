const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'store_admin' | 'customer';
  role_display: string;
  phone: string;
  store?: number;
  store_name?: string;
  is_active: boolean;
  date_joined: string;
  created_at: string;
}

export interface AdminStore {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  location: string;
  verified: boolean;
  qpay_merchant_id?: string;
  facebook_url: string;
  instagram_url: string;
  email: string;
  phone: string;
  is_active: boolean;
  products_count: number;
  orders_count: number;
  admins_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminProductOption {
  id: number;
  name: string;
  price_modifier: number;
  order: number;
  is_active: boolean;
}

export interface AdminProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  original_price?: string;
  sales: number;
  image: string;
  store: number;
  store_name: string;
  category?: number;
  category_name?: string;
  is_active: boolean;
  color_images: string[];
  options?: AdminProductOption[];
  created_at: string;
  updated_at: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  parent?: number;
  products_count: number;
  subcategories_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminOrder {
  id: number;
  store: number;
  store_name: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status_display: string;
  notes: string;
  items: Array<{
    id: number;
    product: number;
    product_title: string;
    product_image: string;
    quantity: number;
    price: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: AdminUser;
  message: string;
}

// Authentication
export async function adminLogin(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.non_field_errors?.[0] || 'Нэвтрэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function adminLogout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/auth/logout/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Гарахад алдаа гарлаа');
  }
}

export async function getCurrentAdminUser(): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/auth/me/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = 'Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      if (response.status === 403) {
        errorMessage = 'Нэвтрээгүй байна. Нэвтрэх шаардлагатай.';
      } else if (response.status === 401) {
        errorMessage = 'Нэвтрэх эрх хүчингүй болсон байна.';
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// File upload
export async function uploadFile(file: File): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/admin/upload/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Файл upload хийхэд алдаа гарлаа');
  }

  return response.json();
}

// Users (Super admin only)
export async function getUsers(params?: { role?: string }): Promise<AdminUser[]> {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.append('role', params.role);
  
  const response = await fetch(`${API_BASE_URL}/admin/users/?${queryParams}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Хэрэглэгчид авахад алдаа гарлаа');
  }

  return response.json();
}

export async function createUser(userData: Partial<AdminUser> & { password: string }): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Хэрэглэгч үүсгэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function updateUser(id: number, userData: Partial<AdminUser>): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Хэрэглэгч шинэчлэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Хэрэглэгч устгахад алдаа гарлаа');
  }
}

// Stores
export async function getAdminStores(): Promise<AdminStore[]> {
  const response = await fetch(`${API_BASE_URL}/admin/stores/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Дэлгүүрүүд авахад алдаа гарлаа');
  }

  const data = await response.json();
  // Handle paginated response
  return Array.isArray(data) ? data : (data.results || []);
}

export async function getAdminStore(id: number): Promise<AdminStore> {
  const response = await fetch(`${API_BASE_URL}/admin/stores/${id}/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Дэлгүүр авахад алдаа гарлаа');
  }

  return response.json();
}

export async function createStore(storeData: Partial<AdminStore>): Promise<AdminStore> {
  const response = await fetch(`${API_BASE_URL}/admin/stores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(storeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Дэлгүүр үүсгэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function updateStore(id: number, storeData: Partial<AdminStore>): Promise<AdminStore> {
  const response = await fetch(`${API_BASE_URL}/admin/stores/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(storeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Дэлгүүр шинэчлэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function deleteStore(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/stores/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Дэлгүүр устгахад алдаа гарлаа');
  }
}

// Products
export async function getAdminProducts(params?: { store?: number; category?: number }): Promise<AdminProduct[]> {
  const queryParams = new URLSearchParams();
  if (params?.store) queryParams.append('store', params.store.toString());
  if (params?.category) queryParams.append('category', params.category.toString());
  
  const response = await fetch(`${API_BASE_URL}/admin/products/?${queryParams}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Бүтээгдэхүүнүүд авахад алдаа гарлаа');
  }

  const data = await response.json();
  // Handle paginated response (DRF returns {count, next, previous, results})
  // or direct array response
  return Array.isArray(data) ? data : (data.results || []);
}

export async function getAdminProduct(id: number): Promise<AdminProduct> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Бүтээгдэхүүн авахад алдаа гарлаа');
  }

  return response.json();
}

export async function createProduct(productData: Partial<AdminProduct>): Promise<AdminProduct> {
  const response = await fetch(`${API_BASE_URL}/admin/products/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Бүтээгдэхүүн үүсгэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function updateProduct(id: number, productData: Partial<AdminProduct>): Promise<AdminProduct> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Бүтээгдэхүүн устгахад алдаа гарлаа');
  }
}

// Categories (Super admin only)
export async function getAdminCategories(): Promise<AdminCategory[]> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Ангиллууд авахад алдаа гарлаа');
  }

  const data = await response.json();
  // Handle paginated response (DRF returns {count, next, previous, results})
  // or direct array response
  return Array.isArray(data) ? data : (data.results || []);
}

export async function createCategory(categoryData: Partial<AdminCategory>): Promise<AdminCategory> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ангилал үүсгэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function updateCategory(id: number, categoryData: Partial<AdminCategory>): Promise<AdminCategory> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(categoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Ангилал шинэчлэхэд алдаа гарлаа');
  }

  return response.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Ангилал устгахад алдаа гарлаа');
  }
}

// Orders
export async function getAdminOrders(params?: { store?: number; status?: string }): Promise<AdminOrder[]> {
  const queryParams = new URLSearchParams();
  if (params?.store) queryParams.append('store', params.store.toString());
  if (params?.status) queryParams.append('status', params.status);
  
  const response = await fetch(`${API_BASE_URL}/admin/orders/?${queryParams}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Захиалгууд авахад алдаа гарлаа');
  }

  const data = await response.json();
  // Handle paginated response (DRF returns {count, next, previous, results})
  // or direct array response
  return Array.isArray(data) ? data : (data.results || []);
}

export async function getAdminOrder(id: number): Promise<AdminOrder> {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Захиалга авахад алдаа гарлаа');
  }

  return response.json();
}

export async function updateOrderStatus(id: number, status: string): Promise<AdminOrder> {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/update_status/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Захиалгын төлөв шинэчлэхэд алдаа гарлаа');
  }

  return response.json();
}

