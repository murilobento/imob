import axios from 'axios'
import { type Customer } from '../data/schema'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const callApi = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: unknown
): Promise<T> => {
  const response = await axios({
    method,
    url: `${baseUrl}/api${url}`,
    data,
    withCredentials: true,
  })
  return response.data
}

export const getCustomers = async (): Promise<Customer[]> => {
  return callApi<Customer[]>('GET', '/customers')
}

export const createCustomer = async (
  data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
): Promise<Customer> => {
  return callApi<Customer>('POST', '/customers', data)
}

export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  return callApi<Customer>('PATCH', `/customers/${id}`, data)
}

export const deleteCustomer = async (id: string): Promise<void> => {
  return callApi<void>('DELETE', `/customers/${id}`)
}
