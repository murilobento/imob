import 'dotenv/config'
import { auth } from './auth'

async function seed() {
  // eslint-disable-next-line no-console
  console.log('Creating default user...')

  try {
    const ctx = await auth.api.signUpEmail({
      body: {
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin123',
      },
    })

    // eslint-disable-next-line no-console
    console.log('User created:', ctx.user.email)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating user:', error)
  }

  process.exit(0)
}

seed()
