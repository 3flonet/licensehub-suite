// src/services/productService.js
import apiClient from '../config/apiClient'

export const getProducts = async () => {
  const response = await apiClient.get('/products')
  return response.data
}

export const getProduct = async (id) => {
  const response = await apiClient.get(`/products/${id}`)
  return response.data
}

export const createOrder = async (payload) => {
  const response = await apiClient.post('/portal/orders', payload)
  return response.data
}

export const getSnapToken = async (planId, promoCode = null) => {
  const payload = { plan_id: planId }
  if (promoCode) payload.promo_code = promoCode
  const response = await apiClient.post('/portal/payments/snap-token', payload)
  return response.data
}

export const validatePromo = async (payload) => {
  const response = await apiClient.post('/promos/validate', payload)
  return response.data
}

export const getFaqs = async () => {
  const response = await apiClient.get('/faqs')
  return response.data
}

// Add more storefront-related API calls as needed
