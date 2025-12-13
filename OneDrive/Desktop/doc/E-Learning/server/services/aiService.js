import OpenAI from 'openai';

let openai = null;

/**
 * Get or initialize OpenAI client
 */
const getOpenAI = () => {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here' || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
            throw new Error('OpenAI API key is not configured. Please add a valid OPENAI_API_KEY to your .env file. Get your API key from https://platform.openai.com/api-keys');
        }
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
    return openai;
};

/**
 * Generate summary from text content
 * @param {string} text - Text content to summarize
 * @param {string} tone - Tone of summary (concise, detailed, simple, academic)
 * @returns {Promise<string>} - Generated summary in markdown
 */
export const generateSummary = async (text, tone = 'concise') => {
    try {
        const toneInstructions = {
            concise: 'Create a brief, concise summary highlighting only the key points.',
            detailed: 'Create a comprehensive, detailed summary covering all important aspects.',
            simple: 'Create a simple, easy-to-understand summary suitable for beginners.',
            academic: 'Create an academic-style summary with formal language and structure.'
        };

        const prompt = `${toneInstructions[tone] || toneInstructions.concise}

Format the summary in markdown with:
- Clear headings (##)
- Bullet points for key concepts
- Bold for important terms

Text to summarize:
${text.substring(0, 12000)}`; // Limit to avoid token limits

        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert educational content summarizer. Create clear, well-structured summaries in markdown format.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('Failed to generate summary: ' + error.message);
    }
};

/**
 * Generate flashcards from text content
 * @param {string} text - Text content to create flashcards from
 * @param {number} count - Number of flashcards to generate
 * @returns {Promise<Array>} - Array of flashcard objects
 */
export const generateFlashcards = async (text, count = 10) => {
    try {
        const prompt = `Create ${count} educational flashcards from the following content. 
Each flashcard should have a clear question (front) and a concise answer (back).
Focus on key concepts, definitions, and important facts.

Return the flashcards as a JSON array with this structure:
[
  {
    "front_text": "Question or term",
    "back_text": "Answer or definition",
    "mastery_level": 0
  }
]

Content:
${text.substring(0, 10000)}`;

        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at creating educational flashcards. Return only valid JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 2000
        });

        const content = response.choices[0].message.content;
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('Invalid response format');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        throw new Error('Failed to generate flashcards: ' + error.message);
    }
};

/**
 * Generate quiz from text content
 * @param {string} text - Text content to create quiz from
 * @param {number} questionCount - Number of questions to generate
 * @returns {Promise<Object>} - Quiz object with questions
 */
export const generateQuiz = async (text, questionCount = 5) => {
    try {
        const prompt = `Create a ${questionCount}-question multiple choice quiz from the following content.
Each question should have:
- A clear question text
- 4 options (A, B, C, D)
- One correct answer
- An explanation for the correct answer

Return as JSON with this structure:
{
  "questions": [
    {
      "question_text": "Question here?",
      "options": [
        {"option_text": "Option A", "is_correct": false},
        {"option_text": "Option B", "is_correct": true},
        {"option_text": "Option C", "is_correct": false},
        {"option_text": "Option D", "is_correct": false}
      ],
      "explanation": "Explanation of the correct answer"
    }
  ]
}

Content:
${text.substring(0, 10000)}`;

        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at creating educational quizzes. Return only valid JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 2500
        });

        const content = response.choices[0].message.content;
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error generating quiz:', error);
        throw new Error('Failed to generate quiz: ' + error.message);
    }
};
