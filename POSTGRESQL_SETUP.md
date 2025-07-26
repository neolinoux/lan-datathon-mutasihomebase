# PostgreSQL Setup Guide

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed

## Step 1: Create Database

```sql
CREATE DATABASE lan_datathon;
```

## Step 2: Set Environment Variables

Create `.env` file in project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/lan_datathon?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

Replace `username` and `password` with your PostgreSQL credentials.

## Step 3: Generate Prisma Client

```bash
npx prisma generate
```

## Step 4: Push Schema to Database

```bash
npx prisma db push
```

## Step 5: Seed Database

```bash
node scripts/setup-postgres.js
```

## Step 6: Start Development Server

```bash
npm run dev
```

## Default Users

After seeding, you can login with:

| Email                    | Password | Role     | Institution |
| ------------------------ | -------- | -------- | ----------- |
| <admin@lan-datathon.go.id> | admin123 | admin    | Super Admin |
| <andi@bps.go.id>           | admin123 | admin    | BPS         |
| <budi@bps.go.id>           | admin123 | operator | BPS         |
| <citra@bps.go.id>          | admin123 | viewer   | BPS         |

## Troubleshooting

### Connection Error

- Make sure PostgreSQL is running
- Check credentials in DATABASE_URL
- Verify database exists

### Permission Error

- Check PostgreSQL user permissions
- Make sure user can create tables

### Prisma Error

- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema
