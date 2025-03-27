# PrimePlus+ Backend

The backend service for the PrimePlus+ platform, built with Node.js, Express, and Prisma.

## Features

### ✅ Completed Features
- 🔐 JWT authentication
- 📝 Content management
- 👥 User management
- 📧 Email notifications
- 🔍 Search functionality
- 📤 File uploads

### 🟡 In Progress Features
- 🎮 VR content API
- 💰 Subscription system
- 🔒 Enhanced security

## Tech Stack

- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Nodemailer for emails
- WebSocket for real-time features

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── websocket/     # WebSocket handlers
├── prisma/
│   └── schema.prisma  # Database schema
└── package.json
```

## API Endpoints

### Authentication (✅ Completed)
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- POST /api/auth/refresh - Refresh token
- POST /api/auth/forgot-password - Forgot password
- POST /api/auth/reset-password - Reset password

### Users (✅ Completed)
- GET /api/users/me - Get current user
- PUT /api/users/me - Update current user
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Content (✅ Completed)
- GET /api/content - Get content feed
- POST /api/content - Create content
- GET /api/content/:id - Get content by ID
- PUT /api/content/:id - Update content
- DELETE /api/content/:id - Delete content
- POST /api/content/:id/like - Like content
- POST /api/content/:id/comment - Comment on content

### VR Content (🟡 In Progress)
- GET /api/vr - Get VR content list
- POST /api/vr - Create VR content
- GET /api/vr/:id - Get VR content by ID
- PUT /api/vr/:id - Update VR content
- DELETE /api/vr/:id - Delete VR content

### Subscriptions (🟡 In Progress)
- GET /api/subscriptions - Get subscriptions
- POST /api/subscriptions - Create subscription
- PUT /api/subscriptions/:id - Update subscription
- DELETE /api/subscriptions/:id - Cancel subscription

## Database Schema

### Users Table
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  username      String    @unique
  role          Role      @default(USER)
  profile       Profile?
  content       Content[]
  comments      Comment[]
  likes         Like[]
  subscriptions Subscription[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Content Table
```prisma
model Content {
  id          String    @id @default(uuid())
  title       String
  description String?
  type        ContentType
  url         String?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  comments    Comment[]
  likes       Like[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### VR Content Table
```prisma
model VRContent {
  id          String    @id @default(uuid())
  title       String
  description String?
  type        VRContentType
  url         String?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Current Status

### Completed Features
1. Authentication System
   - JWT-based login/registration
   - Role-based authorization
   - Profile management

2. Content Management
   - Text and media posts
   - Content upload system
   - Media processing

3. User Management
   - Profile customization
   - User roles
   - Account settings

### In Progress
1. VR Content System
   - Basic VR API structure
   - Content storage
   - Processing pipeline

2. Subscription System
   - Payment integration
   - Subscription management
   - Access control

### Known Issues
1. Logout functionality needs improvement
2. VR content API not fully implemented
3. Some image uploads failing
4. Video processing optimization needed

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Update .env with your configuration
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write unit tests for controllers
- Use Prettier for code formatting
- Follow the API structure guidelines

### API Guidelines

1. Use proper HTTP methods
2. Implement proper error handling
3. Add input validation
4. Include proper documentation
5. Add rate limiting
6. Implement proper security measures
7. Include unit tests

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License. 