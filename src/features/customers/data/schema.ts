import { z } from 'zod'

export const customerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Nome é obrigatório.'),
    type: z.enum(['FISICA', 'JURIDICA']).default('FISICA'),
    document: z.string().optional(), // CPF or CNPJ
    rg: z.string().optional(),
    issuing_organ: z.string().optional(),
    state_inscription: z.string().optional(),
    phone: z.string().optional(),
    alt_phone: z.string().optional(),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    interest: z.string().optional(), // Stored as comma-separated string
    property_type: z.string().optional(),
    value_range: z.string().optional(),
    observations: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
})

export type Customer = z.infer<typeof customerSchema>

export const customerListSchema = z.array(customerSchema)
