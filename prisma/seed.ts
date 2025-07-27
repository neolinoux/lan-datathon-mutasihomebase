import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface InstansiData {
  id_instansi: number
  nama_instansi: string
  singkatan_instansi: string
  status_lembaga: string
  alamat: string
  no_telp: string
  email: string
  website: string
  tahun_berdiri: string
  total_pegawai: number
  total_peraturan: number
  update_terakhir: string
  total_dokumen: number
  dm_total_dokumen: number
  mean_skor_kepatuhan: number
  dm_mean_skor_kepatuhan: number
  mean_sentiment_positive: number
  dm_mean_sentiment_positive: number
  total_user: number
  dm_total_user: number
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Read instansi.json file
  console.log('📖 Reading instansi.json file...')
  const instansiPath = path.join(process.cwd(), 'instansi.json')
  const instansiData: InstansiData[] = JSON.parse(fs.readFileSync(instansiPath, 'utf-8'))

  console.log(`📊 Found ${instansiData.length} institutions in JSON file`)

  // Seed Institutions
  console.log('📊 Creating institutions...')

  // Create System Admin institution first
  const systemAdminInstitution = await prisma.institution.upsert({
    where: { id: 0 },
    update: {},
    create: {
      id: 0,
      name: 'System Admin',
      full_name: 'System Administrator',
      category: 'System',
      address: 'System',
      phone: '000000000',
      email: 'admin@system.local',
      website: 'system.local',
      established_year: 2024,
      total_employees: 1,
      is_active: true
    }
  })

  // Create all institutions from JSON data
  const institutions = await Promise.all(
    instansiData.map(async (instansi) => {
      // Parse tahun_berdiri to get year
      const tahunBerdiri = instansi.tahun_berdiri.split('/')[2] || '2000'
      const establishedYear = parseInt(tahunBerdiri)

      return prisma.institution.upsert({
        where: { id: instansi.id_instansi },
        update: {},
        create: {
          id: instansi.id_instansi,
          name: instansi.singkatan_instansi,
          full_name: instansi.nama_instansi,
          category: instansi.status_lembaga,
          address: instansi.alamat,
          phone: instansi.no_telp,
          email: instansi.email,
          website: instansi.website,
          established_year: establishedYear,
          total_employees: instansi.total_pegawai,
          is_active: true
        }
      })
    })
  )

  console.log(`✅ Created ${institutions.length + 1} institutions (including System Admin)`)

  // Hash password for users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Seed Users
  console.log('👥 Creating users...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 1,
      name: 'Administrator',
      email: 'admin@example.com',
      password_hash: hashedPassword,
      role: 'admin',
      institution_id: 0,
      is_active: true
    }
  })

  // Create users for each institution
  const users = await Promise.all(
    instansiData.map(async (instansi, index) => {
      const userId = index + 2 // Start from 2 since admin is 1
      const email = `user.${instansi.singkatan_instansi.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`

      return prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          id: userId,
          name: `User ${instansi.singkatan_instansi}`,
          email,
          password_hash: hashedPassword,
          role: 'user',
          institution_id: instansi.id_instansi,
          is_active: true
        }
      })
    })
  )

  console.log(`✅ Created ${users.length + 1} users (including Admin)`)

  console.log('🎉 Database seeding completed!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@example.com / password123')
  console.log('Users: user.[singkatan_instansi]@example.com / password123')
  console.log(`\n📊 Total Data Created:`)
  console.log(`- Institutions: ${institutions.length + 1}`)
  console.log(`- Users: ${users.length + 1}`)
  console.log(`- Admin: 1`)
  console.log(`- Regular Users: ${users.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 