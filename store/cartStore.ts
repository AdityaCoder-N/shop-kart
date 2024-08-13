import { create } from "zustand";
import { ProductType } from "@/types";

interface CartStore {
  cart: ProductType[];
  loading: boolean;
  error: string | null;
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (product: ProductType, userId: string) => Promise<void>;
  removeFromCart: (productId: string, userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  loading: false,
  error: null,

  // Fetch cart from the database
  fetchCart: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      const data = await response.json();
      set({ cart: data.cart, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch cart", loading: false });
    }
  },

  // Add product to the cart and update the database
  addToCart: async (product: ProductType, userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, product }),
      });
      const updatedCart = await response.json();
      set({ cart: updatedCart, loading: false });
    } catch (error) {
      set({ error: "Failed to add to cart", loading: false });
    }
  },

  // Remove product from the cart and update the database
  removeFromCart: async (productId: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });
      const updatedCart = await response.json();
      set({ cart: updatedCart, loading: false });
    } catch (error) {
      set({ error: "Failed to remove from cart", loading: false });
    }
  },
}));
