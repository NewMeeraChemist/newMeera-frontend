import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  requiresPrescription: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentQty = updatedItems[existingIndex].quantity;
            const newQty = Math.min(product.stockQty, currentQty + quantity);
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
            };
            return { items: updatedItems };
          }
          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(product.stockQty, quantity) },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxQty = item.product.stockQty;
              return { ...item, quantity: Math.min(maxQty, quantity) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalCount: () => {
        return get().items.length;
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.salePrice * item.quantity,
          0
        );
      },

      requiresPrescription: () => {
        return get().items.some((item) => item.product.requiresPrescription);
      },
    }),
    {
      name: 'new_meera_chemist_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
