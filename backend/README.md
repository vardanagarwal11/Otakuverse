# Otakuverse Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in this directory with:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   ```
   Replace `your-mongodb-connection-string` with your MongoDB Atlas or local URI.

3. Start the server:
   ```bash
   npm run dev
   ```

## Endpoints
- `POST /api/waitlist` — Add email to waitlist
- `POST /api/clerk-webhook` — Save Clerk user info (for webhooks)
