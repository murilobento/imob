import { RealEstate } from '@/features/real-estate/data/schema'

// Re-export for site usage
export type Property = RealEstate

// Site-specific utility types
export interface PropertyFilters {
    finality?: 'SALE' | 'RENT' | 'BOTH'
    type?: 'HOUSE' | 'APARTMENT' | 'LAND' | 'COMMERCIAL' | 'RURAL'
    bedrooms?: number
    minPrice?: number
    maxPrice?: number
    city?: string
    neighborhood?: string
    search?: string
}

export interface Testimonial {
    id: number
    name: string
    text: string
    rating: number
    avatar?: string
}

export interface ContactFormData {
    name: string
    phone: string
    email: string
    message: string
    propertyId?: string
}

// Labels for display
export const propertyTypeLabels: Record<string, string> = {
    HOUSE: 'Casa',
    APARTMENT: 'Apartamento',
    LAND: 'Terreno',
    COMMERCIAL: 'Comercial',
    RURAL: 'Rural',
}

export const propertyFinalityLabels: Record<string, string> = {
    SALE: 'Venda',
    RENT: 'Aluguel',
    BOTH: 'Venda/Aluguel',
}

export const propertySituationLabels: Record<string, string> = {
    AVAILABLE: 'Disponível',
    OCCUPIED: 'Ocupado',
    UNAVAILABLE: 'Indisponível',
}
