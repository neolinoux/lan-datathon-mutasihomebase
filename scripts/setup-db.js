const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupDatabase() {
  console.log('🔧 Setting up database...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // Create tables if they don't exist
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'viewer',
      institution_id INTEGER,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS institutions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      category VARCHAR(255),
      address TEXT,
      phone VARCHAR(100),
      email VARCHAR(255),
      website VARCHAR(255),
      established_year INTEGER,
      total_employees INTEGER,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    console.log('✅ Tables created successfully')

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create default institutions
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

    // Create default users
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

    console.log('✅ Database setup completed successfully!')
    console.log('📋 Default users created:')
    console.log(`   - ${adminSuper.name} (${adminSuper.email}) - ${adminSuper.role}`)
    console.log(`   - ${andiBps.name} (${andiBps.email}) - ${andiBps.role}`)
    console.log(`   - ${budiBps.name} (${budiBps.email}) - ${budiBps.role}`)
    console.log(`   - ${citraBps.name} (${citraBps.email}) - ${citraBps.role}`)
    console.log('🔑 All users have password: admin123')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase() 