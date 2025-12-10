import { z } from 'zod'

export const realEstateSchema = z.object({
    id: z.string().uuid(),
    code: z.string().optional(),
    title: z.string().min(1, 'Título é obrigatório.'),
    type: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'RURAL']),

    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),

    finality: z.enum(['SALE', 'RENT', 'BOTH']),
    situation: z.enum(['AVAILABLE', 'OCCUPIED', 'UNAVAILABLE']),

    built_area: z.coerce.number().optional(),
    total_area: z.coerce.number().optional(),
    bedrooms: z.coerce.number().optional(),
    suites: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    garage_spots: z.coerce.number().optional(),
    is_furnished: z.boolean().default(false).optional(),

    rental_value: z.coerce.number().optional(),
    sale_value: z.coerce.number().optional(),
    condominium_value: z.coerce.number().optional(),
    iptu_value: z.coerce.number().optional(),

    owner_id: z.string().uuid().optional(),
    registry_id: z.string().optional(),
    registration_id: z.string().optional(),
    legal_notes: z.string().optional(),

    photos: z.string().optional(), // JSON string
    videos: z.string().optional(), // JSON string
    blueprints: z.string().optional(), // JSON string

    is_available: z.boolean().default(true),
    owner_name: z.string().optional(), // From join

    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
})

export type RealEstate = z.infer<typeof realEstateSchema>

export const realEstateListSchema = z.array(realEstateSchema)
