// server/server.js
import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhook } from './controllers/webhook.js';
import companyRoutes from './routes/companyRouter.js';  
import connectCloudinary from './config/cloudinary.js';
import jobRouters from './routes/jobRoutes.js';
import userRouters from './routes/userRouters.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();

// Connect DB + Cloudinary
await connectDB();
await connectCloudinary();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://job-portal-client-alpha-one.vercel.app' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200
}));


// Webhooks must be BEFORE JSON parsing
app.post('/webhooks', express.raw({ type: '*/*' }), clerkWebhook);

// Parse JSON and form-data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Clerk middleware for auth context
app.use(clerkMiddleware());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('JSON parsing error:', err.message);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  } 
  next();
});

// Register routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRouters);
app.use('/api/users', userRouters);

// Basic routes
app.get('/', (req, res) => res.send('Api working'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
