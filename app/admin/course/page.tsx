"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateCourse: React.FC = () => {
    const [title, setTitle] = useState<string>(''); // Déclaration du type pour le titre
    const [description, setDescription] = useState<string>(''); // Déclaration du type pour la description
    const router = useRouter(); // Utilisation de useRouter depuis next/navigation

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        const response = await fetch('/api/course', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }), // Envoi des données au serveur
        });

        if (response.ok) {
            // Redirection vers la page des cours si la création est réussie
            router.push('/course');
        } else {
            // Gestion des erreurs si la réponse n'est pas OK
            console.error('Erreur lors de la création du cours', response.statusText);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full p-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Créer un nouveau cours</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="course-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Titre du cours
                        </label>
                        <input
                            id="course-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Titre du cours"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="course-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            rows={10} // Ajuste le nombre de lignes visibles pour le textarea
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        Créer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
