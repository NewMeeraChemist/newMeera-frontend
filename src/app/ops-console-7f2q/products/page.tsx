'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  Upload,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [stockStatus, setStockStatus] = useState<'all' | 'low_stock' | 'out_of_stock' | 'in_stock'>('all');
  const [isActiveFilter, setIsActiveFilter] = useState<'all' | 'true' | 'false'>('true');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Form Fields
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mrp: '',
    salePrice: '',
    stockQty: '',
    requiresPrescription: false,
    thumbnailUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = useCallback(async (page: number = pagination.page) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        pageSize: '10',
      };
      if (search) params.search = search;
      if (stockStatus !== 'all') params.stockStatus = stockStatus;
      if (isActiveFilter !== 'all') params.isActive = isActiveFilter;

      const res = await adminApi.getProducts(params);
      setProducts(res.products);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, stockStatus, isActiveFilter]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setImageMode('upload');
    setFormData({
      name: '',
      description: '',
      mrp: '100',
      salePrice: '90',
      stockQty: '50',
      requiresPrescription: false,
      thumbnailUrl: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setImageMode(product.thumbnailUrl ? 'url' : 'upload');
    setFormData({
      name: product.name,
      description: product.description || '',
      mrp: product.mrp.toString(),
      salePrice: product.salePrice.toString(),
      stockQty: product.stockQty.toString(),
      requiresPrescription: product.requiresPrescription,
      thumbnailUrl: product.thumbnailUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    // Instant local preview for immediate feedback on UI
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);

    try {
      // Fetch signed upload URL or public URL helper from API
      const res = await adminApi.getSignedImageUploadUrl(file.name);

      if (res.signedUploadUrl) {
        await fetch(res.signedUploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });
        setFormData((prev) => ({ ...prev, thumbnailUrl: res.publicUrl }));
      }
    } catch (err) {
      console.error('Failed remote upload, keeping local preview:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.salePrice || !formData.stockQty) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        mrp: parseFloat(formData.mrp) || parseFloat(formData.salePrice),
        salePrice: parseFloat(formData.salePrice),
        stockQty: parseInt(formData.stockQty) || 0,
        requiresPrescription: formData.requiresPrescription,
        thumbnailUrl: formData.thumbnailUrl,
      };

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }

      setIsModalOpen(false);
      fetchProducts(pagination.page);
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product. Please check input values.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!deleteConfirmProduct) return;
    try {
      await adminApi.softDeleteProduct(deleteConfirmProduct.id);
      setDeleteConfirmProduct(null);
      fetchProducts(pagination.page);
    } catch (err) {
      console.error('Soft delete failed:', err);
      alert('Failed to soft delete product.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Products & Inventory Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage medicines, OTC catalog, prices, and stock control</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Stock Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full sm:w-auto"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt; 10)</option>
            <option value="low_stock">Low Stock (1 - 10)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Active Filter */}
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full sm:w-auto"
          >
            <option value="true">Active Products</option>
            <option value="false">Soft-Deleted Products</option>
            <option value="all">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">MRP / Sale Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Prescription</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {product.thumbnailUrl ? (
                          <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{product.description || 'No description'}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">₹{product.salePrice}</div>
                      {product.mrp > product.salePrice && (
                        <div className="text-[11px] text-slate-400 line-through">₹{product.mrp}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          product.stockQty <= 0
                            ? 'bg-red-100 text-red-700'
                            : product.stockQty <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.stockQty} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      {product.requiresPrescription ? (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[11px] font-semibold">
                          Rx Required
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">OTC</span>
                      )}
                    </td>
                    <td className="p-4">
                      {product.isActive ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold text-[11px]">
                          Inactive (Soft-Deleted)
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {product.isActive && (
                          <button
                            onClick={() => setDeleteConfirmProduct(product)}
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition"
                            title="Soft Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-side Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing Page <span className="font-bold text-slate-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-slate-900">{pagination.totalPages || 1}</span> ({pagination.total} total products)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchProducts(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchProducts(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Paracetamol 500mg Tablets"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product usage instructions and composition..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Prescription Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-semibold text-slate-900">Requires Doctor Prescription (Rx)</div>
                  <div className="text-[11px] text-slate-500">Customer must upload prescription note to purchase</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requiresPrescription}
                  onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })}
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
              </div>

              {/* Product Image Option: Upload Device File OR Paste Image Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 block">Product Image</label>
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition ${
                        imageMode === 'upload'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition ${
                        imageMode === 'url'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Image Link (URL)
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {uploadingImage && <span className="text-slate-400 text-xs animate-pulse">Uploading...</span>}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="Paste image URL link (e.g. https://images.unsplash.com/...)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-teal-500 text-xs"
                    />
                  </div>
                )}

                {/* Live Image Preview (Shows image on UI for BOTH file upload and URL input) */}
                {formData.thumbnailUrl && (
                  <div className="mt-2.5 p-2 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative w-12 h-12 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={formData.thumbnailUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.opacity = '0.3';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 block">Image Preview</span>
                        <span className="text-[10px] text-slate-400 truncate block max-w-xs">{formData.thumbnailUrl}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                      title="Clear image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Soft Delete Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Confirm Soft Delete</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to soft-delete <span className="font-bold text-slate-900">{deleteConfirmProduct.name}</span>?
              This will set <code className="bg-slate-100 px-1 py-0.5 rounded">is_active = false</code> and preserve order history.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Confirm Soft Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
