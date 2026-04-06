import { create } from 'zustand'

/**
 * Main app store using Zustand
 * Handles: auth state, user info, cart, theme
 */
export const useStore = create((set, get) => ({
  // Auth State
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  token: localStorage.getItem('auth_token'),
  role: localStorage.getItem('user_role') || 'customer',

  // Theme State
  isDarkMode: localStorage.getItem('theme') === 'dark' || false,

  // Cart State
  cart: [],
  cartTotal: 0,

  // Loading State
  isLoading: false,

  // Error State
  error: null,

  // Site Settings State
  siteSettings: null,

  // Auth Actions
  setAuth: (user, token, role = 'customer') =>
    set(() => {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('user_role', role)
      return {
        user,
        token,
        isAuthenticated: true,
        role,
        error: null,
      }
    }),

  logout: () =>
    set(() => {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('user_role')
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        role: 'customer',
        cart: [],
        error: null,
      }
    }),

  clearError: () => set({ error: null }),

  setError: (error) => set({ error }),

  // Theme Actions
  toggleTheme: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
      if (newDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      return { isDarkMode: newDarkMode }
    }),

  setTheme: (isDark) =>
    set((state) => {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      return { isDarkMode: isDark }
    }),

  // Cart Actions
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id)
      let newCart

      if (existingItem) {
        newCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }]
      }

      const total = newCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      return { cart: newCart, cartTotal: total }
    }),

  removeFromCart: (productId) =>
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== productId)
      const total = newCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      return { cart: newCart, cartTotal: total }
    }),

  updateCartItem: (productId, quantity) =>
    set((state) => {
      const newCart = state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
      const total = newCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
      return { cart: newCart, cartTotal: total }
    }),

  clearCart: () => set({ cart: [], cartTotal: 0 }),

  // Loading Actions
  setLoading: (isLoading) => set({ isLoading }),

  // Site Settings Actions
  setSiteSettings: (settings) => set({ siteSettings: settings }),
}))

export default useStore
