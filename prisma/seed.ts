import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Institutions
  console.log('📊 Creating institutions...')
  const institutions = await Promise.all([
    prisma.institution.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Komisi I',
        full_name: 'Komisi I',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2007,
        total_employees: 1015,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Kemenlu',
        full_name: 'Kementerian Luar Negeri',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2001,
        total_employees: 1578,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'Kemenhan',
        full_name: 'Kementerian Pertahanan',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2018,
        total_employees: 1099,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: 'Komdigi',
        full_name: 'Kementerian Komunikasi dan Digital',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1989,
        total_employees: 1774,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        name: 'BSSN',
        full_name: 'Badan Siber dan Sandi Negara',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2002,
        total_employees: 1043,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        name: 'Bakamla',
        full_name: 'Badan Keamanan Laut',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1998,
        total_employees: 1175,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 7 },
      update: {},
      create: {
        id: 7,
        name: 'Lemhannas',
        full_name: 'Lembaga Ketahanan Nasional',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1980,
        total_employees: 1906,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 8 },
      update: {},
      create: {
        id: 8,
        name: 'Wantannas',
        full_name: 'Dewan Ketahanan Nasional',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2004,
        total_employees: 1034,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 9 },
      update: {},
      create: {
        id: 9,
        name: 'Komisi II',
        full_name: 'Komisi II',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1998,
        total_employees: 1358,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 10 },
      update: {},
      create: {
        id: 10,
        name: 'Kementerian PAN-RB',
        full_name: 'Kementerian PAN-RB',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1992,
        total_employees: 1216,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 11 },
      update: {},
      create: {
        id: 11,
        name: 'Kementerian ATR/BPN',
        full_name: 'Kementerian ATR/BPN',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1980,
        total_employees: 1351,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 12 },
      update: {},
      create: {
        id: 12,
        name: 'Kemendagri',
        full_name: 'Kementerian Dalam Negeri',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1980,
        total_employees: 1307,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 13 },
      update: {},
      create: {
        id: 13,
        name: 'OIKN',
        full_name: 'Otorita Ibu Kota Nusantara',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1986,
        total_employees: 1439,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 14 },
      update: {},
      create: {
        id: 14,
        name: 'KPU',
        full_name: 'Komisi Pemilihan Umum',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2006,
        total_employees: 1346,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 15 },
      update: {},
      create: {
        id: 15,
        name: 'Bawaslu',
        full_name: 'Badan Pengawas Pemilu',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2003,
        total_employees: 1376,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 16 },
      update: {},
      create: {
        id: 16,
        name: 'BKN',
        full_name: 'Badan Kepegawaian Negara',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2009,
        total_employees: 1898,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 17 },
      update: {},
      create: {
        id: 17,
        name: 'LAN',
        full_name: 'Lembaga Administrasi Negara',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 1999,
        total_employees: 1573,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 18 },
      update: {},
      create: {
        id: 18,
        name: 'ANRI',
        full_name: 'Arsip Nasional Republik Indonesia',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2002,
        total_employees: 1865,
        is_active: true
      }
    }),
    prisma.institution.upsert({
      where: { id: 19 },
      update: {},
      create: {
        id: 19,
        name: 'Ombudsman RI',
        full_name: 'Ombudsman RI',
        category: 'Lembaga Pemerintah',
        address: 'Jakarta, Indonesia',
        phone: '0828282xxx',
        email: 'pemerintah@mail.go.id',
        website: 'pemerintah.go.id',
        established_year: 2009,
        total_employees: 1597,
        is_active: true
      }
    })
  ])

  console.log(`✅ Created ${institutions.length} institutions`)

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Seed Users
  console.log('👥 Creating users...')
  const users = await Promise.all([
    // Admin user
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Administrator',
        email: 'admin@example.com',
        password_hash: hashedPassword,
        role: 'admin',
        institution_id: 1, // Komisi I
        is_active: true
      }
    }),
    // Kemenlu users
    prisma.user.upsert({
      where: { email: 'kemenlu.user@example.com' },
      update: {},
      create: {
        name: 'User Kemenlu',
        email: 'kemenlu.user@example.com',
        password_hash: hashedPassword,
        role: 'user',
        institution_id: 2, // Kemenlu
        is_active: true
      }
    }),
    // Kemenhan users
    prisma.user.upsert({
      where: { email: 'kemenhan.user@example.com' },
      update: {},
      create: {
        name: 'User Kemenhan',
        email: 'kemenhan.user@example.com',
        password_hash: hashedPassword,
        role: 'user',
        institution_id: 3, // Kemenhan
        is_active: true
      }
    }),
    // Kemendagri users
    prisma.user.upsert({
      where: { email: 'kemendagri.user@example.com' },
      update: {},
      create: {
        name: 'User Kemendagri',
        email: 'kemendagri.user@example.com',
        password_hash: hashedPassword,
        role: 'user',
        institution_id: 12, // Kemendagri
        is_active: true
      }
    })
  ])

  console.log(`✅ Created ${users.length} users`)

  // Display created data
  console.log('\n📋 Created Data Summary:')
  console.log('Institutions:')
  institutions.forEach(inst => {
    console.log(`  - ${inst.name} (${inst.full_name})`)
  })

  console.log('\nUsers:')
  users.forEach(user => {
    const institution = institutions.find(inst => inst.id === user.institution_id)
    console.log(`  - ${user.name} (${user.email}) - Role: ${user.role} - Institution: ${institution?.name}`)
  })

  console.log('\n🔑 Login Credentials:')
  console.log('All users use password: password123')
  console.log('\nRecommended test accounts:')
  console.log('- Admin: admin@example.com')
  console.log('- Kemenlu User: kemenlu.user@example.com')
  console.log('- Kemenhan User: kemenhan.user@example.com')
  console.log('- Kemendagri User: kemendagri.user@example.com')

  console.log('\n✅ Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 