# Backend API Documentation

## Struktur API untuk LAN Datathon - AI Compliance Assistant

### Base URL

```bash
http://localhost:3000/api
```

### Authentication

Semua endpoint memerlukan authentication menggunakan JWT token di header:

```text
Authorization: Bearer <token>
```

### Endpoints

#### 1. Authentication

- `POST /auth/login` - Login user
- `POST /auth/register` - Register user baru
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

#### 2. Institution Management

- `GET /institutions` - Get semua instansi
- `GET /institutions/:id` - Get detail instansi
- `POST /institutions` - Create instansi baru
- `PUT /institutions/:id` - Update instansi
- `DELETE /institutions/:id` - Delete instansi

#### 3. User Management

- `GET /users` - Get semua users
- `GET /users/:id` - Get detail user
- `POST /users` - Create user baru
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PUT /users/:id/role` - Update role user

#### 4. Document Analysis

- `POST /documents/upload` - Upload dokumen
- `POST /documents/analyze` - Analisis dokumen dengan AI
- `GET /documents` - Get semua dokumen
- `GET /documents/:id` - Get detail dokumen
- `GET /documents/institution/:institutionId` - Get dokumen per instansi
- `DELETE /documents/:id` - Delete dokumen

#### 5. Analysis History

- `GET /analysis/history` - Get riwayat analisis
- `GET /analysis/history/:id` - Get detail analisis
- `GET /analysis/history/institution/:institutionId` - Get riwayat per instansi

#### 6. Compliance Indicators

- `GET /compliance/indicators` - Get indikator compliance
- `GET /compliance/indicators/institution/:institutionId` - Get compliance per instansi
- `POST /compliance/indicators/calculate` - Hitung compliance baru

#### 7. AI Services

- `POST /ai/analyze-document` - Analisis dokumen dengan AI
- `POST /ai/sentiment-analysis` - Analisis sentimen
- `POST /ai/generate-recommendations` - Generate rekomendasi
- `POST /ai/generate-video` - Generate video pembelajaran

### Database Schema

#### Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'operator', 'viewer') DEFAULT 'viewer',
  institution_id INTEGER REFERENCES institutions(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Institutions

```sql
CREATE TABLE institutions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  founded_year INTEGER,
  total_employees INTEGER,
  total_documents INTEGER,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Documents

```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  institution_id INTEGER REFERENCES institutions(id),
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Analysis Results

```sql
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id),
  institution_id INTEGER REFERENCES institutions(id),
  analysis_type ENUM('compliance', 'sentiment', 'recommendation'),
  result_data JSONB,
  ai_model_used VARCHAR(100),
  processing_time INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Compliance Indicators

```sql
CREATE TABLE compliance_indicators (
  id SERIAL PRIMARY KEY,
  institution_id INTEGER REFERENCES institutions(id),
  indicator_name VARCHAR(255),
  indicator_type ENUM('document', 'sentiment'),
  sangat_sesuai INTEGER DEFAULT 0,
  sebagian_sesuai INTEGER DEFAULT 0,
  tidak_sesuai INTEGER DEFAULT 0,
  none_count INTEGER DEFAULT 0,
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lan_datathon

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=your-openai-key
GOOGLE_AI_API_KEY=your-google-ai-key

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Server
PORT=3000
NODE_ENV=development

```
