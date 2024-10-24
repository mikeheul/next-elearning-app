"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Level } from '@/types/interfaces';

const CreateCourse: React.FC = () => {
    const [title, setTitle] = useState<string>(''); // Déclaration du type pour le titre
    const [description, setDescription] = useState<string>(''); // Déclaration du type pour la description
    const [isPublic, setIsPublic] = useState<boolean>(false); // État pour indiquer si le cours est public
    const [errors, setErrors] = useState<{ title?: string; description?: string; general?: string }>({}); // État pour les erreurs
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Indique si la requête est en cours
    const [levelId, setLevelId] = useState('');
    const [levelOptions, setLevelOptions] = useState<Level[]>([]);

    const router = useRouter(); // Utilisation de useRouter depuis next/navigation

    useEffect(() => {
        async function fetchLevels() {
            try {
                const response = await fetch('/api/level');
                const data = await response.json();
                setLevelOptions(data);
                if (data.length > 0) {
                    setLevelId(data[0].id);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des niveaux de difficulté', error);
            }
        }
        fetchLevels();
    }, []);

    const validateForm = (): boolean => {
        const formErrors: { title?: string; description?: string } = {};

        if (title.trim().length < 5) {
            formErrors.title = 'Le titre doit contenir au moins 5 caractères.';
        }
        if (description.trim().length < 20) {
            formErrors.description = 'La description doit contenir au moins 20 caractères.';
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0; // Si pas d'erreurs, le formulaire est valide
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire

        // Vérification côté client avant soumission
        if (!validateForm()) {
            return; // Si le formulaire n'est pas valide, arrête la soumission
        }

        setIsSubmitting(true); // Active l'état de soumission

        try {
            const response = await fetch("/api/course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    { 
                        title, 
                        description, 
                        isPublic,
                        levelId
                    }
                ), // Envoi des données au serveur
            });

            if (response.ok) {
                // Redirection vers la page des cours si la création est réussie
                router.push("/course");
            } else {
                const result = await response.json(); // Récupération des erreurs du serveur
                setErrors({ general: result.message || "Erreur lors de la création du cours." });
            }
        } catch (error) {
            console.log(error)
            setErrors({ general: "Erreur serveur. Veuillez réessayer plus tard." });
        } finally {
            setIsSubmitting(false); // Désactive l'état de soumission
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
                        {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
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
                        {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                    </div>

                    {/* Difficulty Level Selector */}
                    <div className="mb-6">
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Niveau de difficulté
                        </label>
                        <select
                            id="level"
                            value={levelId}
                            onChange={(e) => setLevelId(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            {levelOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)} // Met à jour l'état isPublic
                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Rendre le cours public
                            </span>
                        </label>
                    </div>

                    {/* Erreur générale */}
                    {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {isSubmitting ? 'Création en cours...' : 'Créer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCourse;
