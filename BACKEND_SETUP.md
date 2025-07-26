# Backend Setup Guide - LAN Datathon AI Compliance Assistant

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm atau yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

#### Install PostgreSQL

- Download dan install PostgreSQL dari https://www.postgresql.org/download/
- Buat database baru:

```sql
CREATE DATABASE lan_datathon;
```

#### Setup Prisma

```bash
# Install Prisma CLI
npm install -g prisma

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View database dengan Prisma Studio
npx prisma studio
```

### 3. Environment Configuration

Copy file `env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp env.example .env
```

Edit file `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lan_datathon"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
GOOGLE_AI_API_KEY="your-google-ai-api-key"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760

# Server
PORT=3000
NODE_ENV="development"
```

### 4. Seed Database (Optional)

Jalankan script SQL untuk data awal:

```bash
psql -d lan_datathon -f scripts/setup-db.sql
```

Atau gunakan Prisma seed:

```bash
npx prisma db seed
```

### 5. Create Upload Directory

```bash
mkdir uploads
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru
- `GET /api/auth/me` - Get current user info

### User Management

- `GET /api/users` - Get semua users
- `POST /api/users` - Create user baru
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Document Analysis

- `POST /api/documents/analyze` - Analisis dokumen dengan AI
- `GET /api/documents` - Get semua dokumen
- `GET /api/documents/:id` - Get detail dokumen

### Institutions

- `GET /api/institutions` - Get semua instansi
- `GET /api/institutions/:id` - Get detail instansi

## Default Users

Setelah menjalankan seed script, tersedia user default:

| Email                    | Password | Role     | Institution |
| ------------------------ | -------- | -------- | ----------- |
| admin@lan-datathon.go.id | admin123 | Admin    | Super Admin |
| andi@bps.go.id           | admin123 | Admin    | BPS         |
| budi@bps.go.id           | admin123 | Operator | BPS         |
| citra@bps.go.id          | admin123 | Viewer   | BPS         |
| dewi@kemenkeu.go.id      | admin123 | Admin    | Kemenkeu    |
| eko@kemendagri.go.id     | admin123 | Admin    | Kemendagri  |

## AI Integration

### OpenAI Setup

1. Dapatkan API key dari https://platform.openai.com/
2. Tambahkan ke environment variable `OPENAI_API_KEY`

### Document Analysis Features

- Compliance checking (7 indikator utama)
- Sentiment analysis
- Recommendation generation
- Video learning generation

## File Upload

- Supported formats: PDF, DOC, DOCX, XLS, XLSX
- Max file size: 10MB
- Files stored in `./uploads` directory

## Security Features

- JWT authentication
- Password hashing dengan bcrypt
- Role-based access control
- Institution-based data isolation

## Database Schema

### Tables

- `users` - User management
- `institutions` - Institution data
- `documents` - Uploaded documents
- `analysis_results` - AI analysis results
- `compliance_indicators` - Compliance metrics

### Relationships

- User belongs to Institution
- Document belongs to Institution and User
- AnalysisResult belongs to Document and Institution
- ComplianceIndicator belongs to Institution

## Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Pastikan PostgreSQL running
   - Check DATABASE_URL di .env
   - Run `npx prisma db push`

2. **JWT Error**

   - Set JWT_SECRET di .env
   - Restart server

3. **AI Analysis Error**

   - Check OPENAI_API_KEY
   - Verify API quota

4. **File Upload Error**
   - Create uploads directory
   - Check file permissions

### Logs

Check console logs untuk error details:

```bash
npm run dev
```

## Development

### Adding New API Endpoints

1. Create file di `app/api/[endpoint]/route.ts`
2. Export GET, POST, PUT, DELETE functions
3. Use authentication middleware
4. Add error handling

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update API endpoints

### Testing

```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lan-datathon.go.id","password":"admin123"}'
```
