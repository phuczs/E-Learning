# Sample Data for AI Study Assistant

This directory contains sample lecture content and AI-generated outputs for previewing the application without an OpenAI API key.

## Files

### 1. sample-lecture-ml.txt
A comprehensive lecture about **Introduction to Machine Learning** covering:
- Types of ML (Supervised, Unsupervised, Reinforcement)
- The ML Pipeline (7 steps)
- Key challenges (Overfitting, Underfitting, Data Quality)
- Popular frameworks and tools
- Best practices

**Use this file to test:**
- File upload functionality
- Text extraction
- Lecture display

### 2. sample-summary.md
A pre-generated AI summary of the machine learning lecture in markdown format.

**Features demonstrated:**
- Markdown formatting with headers
- Bullet points for key concepts
- Bold text for important terms
- Emojis for visual appeal
- Structured organization

## How to Use

### Option 1: Upload the Sample Lecture
1. Go to Dashboard
2. Upload `sample-lecture-ml.txt`
3. The file will be processed and stored
4. Without OpenAI key: Summary generation will fail
5. With OpenAI key: Summary will be auto-generated

### Option 2: Manually Insert Sample Data (For Preview)

If you want to preview the summary feature without OpenAI:

1. Upload `sample-lecture-ml.txt` normally
2. The lecture will be saved to database
3. Manually create a summary in MongoDB:
   ```javascript
   db.summaries.insertOne({
     lecture_id: ObjectId("your-lecture-id"),
     content_markdown: "... paste content from sample-summary.md ...",
     tone: "concise",
     created_at: new Date()
   })
   ```

### Option 3: Seed Script (Recommended)

Create a seed script to populate sample data automatically:

```javascript
// server/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lecture from './models/Lecture.js';
import Summary from './models/Summary.js';
import fs from 'fs';

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Create sample user
  const user = await User.create({
    email: 'demo@example.com',
    password_hash: 'Demo1234',
    full_name: 'Demo User'
  });

  // Create sample lecture
  const lectureContent = fs.readFileSync('./sample-lecture-ml.txt', 'utf-8');
  const lecture = await Lecture.create({
    user_id: user._id,
    title: 'Introduction to Machine Learning',
    file_url: './sample-lecture-ml.txt',
    raw_content: lectureContent,
    media_type: 'txt'
  });

  // Create sample summary
  const summaryContent = fs.readFileSync('./sample-summary.md', 'utf-8');
  await Summary.create({
    lecture_id: lecture._id,
    content_markdown: summaryContent,
    tone: 'concise'
  });

  console.log('Sample data seeded!');
  process.exit(0);
};

seedData();
```

Run with: `node seed.js`

## Sample Flashcards

Here are sample flashcards you can manually add:

```json
[
  {
    "front_text": "What are the three main types of machine learning?",
    "back_text": "Supervised Learning, Unsupervised Learning, and Reinforcement Learning",
    "mastery_level": 0
  },
  {
    "front_text": "What is overfitting in machine learning?",
    "back_text": "When a model learns training data too well, including noise, resulting in poor generalization to new data",
    "mastery_level": 0
  },
  {
    "front_text": "Name three popular Python ML libraries",
    "back_text": "scikit-learn, TensorFlow, and PyTorch",
    "mastery_level": 0
  },
  {
    "front_text": "What is the difference between classification and regression?",
    "back_text": "Classification categorizes data into predefined classes, while regression predicts continuous values",
    "mastery_level": 0
  },
  {
    "front_text": "What are the 7 steps in the ML pipeline?",
    "back_text": "Data Collection, Preprocessing, Model Selection, Training, Evaluation, Hyperparameter Tuning, Deployment",
    "mastery_level": 0
  }
]
```

## Sample Quiz

```json
{
  "title": "Machine Learning Basics Quiz",
  "total_questions": 5,
  "questions": [
    {
      "question_text": "Which type of machine learning uses labeled data?",
      "options": [
        {"option_text": "Unsupervised Learning", "is_correct": false},
        {"option_text": "Supervised Learning", "is_correct": true},
        {"option_text": "Reinforcement Learning", "is_correct": false},
        {"option_text": "Semi-supervised Learning", "is_correct": false}
      ],
      "explanation": "Supervised learning requires labeled data where the correct output is known for training."
    },
    {
      "question_text": "What is K-Means used for?",
      "options": [
        {"option_text": "Classification", "is_correct": false},
        {"option_text": "Regression", "is_correct": false},
        {"option_text": "Clustering", "is_correct": true},
        {"option_text": "Dimensionality Reduction", "is_correct": false}
      ],
      "explanation": "K-Means is an unsupervised learning algorithm used for clustering similar data points."
    },
    {
      "question_text": "Which metric is used for regression problems?",
      "options": [
        {"option_text": "Accuracy", "is_correct": false},
        {"option_text": "F1-Score", "is_correct": false},
        {"option_text": "Mean Squared Error (MSE)", "is_correct": true},
        {"option_text": "Precision", "is_correct": false}
      ],
      "explanation": "MSE measures the average squared difference between predicted and actual values in regression."
    },
    {
      "question_text": "What technique helps prevent overfitting?",
      "options": [
        {"option_text": "Increasing model complexity", "is_correct": false},
        {"option_text": "Regularization", "is_correct": true},
        {"option_text": "Using more features", "is_correct": false},
        {"option_text": "Training longer", "is_correct": false}
      ],
      "explanation": "Regularization adds a penalty term to prevent the model from becoming too complex and overfitting."
    },
    {
      "question_text": "Which framework is developed by Google?",
      "options": [
        {"option_text": "PyTorch", "is_correct": false},
        {"option_text": "TensorFlow", "is_correct": true},
        {"option_text": "scikit-learn", "is_correct": false},
        {"option_text": "Keras", "is_correct": false}
      ],
      "explanation": "TensorFlow is an open-source deep learning framework developed by Google."
    }
  ]
}
```

## Benefits of Sample Data

1. **Test UI/UX** - See how summaries, flashcards, and quizzes look
2. **Demo the App** - Show features without API costs
3. **Development** - Work on frontend without backend dependencies
4. **Training** - Learn how to use the application
5. **Presentations** - Have ready-to-show content

## Next Steps

Once you have an OpenAI API key:
1. Upload real lecture files
2. AI will generate summaries automatically
3. Generate flashcards and quizzes on demand
4. Compare AI output with these samples
