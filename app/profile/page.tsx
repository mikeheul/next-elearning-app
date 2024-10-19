"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LessonProgress } from "@/types/types";

import { Medal, Star, Award, CheckCircle, BookOpen } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useUser();
    const router = useRouter();
    const [progresses, setProgresses] = useState<LessonProgress[]>([]);
    const [recentActivities, setRecentActivities] = useState<LessonProgress[]>([]);

    useEffect(() => {
        // if (!user) {
        //     router.push("/404");
        //     return;
        // }

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

                // Filtrer les progressions complétées et les trier par date
                const completedLessons = data
                    .filter(progress => progress.progress === 100)  // Filtrer les progressions complétées à 100%
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) // Trier par date de mise à jour (ordre décroissant)
                    .slice(0, 5); // Limiter aux 5 dernières activités

                setRecentActivities(completedLessons);

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
            <div className="bg-white dark:bg-gray-900 shadow-md">
                <div className="px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mon Profil</h1>
                    <p className="text-gray-600 dark:text-gray-300">Bienvenue, {user?.fullName || "Utilisateur"}</p>
                </div>
            </div>

            {/* Main content */}
            <div className="px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section Informations Personnelles */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Informations Personnelles</h2>
                        <div className="text-gray-600 dark:text-gray-300">
                            <p><span className="font-semibold">Nom : </span>{user?.fullName || "N/A"}</p>
                            <p><span className="font-semibold">Inscription : </span>{user?.createdAt?.toLocaleDateString() || "N/A"}</p>
                        </div>
                    </div>

                    {/* Section Progressions de cours */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Progression des Cours</h2>
                        {progresses.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">Aucune progression trouvée.</p>
                        ) : (
                            <ul className="space-y-6">
                                {progresses.map((lessonProgress) => (
                                    <li 
                                        key={lessonProgress.id} 
                                        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            {/* Icône pour représenter le cours */}
                                            <div className="flex-shrink-0">
                                                <BookOpen strokeWidth={1} className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            {/* Titre du cours et sous-titre */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lessonProgress.lesson.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{lessonProgress.lesson.course.title}</p>
                                            </div>
                                        </div>
                                        <div className="w-2/5">
                                            {/* Barre de progression avec couleur en fonction du pourcentage */}
                                            <div className="relative w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${
                                                        lessonProgress.progress >= 75 ? 'bg-green-500' : 
                                                        lessonProgress.progress >= 50 ? 'bg-yellow-500' : 
                                                        'bg-red-500'
                                                    }`}
                                                    style={{ width: `${Math.min(lessonProgress.progress, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-right text-xs mt-1 text-gray-500 dark:text-gray-400">
                                                {Math.min(lessonProgress.progress, 100).toFixed(0)}%
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Section badges */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mes Badges</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Badge 1 */}
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <Medal strokeWidth={1} className="h-10 w-10 text-yellow-400" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Champion</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">A complété 10 leçons</p>
                                </div>
                            </div>

                            {/* Badge 2 */}
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <Star strokeWidth={1} className="h-10 w-10 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Expert</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">A obtenu un score parfait</p>
                                </div>
                            </div>

                            {/* Badge 3 */}
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <Award strokeWidth={1} className="h-10 w-10 text-green-400" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Maître</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">A terminé 5 cours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Activité Récente */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Activité Récente</h2>
                        {recentActivities.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">Aucune activité récente.</p>
                        ) : (
                            <ul className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <li 
                                        key={activity.id} 
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200 ease-in-out"
                                    >
                                        <div className="flex items-center space-x-3">
                                            {/* Icone check si terminé */}
                                            <div className="flex-shrink-0">
                                                <CheckCircle className="h-6 w-6 text-green-500" />
                                            </div>
                                            {/* Titre de la leçon */}
                                            <div>
                                                <span className="text-gray-800 dark:text-gray-200 font-medium">{activity.lesson.title}</span>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">Cours complété</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {/* Date de complétion */}
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                Terminé le {new Date(activity.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
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
