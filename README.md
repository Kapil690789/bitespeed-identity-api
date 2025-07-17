# Bitespeed Identity Reconciliation System

A robust backend service for identifying and linking customer contacts across multiple purchases, handling identity reconciliation where customers use different email addresses and phone numbers.

## 🚀 Features

- **Identity Reconciliation**: Links contacts based on shared email or phone number
- **Primary/Secondary Relationship**: Maintains hierarchical contact relationships
- **Concurrent Request Safety**: Handles race conditions with database transactions
- **Input Validation**: Comprehensive request validation with Zod
- **Rate Limiting**: Built-in rate limiting for production use
- **Error Handling**: Proper error handling and logging
- **Testing**: Unit and integration tests included
- **TypeScript**: Full type safety throughout the application

## 🛠 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Testing**: Jest with Supertest
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

\`\`\`bash
# Create project directory
mkdir bitespeed-backend
cd bitespeed-backend

# Initialize and install packages
npm init -y
npm install express typescript @types/node @types/express
npm install prisma @prisma/client
npm install dotenv cors helmet zod
npm install -D nodemon ts-node jest @types/jest supertest @types/supertest ts-jest
\`\`\`

### 2. Environment Setup

\`\`\`bash
# Copy environment template
cp .env.example .env

# Edit .env with your database URL
# ONLY FOR LOCAL DEV USE THIS URL 

DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.cufcfyqjnkytksxavtmz.supabase.co:5432/postgres"
PORT=3000
NODE_ENV=development
\`\`\`

### 3. Database Setup

\`\`\`bash
# Initialize Prisma
npx prisma init

# Run database migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
\`\`\`

### 4. Start Development Server

\`\`\`bash
# Development mode with hot reload
npm run dev

# Or build and run production
npm run build
npm start
\`\`\`

## 📡 API Documentation

### POST /identify

Identifies and links customer contacts.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",     // Optional
  "phoneNumber": "1234567890"      // Optional
}
\`\`\`

**Response:**
\`\`\`json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["john@example.com", "john.doe@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
\`\`\`

### GET /health

Health check endpoint.

**Response:**
\`\`\`json
{
  "status": "OK",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "service": "Bitespeed Identity Reconciliation"
}
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
\`\`\`

## 🚀 Deployment

### Using Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t bitespeed-backend .
docker run -p 3000:3000 --env-file .env bitespeed-backend
\`\`\`

### Manual Deployment

\`\`\`bash
# Build for production
npm run build

# Deploy database migrations
npm run db:deploy

# Start production server
npm start
\`\`\`

## 📊 Database Schema

\`\`\`sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(15),
    email VARCHAR(255),
    linked_id INTEGER REFERENCES contacts(id),
    link_precedence VARCHAR(10) NOT NULL CHECK (link_precedence IN ('primary', 'secondary')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
\`\`\`

## 🔍 Business Logic Examples

### Scenario 1: New Customer
\`\`\`bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "phoneNumber": "123456"}'
\`\`\`

### Scenario 2: Existing Customer with New Info
\`\`\`bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "phoneNumber": "123456"}'
\`\`\`

### Scenario 3: Merging Primary Contacts
\`\`\`bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "phoneNumber": "789012"}'
\`\`\`

## 🛡 Security Features

- **Rate Limiting**: 100 requests per 15-minute window
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **CORS Protection**: Configurable CORS settings
- **Security Headers**: Helmet.js for security headers

## 📈 Performance Considerations

- **Database Indexing**: Optimized indexes on email and phoneNumber
- **Transaction Safety**: Database transactions for consistency
- **Connection Pooling**: Prisma connection pooling
- **Error Handling**: Graceful error handling and logging

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   \`\`\`bash
   # Check database URL format
   echo $DATABASE_URL
   
   # Test connection
   npx prisma db pull
   \`\`\`

2. **Migration Issues**
   \`\`\`bash
   # Reset database
   npx prisma migrate reset
   
   # Re-run migrations
   npx prisma migrate dev
   \`\`\`

3. **Port Already in Use**
   \`\`\`bash
   # Change port in .env
   PORT=3001
   \`\`\`

## 📝 License

MIT License - see LICENSE file for details.
