/* eslint-disable no-console */
import { prisma } from '../db'
import { auth } from '../auth'

async function main() {
    console.log('🌱 Starting seed...')

    // Clean the database
    console.log('🧹 Cleaning database...')
    await prisma.real_estate.deleteMany()
    await prisma.customers.deleteMany()
    await prisma.session.deleteMany()
    await prisma.account.deleteMany()
    await prisma.user.deleteMany()
    await prisma.company_settings.deleteMany()
    await prisma.verification.deleteMany()

    // Create Admin User
    console.log('👤 Creating admin user...')
    const email = 'admin@admin.com'
    const password = 'admin123'
    const name = 'Admin User'

    const ctx = await auth.$context
    const hashedPassword = await ctx.password.hash(password)

    const user = await prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            email,
            name,
            emailVerified: true,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            account: {
                create: [{
                    id: email, // Prisma schema says id string @id. Assuming we need to provide it? Or is it auto? Schema says just @id string. Better-auth usually uses UUIDs or specific IDs. Let's use simple string for seed.
                    providerId: 'credential',
                    accountId: email,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }]
            }
        }
    })

    // Initialize Company Settings
    console.log('🏢 Initializing company settings...')
    await prisma.company_settings.create({
        data: {
            id: 1,
            nome_fantasia: 'Imobiliária Modelo',
            razao_social: 'Imobiliária Modelo Ltda',
            cnpj: '00.000.000/0001-00',
            email: 'contato@imobmodelo.com',
            telefone: '(00) 0000-0000',
            logradouro: 'Rua Exemplo',
            numero: '123',
            bairro: 'Centro',
            cidade: 'Cidade Modelo',
            uf: 'SP',
            cep: '00000-000',
            created_at: new Date(),
            updated_at: new Date()
        }
    })

    console.log(`✅ Seed finished.`)
    console.log(`   User created: ${user.email} / ${password}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
