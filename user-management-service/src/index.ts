import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { requireAuth } from '@clerk/express';
import { db } from './config/db.config';

// Routes
import { hubRoutes } from './routes/hub.route';
import { memberRoutes } from './routes/member.route';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN environment variable is not set");
}

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/protected', requireAuth(), (req: Request, res: Response) => {
    res.send('Protected route');
});


// Using the routes
app.use('/api', hubRoutes);
app.use('/api', memberRoutes);

// Connect to the database and start the Express server
db.$connect()
  .then(() => {
    app.listen(port, () => {
      console.log('Server running on port', port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
