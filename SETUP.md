# Quick Start Guide

## Prerequisites Checklist

Before running the application, ensure you have:

- ✅ Node.js (v16+) installed
- ✅ MongoDB running (local or Atlas connection string)
- ✅ OpenAI API key

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and update these values:

```env
MONGODB_URI=mongodb://localhost:27017/ai-study-assistant
JWT_SECRET=change-this-to-a-random-secure-string
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Use your Atlas connection string in `MONGODB_URI`

### 3. Start the Backend Server

```bash
cd server
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### 4. Start the Frontend (New Terminal)

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.0.11  ready in XXX ms

➜  Local:   http://localhost:5173/
```

### 5. Open the Application

Visit: **http://localhost:5173**

## First Time Usage

1. Click "Sign Up" to create an account
2. Fill in your details and register
3. You'll be redirected to the Dashboard
4. Upload a lecture file (PDF, DOCX, or TXT)
5. Wait for AI to generate a summary
6. Generate flashcards or quizzes from your lecture

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`

### OpenAI API Error
- Verify your API key is correct
- Ensure you have credits in your OpenAI account

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Change port in `client/vite.config.js`

### File Upload Fails
- Check file size (max 10MB)
- Ensure file type is supported (PDF, DOCX, TXT, images)
- Verify `uploads/` directory exists in `server/`

## API Testing

Test the backend API:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","full_name":"Test User"}'
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use MongoDB Atlas
5. Deploy to Heroku, Railway, or DigitalOcean

### Frontend
1. Run `npm run build`
2. Deploy `dist/` folder to Vercel, Netlify, or similar
3. Update API base URL if needed

## Security Notes

- Never commit `.env` files
- Use strong passwords (8+ chars, uppercase, lowercase, numbers)
- JWT tokens expire after 24 hours
- All API routes are rate-limited
- File uploads are validated and sanitized

## Support

For issues or questions:
1. Check the README.md
2. Review the implementation_plan.md
3. Check console logs for errors
