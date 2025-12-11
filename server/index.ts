import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth'
import { prisma } from './db'


const app = new Hono()

// Parse allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['http://localhost:5173']

app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return origin
      // Check if origin is in allowed list
      return allowedOrigins.includes(origin) ? origin : null
    },
    credentials: true,
  })
)

app.use('/api/auth/sign-in/email', async (c, next) => {
  if (c.req.method === 'POST') {
    try {
      const clone = c.req.raw.clone()
      const body = await clone.json()
      const { email } = body
      if (email) {
        const user = await prisma.user.findUnique({
          where: { email },
          select: { status: true }
        })
        if (user && user.status === 'inactive') {
          return c.json({ message: "Your account is inactive. Please contact the administrator." }, 403)
        }
      }
    } catch {
      // Silently fail login interception check
    }
  }
  await next()
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

// Users API
// Schema initialization calls removed as they are handled by Prisma

app.get('/api/users', async (c) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    },
    orderBy: { createdAt: 'desc' }
  })
  return c.json(users)
})

app.delete('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  // Prisma handles cascade delete if configured in schema, but for safety/schema alignment:
  // Note: Schema has Cascade delete on session-user relation, so just deleting user is enough.
  await prisma.user.delete({
    where: { id }
  })
  return c.json({ success: true })
})

app.patch('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, email, password, status } = body

  // Update user basic info
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      status: status || 'active',
      updatedAt: new Date()
    }
  })

  // Update password if provided using better-auth's internal context
  if (password) {
    const ctx = await auth.$context
    const hashedPassword = await ctx.password.hash(password)
    // Find account to update - assuming 'credential' provider logic is consistent
    await prisma.account.updateMany({
      where: {
        userId: id,
        providerId: 'credential'
      },
      data: {
        password: hashedPassword
      }
    })
  }

  return c.json(updatedUser)
})

app.post('/api/users', async (c) => {
  const body = await c.req.json()
  const { name, email, password, status } = body
  const ctx = await auth.api.signUpEmail({
    body: { name, email, password, status } as { name: string; email: string; password: string; status?: string },
  })
  return c.json(ctx.user)
})

// Company Settings API

// Company Settings API
// Manual schema initialization removed - usage of Prisma

// Initialize or ensure company settings record exists handled by upsert in POST or check in GET

app.get('/api/company-settings', async (c) => {
  const settings = await prisma.company_settings.findUnique({
    where: { id: 1 }
  })
  return c.json(settings || {})
})

