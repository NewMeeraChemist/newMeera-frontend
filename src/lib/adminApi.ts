import { ApiResponse, Product, Order, Prescription, AdminUser, AdminDashboardStats, Address } from '../types';
import { mockProducts } from './mockData';

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const cleanUrl = envUrl.replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

async function fetchAdminApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || json.message || 'Admin API request failed');
  }

  return json.data as T;
}

export const adminApi = {
  // 0. Verify Status
  async verifyAdminStatus() {
    return await fetchAdminApi<{ isAdmin: boolean; role?: string }>('/admin/verify');
  },

  // 1. Dashboard
  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      return await fetchAdminApi<AdminDashboardStats>('/admin/dashboard/stats');
    } catch {
      return {
        ordersToday: 5,
        revenueToday: 12450.0,
        revenueThisWeek: 84300.0,
        lowStockCount: 2,
        pendingPrescriptionsCount: 1,
        lowStockItems: [
          { id: '1', name: 'Paracetamol 500mg Tablets', stockQty: 4, salePrice: 45.0 },
          { id: '2', name: 'Amoxicillin 250mg Capsules', stockQty: 2, salePrice: 120.0 },
        ],
      };
    }
  },

  // 2. Products
  async getProducts(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAdminApi<{
        products: Product[];
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
      }>(`/admin/products?${query}`);
    } catch {
      return {
        products: mockProducts,
        pagination: { page: 1, pageSize: 10, total: mockProducts.length, totalPages: 1 },
      };
    }
  },

  async createProduct(payload: Record<string, unknown>) {
    return await fetchAdminApi<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProduct(id: string, payload: Record<string, unknown>) {
    return await fetchAdminApi<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async softDeleteProduct(id: string) {
    return await fetchAdminApi<Product>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  async getSignedImageUploadUrl(fileName: string) {
    return await fetchAdminApi<{ signedUploadUrl: string; path: string; publicUrl: string }>(
      '/admin/products/upload-url',
      {
        method: 'POST',
        body: JSON.stringify({ fileName }),
      }
    );
  },

  // 3. Orders
  async getOrders(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAdminApi<{
        orders: Order[];
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
      }>(`/admin/orders?${query}`);
    } catch {
      const mockOrdersList: Order[] = [
        {
          id: 'ord-101',
          orderNumber: 'NMC-2026-8891',
          customerId: 'cust-1',
          status: 'pending',
          subtotal: 450,
          discount: 0,
          shippingFee: 0,
          total: 450,
          paymentStatus: 'pending',
          paymentMethod: 'COD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'ord-102',
          orderNumber: 'NMC-2026-8892',
          customerId: 'cust-2',
          status: 'confirmed',
          subtotal: 1250,
          discount: 50,
          shippingFee: 0,
          total: 1200,
          paymentStatus: 'paid',
          paymentMethod: 'UPI',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      return {
        orders: mockOrdersList,
        pagination: { page: 1, pageSize: 10, total: mockOrdersList.length, totalPages: 1 },
      };
    }
  },

  async getOrderDetail(id: string) {
    return await fetchAdminApi<{
      order: Order;
      items: Array<{ id: string; productNameSnapshot: string; quantity: number; unitPrice: number; totalPrice: number }>;
      shippingAddress: Address | null;
      customerInfo: { id: string; fullName: string; phone?: string } | null;
    }>(`/admin/orders/${id}`);
  },

  async updateOrderStatus(id: string, status: string) {
    return await fetchAdminApi<Order>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // 4. Prescriptions
  async getPrescriptions(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAdminApi<{
        prescriptions: Prescription[];
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
      }>(`/admin/prescriptions?${query}`);
    } catch {
      const mockRx: Prescription[] = [
        {
          id: 'rx-101',
          customerId: 'cust-1',
          orderId: 'ord-101',
          fileUrl: 'cust-1/prescription-rx-101.jpg',
          status: 'pending_review',
          createdAt: new Date().toISOString(),
        },
      ];
      return {
        prescriptions: mockRx,
        pagination: { page: 1, pageSize: 10, total: mockRx.length, totalPages: 1 },
      };
    }
  },

  async getPrescriptionSignedUrl(id: string) {
    return await fetchAdminApi<{ signedUrl: string; filePath: string }>(
      `/admin/prescriptions/${id}/signed-url`
    );
  },

  async reviewPrescription(id: string, status: 'approved' | 'rejected', note?: string) {
    return await fetchAdminApi<Prescription>(`/admin/prescriptions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  // 5. Customers
  async getCustomers(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAdminApi<{
        customers: Array<{ id: string; fullName: string; phone?: string; createdAt: string; orderCount: number }>;
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
      }>(`/admin/customers?${query}`);
    } catch {
      return {
        customers: [
          { id: 'cust-1', fullName: 'Rajesh Sharma', phone: '+91 98765 43210', createdAt: new Date().toISOString(), orderCount: 3 },
          { id: 'cust-2', fullName: 'Priya Patel', phone: '+91 98123 45678', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), orderCount: 1 },
        ],
        pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
      };
    }
  },

  async getCustomerDetail(id: string) {
    return await fetchAdminApi<{
      customer: { id: string; fullName: string; phone?: string; createdAt: string };
      addresses: Address[];
      orders: Array<{ id: string; orderNumber: string; status: string; total: number; paymentMethod: string; createdAt: string }>;
    }>(`/admin/customers/${id}`);
  },

  // 6. Admin Team (super_admin)
  async getAdminUsers(params: Record<string, string> = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await fetchAdminApi<{
        adminUsers: AdminUser[];
        pagination: { page: number; pageSize: number; total: number; totalPages: number };
      }>(`/admin/team?${query}`);
    } catch {
      return {
        adminUsers: [
          { id: 'adm-1', email: 'admin@meerachemist.com', fullName: 'Chief Pharmacist', role: 'super_admin' as const, isActive: true, createdAt: new Date().toISOString() },
          { id: 'adm-2', email: 'staff@meerachemist.com', fullName: 'Fulfillment Staff', role: 'admin' as const, isActive: true, createdAt: new Date().toISOString() },
        ],
        pagination: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
      };
    }
  },

  async inviteAdminUser(payload: { email: string; fullName: string; role: string }) {
    return await fetchAdminApi<AdminUser>('/admin/team/invite', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateAdminUser(id: string, payload: { role?: string; isActive?: boolean }) {
    return await fetchAdminApi<AdminUser>(`/admin/team/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
