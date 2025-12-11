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

// Company Settings type for site
export interface CompanySettings {
    id: number
    nome_fantasia: string | null
    razao_social: string | null
    cnpj: string | null
    inscricao_estadual: string | null
    cep: string | null
    logradouro: string | null
    numero: string | null
    complemento: string | null
    bairro: string | null
    cidade: string | null
    uf: string | null
    email: string | null
    telefone: string | null
    instagram: string | null
    facebook: string | null
    tiktok: string | null
    whatsapp: string | null
    logo: string | null
    creci: string | null
}
