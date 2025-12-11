import axios from 'axios'
import type { RealEstate } from '@/features/real-estate/data/schema'
import type { PropertyFilters } from '../types'

const API_BASE = import.meta.env.VITE_API_URL || ''

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

// Get available properties for public site
export async function getPublicProperties(
    filters: PropertyFilters = {},
    page = 1,
    limit = 12
): Promise<PaginatedResponse<RealEstate>> {
    const params = new URLSearchParams()

    params.set('page', String(page))
    params.set('limit', String(limit))
    params.set('is_available', 'true')

    if (filters.finality && filters.finality !== 'BOTH') {
        params.set('finality', filters.finality)
    }
    if (filters.type) {
        params.set('type', filters.type)
    }
    if (filters.bedrooms) {
        params.set('bedrooms', String(filters.bedrooms))
    }
    if (filters.minPrice) {
        params.set('minPrice', String(filters.minPrice))
    }
    if (filters.maxPrice) {
        params.set('maxPrice', String(filters.maxPrice))
    }
    if (filters.city) {
        params.set('city', filters.city)
    }
    if (filters.search) {
        params.set('search', filters.search)
    }

    const response = await axios.get(`${API_BASE}/api/real-estate?${params.toString()}`)

    // Handle both direct array and paginated response
    if (Array.isArray(response.data)) {
        return {
            data: response.data.filter((p: RealEstate) => p.is_available),
            total: response.data.length,
            page: 1,
            limit: response.data.length,
            totalPages: 1,
        }
    }

    return response.data
}

// Get featured properties for homepage
export async function getFeaturedProperties(limit = 3): Promise<RealEstate[]> {
    const response = await getPublicProperties({}, 1, limit)
    return response.data
}

// Get property details by ID
export async function getPropertyById(id: string): Promise<RealEstate | null> {
    try {
        const response = await axios.get(`${API_BASE}/api/real-estate/${id}`)
        return response.data
    } catch {
        return null
    }
}

// Get similar properties
export async function getSimilarProperties(
    property: RealEstate,
    limit = 4
): Promise<RealEstate[]> {
    const response = await getPublicProperties(
        {
            type: property.type,
            finality: property.finality,
        },
        1,
        limit + 1
    )

    // Exclude current property
    return response.data.filter((p) => p.id !== property.id).slice(0, limit)
}
