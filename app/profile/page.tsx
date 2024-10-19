"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LessonProgress } from "@/types/types";

export default function ProfilePage() {
    const { user } = useUser();
    const router = useRouter();
    const [progresses, setProgresses] = useState<LessonProgress[]>([]);

    useEffect(() => {
        if (!user) {
            router.push("/404");
            return;
        }

        async function fetchProgresses() {
            try {
                const response = await fetch(`/api/user/progress`, {
                    method: "GET",
                });
                if (!response.ok) {
                    throw new Error("Progressions non trouvées");
                }
                const data: LessonProgress[] = await response.json();
                setProgresses(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des progressions:", error);
                router.push("/404");
            }
        }

        fetchProgresses();
    }, [user, router]);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mon Profil</h1>
                <p className="text-gray-600 dark:text-gray-300">Bienvenue, {user?.fullName || "Utilisateur"}</p>
            </div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section Informations Personnelles */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informations Personnelles</h2>
                    <div className="text-gray-600 dark:text-gray-300">
                        <p><span className="font-semibold">Nom: </span>{user?.fullName || "N/A"}</p>
                        <p><span className="font-semibold">Inscription: </span>{user?.createdAt?.toLocaleDateString() || "N/A"}</p>
                    </div>
                </div>

                {/* Section Progressions de cours */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progression des Cours</h2>
                    {progresses.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">Aucune progression trouvée.</p>
                    ) : (
                    <ul className="space-y-4">
                        {progresses.map((lessonProgress) => (
                        <li key={lessonProgress.id} className="flex items-center justify-between">
                            <span className="text-gray-800 dark:text-gray-200">
                                {lessonProgress.lesson.title}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {Math.min(parseFloat(lessonProgress.progress.toFixed(2)), 100).toFixed(0)}%
                            </span>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>

                {/* Section Badges */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mes Badges</h2>
                    <div className="flex space-x-4">
                        <div className="bg-yellow-400 p-4 rounded-lg shadow-md">
                            <span className="text-white font-bold">Badge 1</span>
                        </div>
                        <div className="bg-blue-400 p-4 rounded-lg shadow-md">
                            <span className="text-white font-bold">Badge 2</span>
                        </div>
                        <div className="bg-green-400 p-4 rounded-lg shadow-md">
                            <span className="text-white font-bold">Badge 3</span>
                        </div>
                    </div>
                </div>

                {/* Section Activité Récente */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activité Récente</h2>
                    <p className="text-gray-600 dark:text-gray-300">Vous avez complété la leçon 2 dans le cours "Introduction à JavaScript".</p>
                </div>

                {/* Section Paramètres du compte */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Paramètres</h2>
                    <button className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700">
                        Modifier le profil
                    </button>
                    <button className="w-full mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">
                        Supprimer le compte
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
}
