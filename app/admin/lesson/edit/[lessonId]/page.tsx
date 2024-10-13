"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function EditLesson() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    const { courseId, lessonId } = useParams(); // On suppose que lessonId est passé en tant que paramètre

    useEffect(() => {
        async function fetchLesson() {
            try {
                const response = await fetch(`/api/lesson/${lessonId}`);

                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.title);
                    setContent(data.content);
                } else {
                    console.error('Erreur lors de la récupération de la leçon');
                    router.push('/404'); // Redirection vers une page 404 si la leçon n'est pas trouvée
                }
            } catch (error) {
                console.error('Erreur lors de la récupération de la leçon :', error);
            }
        }

        fetchLesson();
    }, [lessonId, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch(`/api/lesson/${lessonId}`, {
            method: 'PUT', // Utiliser PUT pour la mise à jour
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, courseId }), // Inclure le courseId avec le titre et le contenu
        });

        if (response.ok) {
            router.push(`/lesson/${lessonId}`);
        } else {
            console.error('Erreur lors de la mise à jour de la leçon');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full p-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Éditer le chapitre</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Titre du chapitre
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            placeholder="Titre du chapitre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contenu du chapitre
                        </label>
                        <MarkdownEditor content={content} setContent={setContent} />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}