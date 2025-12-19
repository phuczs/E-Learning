import { Ollama } from 'ollama';

let ollama = null;

/**
 * Get or initialize Ollama client
 */
const getOllama = () => {
    if (!ollama) {
        // Initialize Ollama client (connects to local Ollama server by default at http://localhost:11434)
        ollama = new Ollama({
            host: process.env.OLLAMA_HOST || 'http://localhost:11434'
        });
    }
    return ollama;
};

/**
 * Generate summary from text content using Ollama
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

        const response = await getOllama().chat({
            model: 'qwen2.5:3b',
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
            options: {
                temperature: 0.7,
                num_predict: 1500
            }
        });

        return response.message.content;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('Failed to generate summary: ' + error.message);
    }
};

/**
 * Generate flashcards from text content using Ollama
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

IMPORTANT: Return ONLY the JSON array, no additional text or markdown formatting.

Content:
${text.substring(0, 10000)}`;

        const response = await getOllama().chat({
            model: 'qwen2.5:3b',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at creating educational flashcards. Return only valid JSON array, no markdown code blocks or additional text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            options: {
                temperature: 0.8,
                num_predict: 2000
            }
        });

        const content = response.message.content;
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
 * Generate quiz from text content using Ollama
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

IMPORTANT: Return ONLY the JSON object, no additional text or markdown formatting.

Content:
${text.substring(0, 10000)}`;

        const response = await getOllama().chat({
            model: 'qwen2.5:3b',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert at creating educational quizzes. Return only valid JSON object, no markdown code blocks or additional text.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            options: {
                temperature: 0.8,
                num_predict: 2500
            }
        });

        const content = response.message.content;
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
