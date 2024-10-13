"use client"

import { Quiz } from '@/types/types';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const QuizPage = () => {
    const router = useRouter();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<Quiz>(); 
    const [loading, setLoading] = useState(true); 

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
                    setLoading(false); // Indiquer que le chargement est terminé
                }
            }
        };

        fetchQuiz();
    }, [quizId]);

    if (loading) return <p>Chargement...</p>;
    if (!quiz) return <p>Quiz introuvable</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p>{quiz.description}</p>
            <div className="mt-4">
                {quiz.questions.map((question: any, index: number) => (
                    <div key={index} className="mb-4">
                        <h2 className="text-xl">{question.question}</h2>
                        <ul>
                            {question.answers.map((answer: string, i: number) => (
                                <li key={i}>
                                    <input type="radio" name={`question-${index}`} value={answer} />
                                    {answer}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizPage;