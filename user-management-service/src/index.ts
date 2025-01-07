import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { requireAuth } from '@clerk/express';
import { db } from './config/db.config';

// Routes
import { hubRoutes } from './routes/hub.route';
import { userRoutes } from './routes/user.route';
import { memberRoutes } from './routes/member.route';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Add this line to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Add this for parsing URL-encoded bodies

if (!process.env.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN environment variable is not set");
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Base routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/protected', requireAuth(), (req: Request, res: Response) => {
    res.send('Protected route');
});

// API routes
app.use('/api/hubs', hubRoutes); 
app.use('/api/members', memberRoutes);
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
