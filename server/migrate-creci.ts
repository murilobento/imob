import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

async function migrate() {
    const client = await pool.connect()
    try {
        console.log('🔄 Running migration: add_creci_to_company_settings...')

        await client.query(`
      ALTER TABLE company_settings 
      ADD COLUMN IF NOT EXISTS creci VARCHAR(50);
    `)

        console.log('✅ Migration completed successfully!')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        throw error
    } finally {
        client.release()
        await pool.end()
    }
}

migrate()