app.post('/api/company-settings', async (c) => {
  const body = await c.req.json()
  const {
    nome_fantasia,
    razao_social,
    cnpj,
    inscricao_estadual,
    creci,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
    email,
    telefone,
    instagram,
    facebook,
    tiktok,
    whatsapp,
    logo,
  } = body

  // Use upsert to create or update the single record (id=1)
  const result = await prisma.company_settings.upsert({
    where: { id: 1 },
    update: {
      nome_fantasia,
      razao_social,
      cnpj,
      inscricao_estadual,
      creci,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      email,
      telefone,
      instagram,
      facebook,
      tiktok,
      whatsapp,
      logo,
      updated_at: new Date()
    },
    create: {
      id: 1,
      nome_fantasia,
      razao_social,
      cnpj,
      inscricao_estadual,
      creci,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      email,
      telefone,
      instagram,
      facebook,
      tiktok,
      whatsapp,
      logo,
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  return c.json(result)
})

// Customers API

// Customers API
// Manual schema initialization removed - usage of Prisma

app.get('/api/customers', async (c) => {
  const result = await prisma.customers.findMany({
    orderBy: { created_at: 'desc' }
  })
  return c.json(result)
})

app.post('/api/customers', async (c) => {
  const body = await c.req.json()
  const {
    name, type, document, rg, issuing_organ, state_inscription,
    phone, alt_phone, email,
    street, number, complement, neighborhood, city, state, zip,
    interest, property_type, value_range,
    observations, status
  } = body

  const customer = await prisma.customers.create({
    data: {
      name, type, document, rg, issuing_organ, state_inscription,
      phone, alt_phone, email,
      street, number, complement, neighborhood, city, state, zip,
      interest, property_type, value_range,
      observations, status: status || 'active',
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  return c.json(customer)
})

app.patch('/api/customers/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at, updated_at, ...updateData } = body

  const customer = await prisma.customers.update({
    where: { id },
    data: {
      ...updateData,
      updated_at: new Date()
    }
  })
  return c.json(customer)
})

app.delete('/api/customers/:id', async (c) => {
  const id = c.req.param('id')
  await prisma.customers.delete({
    where: { id }
  })
  return c.json({ success: true })
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Real Estate API
// Manual schema initialization removed - usage of Prisma

app.get('/api/real-estate/next-code', async (c) => {
  const type = c.req.query('type')
  if (!type) {
    return c.json({ error: 'Type is required' }, 400)
  }

  let prefix = ''
  switch (type) {
    case 'HOUSE':
      prefix = 'CASA'
      break
    case 'APARTMENT':
      prefix = 'AP'
      break
    case 'LAND':
      prefix = 'TER'
      break
    case 'COMMERCIAL':
      prefix = 'COM'
      break
    case 'RURAL':
      prefix = 'RUR'
      break
    default:
      prefix = 'IMO'
  }

  // Use findFirst with orderBy to simulate getting the last code
  const lastProperty = await prisma.real_estate.findFirst({
    where: {
      code: {
        startsWith: `${prefix}-`
      }
    },
    orderBy: {
      code: 'desc'
    },
    select: { code: true }
  })

  let nextNumber = 1
  if (lastProperty && lastProperty.code) {
    const lastCode = lastProperty.code
    const lastNumber = parseInt(lastCode.split('-')[1])
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1
    }
  }

  const nextCode = `${prefix}-${nextNumber.toString().padStart(6, '0')}`
  return c.json({ code: nextCode })
})

app.get('/api/real-estate', async (c) => {
  const realEstates = await prisma.real_estate.findMany({
    include: {
      customers: {
        select: { name: true }
      }
    },
    orderBy: { created_at: 'desc' }
  })

  // Transform result to match expected frontend format
  const formatted = realEstates.map(r => ({
    ...r,
    owner_name: r.customers?.name || null,
    // Ensure Decimal types are converted to number or string if needed, 
    // though Hono/JSON usually handles it. Prisma Decimals might need .toNumber() 
    // if strictly typed on frontend, but for now passing as is.
  }))

  return c.json(formatted)
})

app.post('/api/real-estate', async (c) => {
  const body = await c.req.json()
  const {
    code, title, type,
    street, number, complement, neighborhood, city, state, zip,
    finality, situation,
    built_area, total_area, bedrooms, suites, bathrooms, garage_spots, is_furnished,
    rental_value, sale_value, condominium_value, iptu_value,
    owner_id, registry_id, registration_id, legal_notes,
    photos, videos, blueprints,
    is_available
  } = body

  const realEstate = await prisma.real_estate.create({
    data: {
      code, title, type,
      street, number, complement, neighborhood, city, state, zip,
      finality, situation,
      built_area, total_area, bedrooms, suites, bathrooms, garage_spots, is_furnished,
      rental_value, sale_value, condominium_value, iptu_value,
      owner_id, registry_id, registration_id, legal_notes,
      photos, videos, blueprints,
      is_available: is_available ?? true,
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  return c.json(realEstate)
})

app.patch('/api/real-estate/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, created_at, updated_at, customers, owner_name, ...updateData } = body

  // We need to filter out 'customers' and 'owner_name' as they are not in the table
  // and spread operator includes them if present in body (from previous GET)

  const realEstate = await prisma.real_estate.update({
    where: { id },
    data: {
      ...updateData,
      updated_at: new Date()
    }
  })
  return c.json(realEstate)
})

app.delete('/api/real-estate/:id', async (c) => {
  const id = c.req.param('id')
  await prisma.real_estate.delete({
    where: { id }
  })
  return c.json({ success: true })
})

const port = 3000
// eslint-disable-next-line no-console
console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
})
