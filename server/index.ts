import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Pool } from 'pg'
import { auth } from './auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

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
        const result = await pool.query('SELECT status FROM "user" WHERE email = $1', [email])
        if (result.rows.length > 0 && result.rows[0].status === 'inactive') {
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
const initUserSchema = async () => {
  try {
    await pool.query('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'active\'')
  } catch {
    // Silently fail user migration
  }
}
initUserSchema().catch(() => {
  // Silently fail schema initialization
})

app.get('/api/users', async (c) => {
  const result = await pool.query(
    'SELECT id, name, email, image, status, "emailVerified", "createdAt", "updatedAt" FROM "user" ORDER BY "createdAt" DESC'
  )
  return c.json(result.rows)
})

app.delete('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  await pool.query('DELETE FROM "session" WHERE "userId" = $1', [id])
  await pool.query('DELETE FROM "user" WHERE id = $1', [id])
  return c.json({ success: true })
})

app.patch('/api/users/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, email, password, status } = body

  // Update user basic info
  const result = await pool.query(
    'UPDATE "user" SET name = $1, email = $2, status = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
    [name, email, status || 'active', id]
  )

  // Update password if provided using better-auth's internal context
  if (password) {
    const ctx = await auth.$context
    const hashedPassword = await ctx.password.hash(password)
    await pool.query(
      'UPDATE "account" SET password = $1 WHERE "userId" = $2 AND "providerId" = $3',
      [hashedPassword, id, 'credential']
    )
  }

  return c.json(result.rows[0])
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

// Initialize Company Settings Table
const initCompanySettings = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS company_settings (
      id SERIAL PRIMARY KEY,
      nome_fantasia TEXT,
      razao_social TEXT,
      cnpj TEXT,
      inscricao_estadual TEXT,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      complemento TEXT,
      bairro TEXT,
      cidade TEXT,
      uf TEXT,
      email TEXT,
      site TEXT,
      telefone TEXT,
      instagram TEXT,
      facebook TEXT,
      tiktok TEXT,
      whatsapp TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `)
  try {
    await pool.query('ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS nome_fantasia TEXT')
    await pool.query('ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS razao_social TEXT')
  } catch {
    // Silently fail company settings migration
  }
}
initCompanySettings().catch(() => {
  // Silently fail company settings initialization
})

app.get('/api/company-settings', async (c) => {
  const result = await pool.query('SELECT * FROM company_settings WHERE id = 1')
  return c.json(result.rows[0] || {})
})

app.post('/api/company-settings', async (c) => {
  const body = await c.req.json()
  const {
    nome_fantasia,
    razao_social,
    cnpj,
    inscricao_estadual,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    uf,
    email,
    site,
    telefone,
    instagram,
    facebook,
    tiktok,
    whatsapp,
  } = body

  const result = await pool.query(
    `INSERT INTO company_settings (id, nome_fantasia, razao_social, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, email, site, telefone, instagram, facebook, tiktok, whatsapp, updated_at)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
     ON CONFLICT (id) DO UPDATE SET
       nome_fantasia = EXCLUDED.nome_fantasia,
       razao_social = EXCLUDED.razao_social,
       cnpj = EXCLUDED.cnpj,
       inscricao_estadual = EXCLUDED.inscricao_estadual,
       cep = EXCLUDED.cep,
       logradouro = EXCLUDED.logradouro,
       numero = EXCLUDED.numero,
       complemento = EXCLUDED.complemento,
       bairro = EXCLUDED.bairro,
       cidade = EXCLUDED.cidade,
       uf = EXCLUDED.uf,
       email = EXCLUDED.email,
       site = EXCLUDED.site,
       telefone = EXCLUDED.telefone,
       instagram = EXCLUDED.instagram,
       facebook = EXCLUDED.facebook,
       tiktok = EXCLUDED.tiktok,
       whatsapp = EXCLUDED.whatsapp,
       updated_at = NOW()
     RETURNING *`,
    [
      nome_fantasia,
      razao_social,
      cnpj,
      inscricao_estadual,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      email,
      site,
      telefone,
      instagram,
      facebook,
      tiktok,
      whatsapp,
    ]
  )
  return c.json(result.rows[0])
})

// Customers API

const initCustomerSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'FISICA' | 'JURIDICA'
      document TEXT, -- CPF or CNPJ
      rg TEXT,
      issuing_organ TEXT,
      state_inscription TEXT,
      phone TEXT,
      alt_phone TEXT,
      email TEXT,
      street TEXT,
      number TEXT,
      complement TEXT,
      neighborhood TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      interest TEXT, -- 'BUY' | 'RENT' | 'SELL'
      property_type TEXT,
      value_range TEXT,
      observations TEXT,
      status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'inactive'
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `)
  try {
    await pool.query("ALTER TABLE customers ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'")
  } catch {
    // Silently fail customer schema migration
  }
}
initCustomerSchema().catch(() => {
  // Silently fail customer schema initialization
})

app.get('/api/customers', async (c) => {
  const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC')
  return c.json(result.rows)
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

  const result = await pool.query(
    `INSERT INTO customers (
      name, type, document, rg, issuing_organ, state_inscription,
      phone, alt_phone, email,
      street, number, complement, neighborhood, city, state, zip,
      interest, property_type, value_range,
      observations, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16,
      $17, $18, $19,
      $20, $21
    ) RETURNING *`,
    [
      name, type, document, rg, issuing_organ, state_inscription,
      phone, alt_phone, email,
      street, number, complement, neighborhood, city, state, zip,
      interest, property_type, value_range,
      observations, status || 'active'
    ]
  )
  return c.json(result.rows[0])
})

app.patch('/api/customers/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const {
    name, type, document, rg, issuing_organ, state_inscription,
    phone, alt_phone, email,
    street, number, complement, neighborhood, city, state, zip,
    interest, property_type, value_range,
    observations, status
  } = body

  const result = await pool.query(
    `UPDATE customers SET
      name = COALESCE($1, name),
      type = COALESCE($2, type),
      document = COALESCE($3, document),
      rg = COALESCE($4, rg),
      issuing_organ = COALESCE($5, issuing_organ),
      state_inscription = COALESCE($6, state_inscription),
      phone = COALESCE($7, phone),
      alt_phone = COALESCE($8, alt_phone),
      email = COALESCE($9, email),
      street = COALESCE($10, street),
      number = COALESCE($11, number),
      complement = COALESCE($12, complement),
      neighborhood = COALESCE($13, neighborhood),
      city = COALESCE($14, city),
      state = COALESCE($15, state),
      zip = COALESCE($16, zip),
      interest = COALESCE($17, interest),
      property_type = COALESCE($18, property_type),
      value_range = COALESCE($19, value_range),
      observations = COALESCE($20, observations),
      status = COALESCE($21, status),
      updated_at = NOW()
    WHERE id = $22 RETURNING *`,
    [
      name, type, document, rg, issuing_organ, state_inscription,
      phone, alt_phone, email,
      street, number, complement, neighborhood, city, state, zip,
      interest, property_type, value_range,
      observations, status,
      id
    ]
  )
  return c.json(result.rows[0])
})

app.delete('/api/customers/:id', async (c) => {
  const id = c.req.param('id')
  await pool.query('DELETE FROM customers WHERE id = $1', [id])
  return c.json({ success: true })
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

const port = 3000
// eslint-disable-next-line no-console
console.log(`Server running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0',
})
