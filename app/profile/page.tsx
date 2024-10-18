"use client";

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { LessonProgress } from '@/types/types';
// import Swal from 'sweetalert2';

const UserProgressions = () => {
    const { user } = useUser(); 
    // const router = useRouter();

    const [progressions, setProgressions] = useState<LessonProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // if (!user) {
        //     router.push("/");

        //     Swal.fire({
        //         title: 'Connectez-vous',
        //         text: "Vous devez être connecté pour accéder à votre profil !",
        //         icon: 'warning',
        //         confirmButtonText: 'OK'
        //     });
        //     return;
        // }

        const fetchProgressions = async () => {
            if (!user) return; // Si l'utilisateur n'est pas connecté, ne rien faire

            try {
                const response = await fetch(`/api/user/progress`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProgressions(data);
            } catch (error) {
                console.error('Error fetching progressions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressions();
    }, [user]);

    if (loading) return <p className="text-gray-500 text-center dark:text-gray-400 mt-5">Chargement...</p>;

    const getProgressColor = (progress: number) => {
        if (progress === 100) return 'bg-green-500'; // Complété
        if (progress >= 75) return 'bg-green-400'; // 75% et plus
        if (progress >= 50) return 'bg-yellow-400'; // 50% à 74%
        if (progress >= 25) return 'bg-orange-400'; // 25% à 49%
        return 'bg-red-400'; // Moins de 25%
    };

    const completedChapters = progressions.filter(progress => progress.completed);
    const inProgressChapters = progressions.filter(progress => !progress.completed);

    const renderTable = (chapters: LessonProgress[]) => (
        <table className="min-w-full table-auto bg-slate-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow hidden md:table mt-5">
            <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                    <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-200">Chapitre</th>
                    <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-200">Progression</th>
                    <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-200">Statut</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {chapters.map((progress) => (
                    <tr key={progress.id} className="hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                        <td className="py-5 px-4 text-gray-700 dark:text-gray-300">
                            <span className="font-bold">{progress.lesson.title}</span> <br /><span className="text-sm text-slate-400">{progress.lesson.course.title}</span>
                            <div className="progress-bar w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
                                <div
                                    className={`progress h-full ${getProgressColor(Math.min(progress.progress, 100))} rounded-full`}
                                    style={{ width: `${Math.min(progress.progress, 100)}%` }}
                                ></div>
                            </div>
                        </td>
                        <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                            {Math.min(parseFloat(progress.progress.toFixed(2)), 100).toFixed(0)} %
                        </td>
                        <td className={`py-2 px-4 text-sm ${progress.completed ? 'text-green-500' : 'text-yellow-500'} dark:${progress.completed ? 'text-green-300' : 'text-yellow-400'}`}>
                            {progress.completed ? 'Achevé' : 'En cours'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="p-6">
            <div className="mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Progressions des chapitres</h2>
                <div className="mt-4 overflow-x-auto">

                    {/* Tableau pour les chapitres en cours */}
                    {inProgressChapters.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">Chapitres en cours</h3>
                            {renderTable(inProgressChapters)}
                        </div>
                    )}

                    {/* Tableau pour les chapitres terminés */}
                    {completedChapters.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Chapitres terminés</h3>
                            {renderTable(completedChapters)}
                        </div>
                    )}

                    {/* Responsive pour les petits écrans */}
                    <div className="md:hidden">
                        {inProgressChapters.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">Chapitres en cours</h3>
                                {inProgressChapters.map((progress) => (
                                    <div key={progress.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{progress.lesson.title}</h3>
                                        <div className="progress-bar w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600 mt-2">
                                            <div
                                                className={`progress h-full ${getProgressColor(Math.min(progress.progress, 100))} rounded-full`}
                                                style={{ width: `${Math.min(progress.progress, 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            Progression : {Math.min(parseFloat(progress.progress.toFixed(2)), 100).toFixed(2)} %
                                        </p>
                                        <p className={`text-sm ${progress.completed ? 'text-green-500' : 'text-yellow-500'} dark:${progress.completed ? 'text-green-300' : 'text-yellow-400'}`}>
                                            {progress.completed ? 'Achevé' : 'En cours'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {completedChapters.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Chapitres terminés</h3>
                                {completedChapters.map((progress) => (
                                    <div key={progress.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{progress.lesson.title}</h3>
                                        <div className="progress-bar w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600 mt-2">
                                            <div
                                                className={`progress h-full ${getProgressColor(Math.min(progress.progress, 100))} rounded-full`}
                                                style={{ width: `${Math.min(progress.progress, 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            Progression : {Math.min(parseFloat(progress.progress.toFixed(2)), 100).toFixed(2)} %
                                        </p>
                                        <p className={`text-sm ${progress.completed ? 'text-green-500' : 'text-yellow-500'} dark:${progress.completed ? 'text-green-300' : 'text-yellow-400'}`}>
                                            {progress.completed ? 'Achevé' : 'En cours'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProgressions;
