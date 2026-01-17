const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types matching the frontend interfaces
export interface ProductOption {
  id: number;
  name: string;
  price_modifier: number;
  final_price: number;
  order: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  title: string;
  image: string;
  price: string;
  original_price?: string;
  store_id: number;
  color_images: string[];
  discount: number;
  discount_percentage?: number;
  selling_price?: number;
  options?: ProductOption[];
  min_price?: number;
  max_price?: number;
  has_options?: boolean;
}

export interface ProductDetail extends Product {
  slug: string;
  description: string;
  store: Store;
  category?: Category;
  sales?: number;
  created_at: string;
  updated_at: string;
  options?: ProductOption[];
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  location: string;
  rating: string;
  review_count: number;
  followers: number;
  sales: number;
  verified: boolean;
  response_time: string;
  delivery_price?: number;
  tags: Array<{ id: number; name: string }>;
  social: {
    facebook: string;
    instagram: string;
    email: string;
    phone: string;
  };
  badges: string[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper function to convert API product to frontend format
export function convertProduct(apiProduct: Product): {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  sellingPrice?: number;
  discountPercentage?: number;
  sales: number;
  colorImages: string[];
  storeId: number;
  minPrice?: number;
  maxPrice?: number;
  hasOptions?: boolean;
} {
  const basePrice = parseFloat(apiProduct.price);
  const discountPercentage = apiProduct.discount_percentage || 0;
  const sellingPrice = apiProduct.selling_price || basePrice;
  const hasOptions = apiProduct.has_options || false;
  const minPrice = apiProduct.min_price;
  const maxPrice = apiProduct.max_price;
  
  return {
    id: apiProduct.id,
    image: apiProduct.image || apiProduct.color_images[0] || '',
    title: apiProduct.title,
    price: basePrice,
    originalPrice: discountPercentage > 0 ? basePrice : undefined,
    sellingPrice: discountPercentage > 0 ? sellingPrice : undefined,
    discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
    sales: (apiProduct as any).sales || 0,
    colorImages: apiProduct.color_images.length > 0 ? apiProduct.color_images : [apiProduct.image || ''],
    storeId: apiProduct.store_id,
    minPrice: minPrice ? parseFloat(minPrice.toString()) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice.toString()) : undefined,
    hasOptions,
  };
}

// API Functions
export async function fetchProducts(params?: {
  storeId?: number;
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  has_discount?: boolean;
  ordering?: string;
  page?: number;
}): Promise<ApiResponse<Product>> {
  const queryParams = new URLSearchParams();
  
  if (params?.storeId) queryParams.append('storeId', params.storeId.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.min_price) queryParams.append('min_price', params.min_price.toString());
  if (params?.max_price) queryParams.append('max_price', params.max_price.toString());
  if (params?.has_discount) queryParams.append('has_discount', 'true');
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const response = await fetch(`${API_BASE_URL}/products/?${queryParams}`, {
    cache: 'no-store', // Always fetch fresh data
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchProduct(idOrSlug: string | number): Promise<ProductDetail> {
  // Try by ID first, then by slug
  const response = await fetch(`${API_BASE_URL}/products/${idOrSlug}/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchStores(params?: {
  search?: string;
  ordering?: string;
}): Promise<ApiResponse<Store>> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  
  const response = await fetch(`${API_BASE_URL}/stores/?${queryParams}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stores: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchStore(slug: string): Promise<Store> {
  const response = await fetch(`${API_BASE_URL}/stores/${slug}/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch store: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchStoreProducts(
  storeSlug: string,
  params?: {
    category?: string;
    search?: string;
    ordering?: string;
  }
): Promise<ApiResponse<Product>> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.ordering) queryParams.append('ordering', params.ordering);
  
  const response = await fetch(`${API_BASE_URL}/stores/${storeSlug}/products/?${queryParams}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch store products: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  const data = await response.json();
  // Handle paginated response (if pagination is enabled)
  if (data && Array.isArray(data.results)) {
    return data.results;
  }
  // Handle direct array response
  if (Array.isArray(data)) {
    return data;
  }
  // Fallback to empty array if unexpected format
  return [];
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/featured/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch featured products: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchProductsOnSale(): Promise<ApiResponse<Product>> {
  const response = await fetch(`${API_BASE_URL}/products/on_sale/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products on sale: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchSimilarProducts(slug: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}/similar/`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch similar products: ${response.statusText}`);
  }
  
  return response.json();
}

export interface OrderItem {
  product_id: number;
  option_id?: number | null;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  store_id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  notes?: string;
  delivery_price: number;
}

export interface OrderResponse {
  success: boolean;
  order: {
    id: number;
    store: number;
    store_name: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    total_amount: string;
    status: string;
    notes: string;
    qpay_invoice_id: string | null;
    qpay_invoice_url: string | null;
    qpay_qr_code: string | null;
    payment_status: string;
    created_at: string;
    updated_at: string;
    items: Array<{
      product_id: number;
      product_title: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
  };
  invoice: {
    invoice_id: string;
    invoice_url: string;
    qr_code: string;
    qr_image?: string; // Base64 encoded QR code image
    urls?: Array<{
      name: string;
      link: string;
      logo?: string;
      description?: string;
    }>; // Payment deep links
  };
}

export async function createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders/create/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to create order: ${response.statusText}`);
  }
  
  return response.json();
}
