"use client";

import { Quiz } from '@/types/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const QuizPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<Quiz>(); 
    const [loading, setLoading] = useState(true); 
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchQuiz = async () => {
            if (quizId) {
                try {
                    const response = await fetch(`/api/quiz/${quizId}`);
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération du quiz');
                    }
                    const data = await response.json();
                    setQuiz(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: answer,
        }));
    };

    if (loading) return <p className="text-center text-gray-500 dark:text-gray-300">Chargement...</p>;
    if (!quiz) return <p className="text-center text-gray-500 dark:text-gray-300">Quiz introuvable</p>;

    return (
        <div className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Quiz Header */}
                <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">{quiz.title}</h1>
                    <p className="text-gray-700 dark:text-gray-300">{quiz.description}</p>
                </div>

                {/* Quiz Questions */}
                <div className="space-y-8">
                    {quiz.questions.map((question: any, questionIndex: number) => (
                        <div key={questionIndex} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{`Question ${questionIndex + 1} : ${question.question}`}</h2>
                            <ul className="space-y-4">
                                {question.answers.map((answer: string, answerIndex: number) => (
                                    <li key={answerIndex} className="flex items-center">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name={`question-${questionIndex}`}
                                                value={answer}
                                                checked={selectedAnswers[questionIndex] === answer}
                                                onChange={() => handleAnswerChange(questionIndex, answer)}
                                                className="form-radio h-5 w-5 text-blue-600 dark:text-blue-400"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{answer}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                        Soumettre le quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
