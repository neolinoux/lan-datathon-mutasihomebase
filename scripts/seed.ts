import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create institutions
  const bps = await prisma.institution.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'BPS',
      full_name: 'Badan Pusat Statistik',
      category: 'Lembaga Pemerintah Non Kementerian',
      address: 'Jl. Dr. Sutomo No. 6-8, Jakarta Pusat',
      phone: '(021) 3841195',
      email: 'bps@bps.go.id',
      website: 'www.bps.go.id',
      established_year: 1960,
      total_employees: 12450,
      is_active: true
    }
  })

  const kemenkeu = await prisma.institution.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Kemenkeu',
      full_name: 'Kementerian Keuangan',
      category: 'Kementerian',
      address: 'Jl. Lapangan Banteng Timur No. 2-4, Jakarta Pusat',
      phone: '(021) 3449230',
      email: 'humas@kemenkeu.go.id',
      website: 'www.kemenkeu.go.id',
      established_year: 1945,
      total_employees: 8920,
      is_active: true
    }
  })

  const kemendagri = await prisma.institution.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Kemendagri',
      full_name: 'Kementerian Dalam Negeri',
      category: 'Kementerian',
      address: 'Jl. Medan Merdeka Utara No. 7, Jakarta Pusat',
      phone: '(021) 34832556',
      email: 'humas@kemendagri.go.id',
      website: 'www.kemendagri.go.id',
      established_year: 1945,
      total_employees: 6780,
      is_active: true
    }
  })

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 12)

  // Create users
  const adminSuper = await prisma.user.upsert({
    where: { email: 'admin@lan-datathon.go.id' },
    update: {},
    create: {
      name: 'Admin Super',
      email: 'admin@lan-datathon.go.id',
      password_hash: hashedPassword,
      role: 'admin',
      is_active: true
    }
  })

  const andiBps = await prisma.user.upsert({
    where: { email: 'andi@bps.go.id' },
    update: {},
    create: {
      name: 'Andi Setiawan',
      email: 'andi@bps.go.id',
      password_hash: hashedPassword,
      role: 'admin',
      institution_id: bps.id,
      is_active: true
    }
  })

  const budiBps = await prisma.user.upsert({
    where: { email: 'budi@bps.go.id' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'budi@bps.go.id',
      password_hash: hashedPassword,
      role: 'operator',
      institution_id: bps.id,
      is_active: true
    }
  })

  const citraBps = await prisma.user.upsert({
    where: { email: 'citra@bps.go.id' },
    update: {},
    create: {
      name: 'Citra Dewi',
      email: 'citra@bps.go.id',
      password_hash: hashedPassword,
      role: 'viewer',
      institution_id: bps.id,
      is_active: true
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📋 Created users:')
  console.log(`   - ${adminSuper.name} (${adminSuper.email}) - ${adminSuper.role}`)
  console.log(`   - ${andiBps.name} (${andiBps.email}) - ${andiBps.role}`)
  console.log(`   - ${budiBps.name} (${budiBps.email}) - ${budiBps.role}`)
  console.log(`   - ${citraBps.name} (${citraBps.email}) - ${citraBps.role}`)
  console.log('🔑 All users have password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 