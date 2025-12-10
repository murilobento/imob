import { z } from 'zod'

export const realEstateSchema = z.object({
    id: z.string().uuid(),
    code: z.string().optional().nullable(),
    title: z.string().min(1, 'Título é obrigatório.'),
    type: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'RURAL']),

    street: z.string().optional().nullable(),
    number: z.string().optional().nullable(),
    complement: z.string().optional().nullable(),
    neighborhood: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    zip: z.string().optional().nullable(),

    finality: z.enum(['SALE', 'RENT', 'BOTH']),
    situation: z.enum(['AVAILABLE', 'OCCUPIED', 'UNAVAILABLE']),

    built_area: z.coerce.number().optional().nullable(),
    total_area: z.coerce.number().optional().nullable(),
    bedrooms: z.coerce.number().optional().nullable(),
    suites: z.coerce.number().optional().nullable(),
    bathrooms: z.coerce.number().optional().nullable(),
    garage_spots: z.coerce.number().optional().nullable(),
    is_furnished: z.boolean().default(false).optional(),

    rental_value: z.coerce.number().optional().nullable(),
    sale_value: z.coerce.number().optional().nullable(),
    condominium_value: z.coerce.number().optional().nullable(),
    iptu_value: z.coerce.number().optional().nullable(),

    owner_id: z.string().uuid().optional().nullable(),
    registry_id: z.string().optional().nullable(),
    registration_id: z.string().optional().nullable(),
    legal_notes: z.string().optional().nullable(),

    photos: z.string().optional().nullable(), // JSON string
    videos: z.string().optional().nullable(), // JSON string
    blueprints: z.string().optional().nullable(), // JSON string

    is_available: z.boolean().default(true),
    owner_name: z.string().optional().nullable(), // From join

    created_at: z.coerce.date().optional().nullable(),
    updated_at: z.coerce.date().optional().nullable(),
})

export type RealEstate = z.infer<typeof realEstateSchema>

export const realEstateListSchema = z.array(realEstateSchema)
