# 👥 User Management Documentation

## Overview

Fitur Manajemen Pengguna memungkinkan admin untuk mengelola pengguna sistem dengan operasi CRUD lengkap, termasuk pengaturan role, instansi, dan status akun.

## 🏗️ Architecture

### Backend Components

- **API Routes**: `/api/users`, `/api/users/[id]`
- **Database**: Prisma schema dengan model `User`
- **Authentication**: JWT-based dengan role-based access control

### Frontend Components

- **Pages**: `/manajemen-pengguna`
- **Components**:
  - `AddUserModal`
  - `EditUserModal`
  - `DeleteUserModal`

## 📋 API Endpoints

### 1. Get All Users

```http
GET /api/users
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Andi Setiawan",
    "email": "andi@bps.go.id",
    "role": "admin",
    "is_active": true,
    "institution": {
      "id": 1,
      "name": "BPS"
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### 2. Create User

```http
POST /api/users
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "operator",
  "institution_id": 1
}
```

### 3. Get Single User

```http
GET /api/users/1
Authorization: Bearer <token>
```

### 4. Update User

```http
PUT /api/users/1
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "admin",
  "institution_id": 1,
  "is_active": true
}
```

### 5. Delete User

```http
DELETE /api/users/1
Authorization: Bearer <token>
```

## 🔧 Components

### AddUserModal

Modal untuk menambahkan pengguna baru dengan validasi form.

**Props:**

- `onUserAdded`: Callback setelah user berhasil ditambahkan

**Features:**

- Form validation (nama, email, password, role, instansi)
- Password validation (minimal 6 karakter)
- Email validation dan uniqueness check
- Role selection (admin, operator, viewer)
- Institution selection
- Loading states
- Error handling

### EditUserModal

Modal untuk mengedit informasi pengguna.

**Props:**

- `user`: Object user yang akan diedit
- `onUserUpdated`: Callback setelah user berhasil diupdate

**Features:**

- Form pre-population dengan data user
- Email uniqueness validation (exclude current user)
- Role dan institution selection
- Account status toggle (active/inactive)
- Loading states
- Error handling

### DeleteUserModal

Modal konfirmasi untuk menghapus pengguna.

**Props:**

- `user`: Object user yang akan dihapus
- `onUserDeleted`: Callback setelah user berhasil dihapus

**Features:**

- Confirmation dialog dengan warning
- User information display
- Prevention of self-deletion
- Loading states
- Error handling

## 🗄️ Database Schema

```prisma
model User {
  id             Int      @id @default(autoincrement())
  name           String
  email          String   @unique
  password_hash  String
  role           Role     @default(viewer)
  institution_id Int?
  is_active      Boolean  @default(true)
  created_at     DateTime @default(now())
  updated_at     DateTime @updatedAt

  // Relations
  institution      Institution?     @relation(fields: [institution_id], references: [id])
  documents        Document[]
  analysis_results AnalysisResult[]

  @@map("users")
}

enum Role {
  admin
  operator
  viewer
}
```

## 🔒 Security Features

### Authentication

- Semua endpoint memerlukan JWT token
- Token validation di setiap request

### Authorization

- Role-based access control
- Hanya admin yang bisa akses user management
- Prevention of self-deletion

### Data Validation

- Email uniqueness validation
- Password strength requirements
- Required field validation
- Role validation

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

### Search & Filter

- Search by name or email
- Filter by role (admin, operator, viewer)
- Real-time filtering

## 🚀 Usage

### 1. Add New User

1. Klik "Tambah Pengguna" button
2. Isi form dengan data lengkap:
   - Nama lengkap
   - Email (unik)
   - Password (minimal 6 karakter)
   - Role (admin/operator/viewer)
   - Instansi
3. Klik "Tambah Pengguna"

### 2. Edit User

1. Klik "Edit" pada user yang ingin diedit
2. Update informasi yang diperlukan
3. Toggle status akun jika perlu
4. Klik "Simpan Perubahan"

### 3. Delete User

1. Klik "Hapus" pada user yang ingin dihapus
2. Konfirmasi penghapusan
3. Klik "Hapus Pengguna"

### 4. Search & Filter

1. Gunakan search box untuk mencari berdasarkan nama atau email
2. Gunakan dropdown filter untuk filter berdasarkan role

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

### Role Permissions

```typescript
const ROLE_PERMISSIONS = {
  admin: ["read", "create", "update", "delete"],
  operator: ["read", "create"],
  viewer: ["read"],
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Email Already Exists**

   - Check if email is already registered
   - Use different email address

2. **Permission Denied**

   - Check user role (admin only)
   - Check JWT token validity
   - Check database permissions

3. **Cannot Delete Own Account**
   - System prevents self-deletion for security
   - Use another admin account to delete

### Error Codes

- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (user doesn't exist)
- `500`: Internal Server Error

## 📈 Future Enhancements

### Planned Features

- [ ] Bulk user operations (import/export)
- [ ] User activity logging
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] User groups and permissions
- [ ] Account expiration dates
- [ ] User profile pictures
- [ ] Email verification

### Performance Optimizations

- [ ] Pagination for large user lists
- [ ] Lazy loading for user details
- [ ] Caching for frequently accessed data
- [ ] Real-time user status updates

## 🔄 Integration

### With Other Features

- **Authentication**: Integrated with login system
- **File Management**: Users can upload/manage documents
- **Document Analysis**: Users can perform AI analysis
- **Dashboard**: User-specific data display

### API Integration

- **Institutions API**: For institution selection
- **Auth API**: For token validation
- **Documents API**: For user-specific documents
