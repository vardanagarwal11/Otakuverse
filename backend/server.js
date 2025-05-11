import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './db.js';

import waitlistRoute from './routes/waitlist.js';
import clerkWebhookRoute from './routes/clerkWebhook.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/waitlist', waitlistRoute);
app.use('/api/clerk-webhook', clerkWebhookRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));