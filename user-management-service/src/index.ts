import express from 'express';
import dotenv from 'dotenv';
import { data } from './config/db.config';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

console.log(data);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
