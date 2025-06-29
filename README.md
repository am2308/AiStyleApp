# StyleAI - Personal Wardrobe Assistant

A full-stack web application that helps users manage their wardrobe and get AI-powered outfit recommendations.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Complexion profiling (skin tone, body type, style preferences)
- **Wardrobe Management**: Upload and organize clothing items with photos
- **AI Recommendations**: Get personalized outfit suggestions based on your wardrobe and profile
- **Marketplace Integration**: Discover new items to complete your outfits

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls

### Backend
- Node.js with Express
- AWS DynamoDB for data storage
- AWS S3 for image storage
- OpenAI API for outfit recommendations
- JWT for authentication
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- AWS account with DynamoDB and S3 access
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=
JWT_EXPIRES_IN=7d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

USERS_TABLE=StyleAI_Users
WARDROBE_TABLE=StyleAI_Wardrobe

S3_BUCKET=styleai-wardrobe-images
S3_REGION=us-east-1

OPENAI_API_KEY=

FRONTEND_URL=http://localhost:5173
```

5. Create DynamoDB tables:
```bash
node scripts/createTables.js
```

6. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=StyleAI
```

5. Start the development server:
```bash
npm run dev
```

## AWS Configuration

### DynamoDB Tables

The application uses two DynamoDB tables:

1. **StyleAI_Users**: Stores user profiles and authentication data
2. **StyleAI_Wardrobe**: Stores wardrobe items with references to S3 images

### S3 Bucket

Create an S3 bucket for storing wardrobe item images. Make sure to:
- Enable public read access for uploaded images
- Configure CORS to allow uploads from your frontend domain

### IAM Permissions

Your AWS user/role needs the following permissions:
- DynamoDB: CreateTable, PutItem, GetItem, UpdateItem, DeleteItem, Query
- S3: PutObject, DeleteObject, GetObject

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Wardrobe
- `GET /api/wardrobe` - Get user's wardrobe items
- `POST /api/wardrobe` - Add new wardrobe item (with image upload)
- `DELETE /api/wardrobe/:id` - Delete wardrobe item

### Recommendations
- `GET /api/recommendations` - Get AI outfit recommendations
- `GET /api/marketplace` - Get marketplace item suggestions

## Usage

1. **Sign Up**: Create an account with your email and password
2. **Complete Profile**: Set your skin tone, body type, and style preferences
3. **Add Wardrobe Items**: Upload photos and details of your clothing items
4. **Get Recommendations**: View AI-generated outfit suggestions
5. **Explore Marketplace**: Discover new items to complete your wardrobe

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
