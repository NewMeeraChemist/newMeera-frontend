export type UserRole = 'customer' | 'admin' | 'pharmacist' | 'super_admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId?: string | null;
  brandId?: string | null;
  mrp: number;
  salePrice: number;
  stockQty: number;
  sku?: string | null;
  requiresPrescription: boolean;
  isActive: boolean;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  sortOrder: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  productNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  addressId?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  createdAt?: string;
}

export interface HealthConcern {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  description?: string | null;
  createdAt?: string;
}

export type PrescriptionStatus = 'pending_review' | 'approved' | 'rejected';

export interface Prescription {
  id: string;
  customerId: string;
  orderId?: string | null;
  fileUrl: string;
  status: PrescriptionStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
}

export interface Address {
  id: string;
  customerId: string;
  label?: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminDashboardStats {
  ordersToday: number;
  revenueToday: number;
  revenueThisWeek: number;
  lowStockCount: number;
  pendingPrescriptionsCount: number;
  lowStockItems: Array<{
    id: string;
    name: string;
    stockQty: number;
    salePrice: number;
  }>;
}
