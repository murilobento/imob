import axios from 'axios'
import { type RealEstate } from '../data/schema'

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

export const getRealEstates = async (): Promise<RealEstate[]> => {
    return callApi<RealEstate[]>('GET', '/real-estate')
}

export const getNextCode = async (type: string): Promise<{ code: string }> => {
    return callApi<{ code: string }>('GET', `/real-estate/next-code?type=${type}`)
}

export const createRealEstate = async (data: Partial<RealEstate>): Promise<RealEstate> => {
    return callApi<RealEstate>('POST', '/real-estate', data)
}

export const updateRealEstate = async (id: string, data: Partial<RealEstate>): Promise<RealEstate> => {
    return callApi<RealEstate>('PATCH', `/real-estate/${id}`, data)
}

export const deleteRealEstate = async (id: string): Promise<void> => {
    return callApi<void>('DELETE', `/real-estate/${id}`)
}
