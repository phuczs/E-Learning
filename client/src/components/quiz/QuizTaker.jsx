import { useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

const QuizTaker = ({ quiz, onSubmit }) => {
    const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const { toast } = useToast();

    const handleSelectOption = (questionIndex, optionIndex) => {
        if (submitted) return;
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (answers.some(a => a === null)) {
            toast({
                title: 'Incomplete quiz',
                description: 'Please answer all questions before submitting.',
                variant: 'destructive',
            });
            return;
        }

        const result = await onSubmit(answers);
        if (result) {
            toast({
                title: 'Quiz submitted',
                description: 'Results are now displayed below.',
                variant: 'success',
            });
        }
        setResults(result);
        setSubmitted(true);
    };

    return (
        <div className="card">
            <h2 className="mb-3">{quiz.title}</h2>

            {!submitted ? (
                <>
                    {quiz.questions.map((question, qIndex) => (
                        <div key={qIndex} className="mb-4">
                            <h4 className="mb-2">
                                {qIndex + 1}. {question.question_text}
                            </h4>

                            {question.options.map((option, oIndex) => (
                                <div
                                    key={oIndex}
                                    className={`quiz-option ${answers[qIndex] === oIndex ? 'selected' : ''}`}
                                    onClick={() => handleSelectOption(qIndex, oIndex)}
                                >
                                    <strong>{String.fromCharCode(65 + oIndex)}.</strong> {option.option_text}
                                </div>
                            ))}
                        </div>
                    ))}

                    <button onClick={handleSubmit} className="btn btn-primary">
                        Submit Quiz
                    </button>
                </>
            ) : (
                <>
                    <div className="alert alert-info mb-4">
                        <h3>Score: {results.score.toFixed(1)}%</h3>
                        <p>You got {results.correctAnswers} out of {results.totalQuestions} correct!</p>
                    </div>

                    {results.results.map((result, index) => (
                        <div key={index} className="mb-4">
                            <h4 className="mb-2">
                                {index + 1}. {result.question}
                            </h4>

                            <div className={`quiz-option ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                                {result.isCorrect ? <FiCheckCircle /> : <FiXCircle />}
                                <strong>Your answer:</strong> {result.userAnswer}
                            </div>

                            {!result.isCorrect && (
                                <div className="quiz-option correct">
                                    <FiCheckCircle />
                                    <strong>Correct answer:</strong> {result.correctAnswer}
                                </div>
                            )}

                            {result.explanation && (
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                    💡 {result.explanation}
                                </p>
                            )}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default QuizTaker;
