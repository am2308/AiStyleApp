import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.js';
import wardrobeRoutes from '../routes/wardrobe.js';
import recommendationRoutes from '../routes/recommendations.js';
import marketplaceRoutes from '../routes/marketplace.js';
import subscriptionRoutes from '../routes/subscription.js';
import { errorHandler } from '../middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'StyleAI API is running on AWS Lambda',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/wardrobe', 
      '/api/recommendations',
      '/api/marketplace',
      '/api/subscription'
    ]
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the serverless handler
export const handler = serverless(app, {
  binary: ['image/*', 'application/octet-stream']
});
