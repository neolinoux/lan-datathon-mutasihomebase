# Database Setup Guide - Windows

## Prerequisites

1. **Install PostgreSQL**

   - Download dari: <https://www.postgresql.org/download/windows/>
   - Install dengan default settings
   - Note down password untuk user 'postgres'

2. **Install Node.js**
   - Download dari: <https://nodejs.org/>
   - Install dengan default settings

## Setup Database

### 1. Create Database

Buka **pgAdmin** (GUI untuk PostgreSQL) atau **SQL Shell (psql)**:

```sql
-- Connect sebagai superuser
-- Username: postgres
-- Password: [password yang dibuat saat install]

-- Create database
CREATE DATABASE lan_datathon;

-- Verify database created
\l
```

### 2. Environment Configuration

Buat file `.env` di root project:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/lan_datathon"

# JWT
JWT_SECRET="lan-datathon-super-secret-key-2024"
JWT_EXPIRES_IN="7d"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760

# Server
PORT=3000
NODE_ENV="development"
```

**Ganti `YOUR_PASSWORD` dengan password PostgreSQL Anda.**

### 3. Setup Prisma

```bash
# Generate Prisma client
npm run db:generate

# Push schema ke database
npm run db:push
```

### 4. Seed Database

```bash
# Run seed script
npm run db:seed
```

### 5. Verify Setup

```bash
# Open Prisma Studio untuk melihat data
npm run db:studio
```

## Default Users

Setelah seeding, tersedia user default:

| Email                    | Password | Role     | Institution |
| ------------------------ | -------- | -------- | ----------- |
| <admin@lan-datathon.go.id> | admin123 | Admin    | Super Admin |
| <andi@bps.go.id>           | admin123 | Admin    | BPS         |
| <budi@bps.go.id>           | admin123 | Operator | BPS         |
| <citra@bps.go.id>          | admin123 | Viewer   | BPS         |
| <dewi@kemenkeu.go.id>      | admin123 | Admin    | Kemenkeu    |
| <eko@kemendagri.go.id>     | admin123 | Admin    | Kemendagri  |

## Troubleshooting

### Error: "psql is not recognized"

- Install PostgreSQL dengan menambahkan ke PATH
- Atau gunakan pgAdmin untuk database management

### Error: "Connection refused"

- Pastikan PostgreSQL service running
- Check port 5432 tidak digunakan aplikasi lain

### Error: "Authentication failed"

- Check password di DATABASE_URL
- Pastikan user 'postgres' memiliki akses

### Error: "Database does not exist"

- Buat database manual di pgAdmin
- Atau gunakan command: `CREATE DATABASE lan_datathon;`

## Testing API

Setelah setup selesai, test API:

```bash
# Start development server
npm run dev

# Test login (dalam terminal lain)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@lan-datathon.go.id\",\"password\":\"admin123\"}"
```

## Database Schema

### Tables Created

- `users` - User management
- `institutions` - Institution data
- `documents` - Document metadata
- `analysis_results` - Analysis results
- `compliance_indicators` - Compliance metrics

### Sample Data

- 3 Institutions (BPS, Kemenkeu, Kemendagri)
- 6 Users dengan roles berbeda
- 18 Compliance indicators (6 per institution)
