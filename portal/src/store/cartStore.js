// src/store/cartStore.js
import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: [],
  addToCart: (product) => {
    set((state) => {
      // Prevent duplicate items
      if (state.items.find((item) => item.id === product.id)) return state
      return { items: [...state.items, { ...product, quantity: 1 }] }
    })
  },
  removeFromCart: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }))
  },
  clearCart: () => set({ items: [] }),
}))

export default useCartStore
