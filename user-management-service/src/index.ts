import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkClient, requireAuth } from '@clerk/express';
import { rateLimit } from 'express-rate-limit';
import { db } from './config/db.config';

dotenv.config({});

const app = express();
const port = process.env.PORT || 5001;

if (!process.env.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN environment variable is not set");
}

declare module 'express-serve-static-core' {
    interface Request {
      auth?: {
        userId: string;
      };
    }
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Middleware
app.use(express.json()); // Add this line to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Add this for parsing URL-encoded bodies
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
})); // Rate limit requests

// Base routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/protected', requireAuth({ signInUrl: '/sign-in' }), asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.auth!;
    const user = await clerkClient.users.getUser(userId);
    return res.json({ user });
  }))

// Routes
import { hubRoutes } from './routes/hub.route';
import { userRoutes } from './routes/user.route';
import { memberRoutes } from './routes/member.route';
import { asyncHandler } from './utils/asyncHandler.util';

// API routes
app.use('/api/hub', hubRoutes);
// app.use('/api/member', memberRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        timestamp: new Date().toISOString()
    });
});

// Connect to the database and start the server
db.$connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`API available at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    });
