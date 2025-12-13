# AI Study Assistant

A full-stack MERN application that helps students learn more effectively by using AI to generate summaries, flashcards, and quizzes from uploaded lecture materials.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 📤 **File Upload** - Support for PDF, DOCX, TXT, and image files
- 🤖 **AI Summarization** - Automatic summary generation with customizable tone
- 🎴 **Flashcard Generation** - AI-generated flashcards for active recall
- 📝 **Quiz Creation** - Multiple-choice quizzes with instant feedback
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- OpenAI API for AI features
- Multer for file uploads
- Helmet & CORS for security

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- React Icons
- Modern CSS with animations

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd E-Learning
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-study-assistant
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=24h
OPENAI_API_KEY=your-openai-api-key-here
MAX_FILE_SIZE=10485760
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Usage

1. **Register/Login** - Create an account or login
2. **Upload Lecture** - Drag and drop or browse to upload your lecture files
3. **View Summary** - AI automatically generates a summary
4. **Generate Flashcards** - Click to create flashcards for studying
5. **Take Quiz** - Test your knowledge with AI-generated quizzes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Lectures
- `POST /api/lectures/upload` - Upload lecture file (protected)
- `GET /api/lectures` - Get all user lectures (protected)
- `GET /api/lectures/:id` - Get lecture by ID (protected)
- `DELETE /api/lectures/:id` - Delete lecture (protected)

### Flashcards
- `POST /api/flashcards/generate/:lectureId` - Generate flashcards (protected)
- `GET /api/flashcards/lecture/:lectureId` - Get flashcards for lecture (protected)
- `PUT /api/flashcards/:id` - Update flashcard (protected)
- `DELETE /api/flashcards/:id` - Delete flashcard (protected)

### Quizzes
- `POST /api/quizzes/generate/:lectureId` - Generate quiz (protected)
- `GET /api/quizzes/lecture/:lectureId` - Get quizzes for lecture (protected)
- `GET /api/quizzes/:id` - Get quiz by ID (protected)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (protected)
- `DELETE /api/quizzes/:id` - Delete quiz (protected)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- File upload validation
- User-scoped data access

## Project Structure

```
E-Learning/
├── server/
│   ├── config/          # Database & file upload config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # AI service integration
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- OpenAI for GPT API
- MongoDB for database
- React team for the amazing framework
