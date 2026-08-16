import { ApiResponse, Product, Category, Brand, HealthConcern, Order, Address } from '../types';
import { mockProducts, mockCategories, mockBrands, mockConcerns } from './mockData';

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If token is stored in localStorage, attach Authorization header
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  // Use short 5s revalidation for public catalog to make link navigation instant while keeping DB data fresh
  const isAuthOrMutation =
    endpoint.includes('/me') ||
    endpoint.includes('/orders') ||
    endpoint.includes('/auth') ||
    options.method === 'POST' ||
    options.method === 'PUT' ||
    options.method === 'DELETE';

  const response = await fetch(url, {
    ...options,
    ...(isAuthOrMutation ? { cache: 'no-store' } : { next: { revalidate: 5 } }),
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'API request failed');
  }

  return json.data as T;
}

export const api = {
  // Auth Signup & Login
  async signup(payload: { email: string; password: string; fullName?: string }) {
    return await fetchApi<{ userId: string; email: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: { email: string; password: string }) {
    return await fetchApi<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Public Catalog
  async getProducts(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchApi<{
        products: Product[];
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
      }>(`/products?${query}`);
    } catch (err) {
      console.warn('API fetch failed, fallback to mock products:', err);
      return {
        products: mockProducts,
        pagination: { page: 1, pageSize: 12, total: mockProducts.length, totalPages: 1 },
      };
    }
  },

  async getProductBySlug(slug: string) {
    try {
      return await fetchApi<{
        product: Product;
        images: Array<{ id: string; imageUrl: string; sortOrder: number }>;
        reviews: Array<{ id: string; rating: number; comment?: string; createdAt: string }>;
        ratingSummary: { averageRating: number; totalReviews: number };
        relatedProducts: Product[];
      }>(`/products/${slug}`);
    } catch (err) {
      console.warn('API fetch failed, fallback to mock product detail:', err);
      const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];
      return {
        product,
        images: [{ id: '1', imageUrl: product.thumbnailUrl || '', sortOrder: 0 }],
        reviews: [
          { id: '1', rating: 5, comment: 'Authentic medicine, fast 24-hour delivery!', createdAt: new Date().toISOString() },
          { id: '2', rating: 4, comment: 'Great packaging and good discount.', createdAt: new Date().toISOString() },
        ],
        ratingSummary: { averageRating: 4.8, totalReviews: 24 },
        relatedProducts: mockProducts.filter((p) => p.id !== product.id).slice(0, 4),
      };
    }
  },

  async getCategories() {
    try {
      return await fetchApi<Category[]>('/categories');
    } catch {
      return mockCategories;
    }
  },

  async getCategoryBySlug(slug: string) {
    try {
      return await fetchApi<Category>(`/categories/${slug}`);
    } catch {
      return mockCategories.find((c) => c.slug === slug) || mockCategories[0];
    }
  },

  async getBrands() {
    try {
      return await fetchApi<Brand[]>('/brands');
    } catch {
      return mockBrands;
    }
  },

  async getConcerns() {
    try {
      return await fetchApi<HealthConcern[]>('/concerns');
    } catch {
      return mockConcerns;
    }
  },

  // Authenticated Customer Profile & Orders
  async getProfile() {
    return await fetchApi<{ id: string; email: string; fullName: string; phone?: string }>('/me');
  },

  async getAddresses() {
    return await fetchApi<Address[]>('/me/addresses');
  },

  async createAddress(addressData: Partial<Address>) {
    return await fetchApi<Address>('/me/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  async createOrder(payload: { items: Array<{ productId: string; quantity: number }>; addressId: string; prescriptionId?: string; paymentMethod?: string }) {
    return await fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
