import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestCartProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
}

export interface GuestCartItem {
  productId: string;
  quantity: number;
  product: GuestCartProduct;
}

interface CartStore {
  items: GuestCartItem[];
  addItem: (product: GuestCartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useGuestCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { productId: product.id, quantity, product }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'guest-cart' }
  )
);
