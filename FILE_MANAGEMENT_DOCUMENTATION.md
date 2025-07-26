# 📁 File Management Documentation

## Overview

Fitur Manajemen File memungkinkan pengguna untuk mengunggah, melihat, mengedit, dan menghapus dokumen dengan antarmuka yang user-friendly dan aman.

## 🏗️ Architecture

### Backend Components

- **API Routes**: `/api/documents/upload`, `/api/documents/[id]`
- **Database**: Prisma schema dengan model `Document`
- **File Storage**: Local storage di `public/uploads/`

### Frontend Components

- **Pages**: `/manajemen-file`
- **Components**:
  - `UploadDocumentModal`
  - `DocumentPreview`
  - `EditDocumentModal`
  - `DownloadDocument`
  - `DeleteDocumentModal`

## 📋 API Endpoints

### 1. Upload Document

```http
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:**

- `file`: File dokumen (PDF, Word, Excel)
- `title`: Judul dokumen
- `description`: Deskripsi dokumen
- `institutionId`: ID instansi

**Response:**

```json
{
  "message": "File uploaded successfully",
  "document": {
    "id": 1,
    "title": "Laporan Keuangan 2024",
    "description": "Laporan keuangan tahunan",
    "filename": "laporan-2024.pdf",
    "file_path": "/uploads/1234567890_laporan-2024.pdf",
    "file_size": 2048576,
    "file_type": "application/pdf",
    "institution": { "id": 1, "name": "BPS" },
    "uploaded_by_user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2. Get Documents

```http
GET /api/documents?institutionId=1
Authorization: Bearer <token>
```

### 3. Get Single Document

```http
GET /api/documents/1
Authorization: Bearer <token>
```

### 4. Update Document

```http
PUT /api/documents/1
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### 5. Delete Document

```http
DELETE /api/documents/1
Authorization: Bearer <token>
```

## 🔧 Components

### UploadDocumentModal

Modal untuk mengunggah dokumen baru dengan validasi file dan form.

**Props:**

- `onUploadSuccess`: Callback setelah upload berhasil
- `institutionId`: ID instansi untuk dokumen

**Features:**

- File type validation (PDF, Word, Excel)
- File size validation (max 10MB)
- Form validation
- Loading states
- Error handling

### DocumentPreview

Modal untuk preview dokumen dengan informasi lengkap.

**Props:**

- `document`: Object dokumen

**Features:**

- File metadata display
- File type icons
- Download functionality
- Responsive design

### EditDocumentModal

Modal untuk mengedit metadata dokumen.

**Props:**

- `document`: Object dokumen
- `onEditSuccess`: Callback setelah edit berhasil

**Features:**

- Form pre-population
- Validation
- Read-only file info
- Loading states

### DownloadDocument

Button component untuk download dokumen.

**Props:**

- `document`: Object dokumen dengan minimal properties

**Features:**

- Loading state
- Direct download
- Error handling

### DeleteDocumentModal

Modal konfirmasi untuk menghapus dokumen.

**Props:**

- `document`: Object dokumen
- `onDeleteSuccess`: Callback setelah delete berhasil

**Features:**

- Confirmation dialog
- Warning message
- Loading state
- Error handling

## 🗄️ Database Schema

```prisma
model Document {
  id             Int      @id @default(autoincrement())
  title          String
  description    String?
  filename       String
  file_path      String
  file_size      Int?
  file_type      String?
  institution_id Int
  uploaded_by    Int
  created_at     DateTime @default(now())

  // Relations
  institution      Institution      @relation(fields: [institution_id], references: [id])
  uploaded_by_user User             @relation(fields: [uploaded_by], references: [id])
  analysis_results AnalysisResult[]

  @@map("documents")
}
```

## 🔒 Security Features

### Authentication

- Semua endpoint memerlukan JWT token
- Token validation di setiap request

### Authorization

- Role-based access control
- User hanya bisa akses dokumen instansi mereka
- Admin bisa akses semua dokumen

### File Validation

- File type validation (PDF, Word, Excel)
- File size limit (10MB)
- Secure filename generation
- Path traversal protection

## 📁 File Storage

### Structure

```bash
public/
  uploads/
    .gitkeep
    1234567890_document.pdf
    1234567891_report.docx
    ...
```

### Security

- Files disimpan di `public/uploads/`
- Filename di-generate dengan timestamp untuk uniqueness
- Original filename disimpan di database
- `.gitignore` mengabaikan uploaded files tapi tracking directory

## 🎨 UI/UX Features

### Responsive Design

- Mobile-friendly layout
- Collapsible sidebar
- Responsive table

### User Experience

- Loading states
- Error messages
- Success feedback
- Confirmation dialogs
- Search and filter functionality

### Accessibility

- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast support

## 🚀 Usage

### 1. Upload Document

1. Klik "Upload Dokumen" button
2. Isi judul dan deskripsi
3. Pilih file (PDF/Word/Excel, max 10MB)
4. Klik "Upload Dokumen"

### 2. View Documents

1. Navigasi ke halaman "Manajemen File"
2. Gunakan search untuk mencari dokumen
3. Gunakan filter untuk filter berdasarkan tipe file
4. Klik "Preview" untuk melihat detail dokumen

### 3. Edit Document

1. Klik "Edit" pada dokumen
2. Update judul dan/atau deskripsi
3. Klik "Simpan Perubahan"

### 4. Download Document

1. Klik "Download" pada dokumen
2. File akan otomatis terdownload

### 5. Delete Document

1. Klik "Hapus" pada dokumen
2. Konfirmasi penghapusan
3. Klik "Hapus Dokumen"

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### File Type Configuration

```typescript
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
```

## 🐛 Troubleshooting

### Common Issues

1. **File Upload Fails**

   - Check file size (max 10MB)
   - Check file type (PDF, Word, Excel only)
   - Check disk space
   - Check permissions on uploads directory

2. **Download Not Working**

   - Check file exists in uploads directory
   - Check file permissions
   - Check browser download settings

3. **Permission Denied**
   - Check user role and institution access
   - Check JWT token validity
   - Check database permissions

### Error Codes

- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (document doesn't exist)
- `500`: Internal Server Error

## 📈 Future Enhancements

### Planned Features

- [ ] Cloud storage integration (AWS S3, Google Cloud Storage)
- [ ] File versioning
- [ ] Bulk operations (upload, delete)
- [ ] File sharing between institutions
- [ ] Advanced search with full-text search
- [ ] File preview for more formats
- [ ] File compression
- [ ] Virus scanning integration

### Performance Optimizations

- [ ] File upload progress indicator
- [ ] Lazy loading for large document lists
- [ ] Image thumbnails for documents
- [ ] Caching for frequently accessed files
- [ ] CDN integration for file delivery
