import { auth } from '../lib/auth.ts'

const admins = [
  { name: 'IP Associates', email: 'ipassociatesllc@gmail.com', password: 'AboveBeyond2026!' },
  { name: 'Tommy Bletcher', email: 'tommybletcher@gmail.com', password: 'AboveBeyond2026!' },
]

for (const admin of admins) {
  try {
    await auth.api.signUpEmail({
      body: { name: admin.name, email: admin.email, password: admin.password },
    })
    console.log('Created admin:', admin.email)
  } catch (e) {
    const msg = String(e?.message || e)
    if (msg.toLowerCase().includes('exist') || msg.toLowerCase().includes('already')) {
      console.log('Already exists (skipped):', admin.email)
    } else {
      console.error('Failed for', admin.email, '-', msg)
    }
  }
}

process.exit(0)
