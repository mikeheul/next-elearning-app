'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateQuizPage = ({ params }: { params: { courseId: string } }) => {
    const router = useRouter();
    
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [questions, setQuestions] = useState<{
        question: string;
        answers: string[]; // Garde les réponses sous forme de tableau
        correctAnswerIndex: number | null; // Indice de la bonne réponse
    }[]>([{ question: '', answers: [''], correctAnswerIndex: null }]); // Une seule réponse par défaut

    const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
        setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[questionIndex].answers[answerIndex] = value; // Met à jour la réponse
            return newQuestions;
        });
    };

    const handleQuestionChange = (questionIndex: number, value: string) => {
        setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[questionIndex].question = value; // Met à jour la question
            return newQuestions;
        });
    };

    const handleAddAnswer = (questionIndex: number) => {
        setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            // Ajoute une nouvelle réponse vide, mais uniquement si la dernière réponse n'est pas vide
            if (newQuestions[questionIndex].answers[newQuestions[questionIndex].answers.length - 1] !== '') {
                newQuestions[questionIndex].answers.push(''); // Ajoute un nouveau champ de réponse
            }
            return newQuestions;
        });
    };

    const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
        setQuestions((prevQuestions) => {
            const newQuestions = [...prevQuestions];
            newQuestions[questionIndex].answers.splice(answerIndex, 1); // Retire la réponse à l'index spécifié
            return newQuestions;
        });
    };

    const handleAddQuestion = () => {
        // Ajoute une nouvelle question par défaut avec une seule réponse
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            { question: '', answers: [''], correctAnswerIndex: null },
        ]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Soumet le quiz à l'API
        const response = await fetch('/api/quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                courseId: params.courseId,
                questions: questions.map(q => ({
                    question: q.question,
                    answers: q.answers,
                    correctAnswer: q.correctAnswerIndex !== null ? q.answers[q.correctAnswerIndex] : '',
                })),
            }),
        });
    
        if (response.ok) {
            // Rediriger vers la page de détails du cours après la création
            router.push(`/admin/courses/${params.courseId}`);
        } else {
            console.error('Erreur lors de la création du quiz.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Créer un Quiz</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Titre</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            rows={4}
                        />
                    </div>

                    {questions.map((q, questionIndex) => (
                        <div key={questionIndex} className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question {questionIndex + 1}</label>
                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)} // Appel à la nouvelle fonction
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mb-2"
                                required
                            />
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Réponses</label>
                            {q.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mr-2"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Retirer
                                    </button>
                                    <label className="ml-2 text-sm">
                                        <input
                                            type="radio"
                                            name={`correctAnswer-${questionIndex}`}
                                            checked={q.correctAnswerIndex === answerIndex}
                                            onChange={() => {
                                                const newQuestions = [...questions];
                                                newQuestions[questionIndex].correctAnswerIndex = answerIndex;
                                                setQuestions(newQuestions);
                                            }}
                                        />
                                        Bonne réponse
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => handleAddAnswer(questionIndex)}
                                className="text-blue-500 hover:underline"
                            >
                                Ajouter une réponse
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="text-blue-500 hover:underline mb-4"
                    >
                        Ajouter une question
                    </button>

                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
                        Créer le quiz
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateQuizPage;
