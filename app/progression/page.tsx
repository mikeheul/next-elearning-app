"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { LessonProgress } from "@/types/types";
import { LibraryBigIcon, Eye } from "lucide-react";

const UserProgressions = () => {
    const { user } = useUser();
    const [progressions, setProgressions] = useState<LessonProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgressions = async () => {
            if (!user) return;

            try {
                const response = await fetch(`/api/user/progress`);
                if (!response.ok) {
                throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setProgressions(data);
            } catch (error) {
                console.error("Error fetching progressions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressions();
    }, [user]);

    // Utilisez useMemo pour optimiser le regroupement des progressions par cours
    const progressionsByCourse = useMemo(() => {
        return progressions.reduce((acc, progress) => {
            const courseTitle = progress.lesson.course.title;
            if (!acc[courseTitle]) {
                acc[courseTitle] = { inProgress: [], completed: [] };
            }
            if (progress.completed) {
                acc[courseTitle].completed.push(progress);
            } else {
                acc[courseTitle].inProgress.push(progress);
            }
            return acc;
        }, {} as Record<string, { inProgress: LessonProgress[]; completed: LessonProgress[] }>);
    }, [progressions]);

    // Utilisez useCallback pour mémoriser les fonctions constantes
    const getProgressColor = useCallback((progress: number) => {
        if (progress === 100) return "bg-green-500";
        if (progress >= 75) return "bg-green-400";
        if (progress >= 50) return "bg-yellow-400";
        if (progress >= 25) return "bg-orange-400";
        return "bg-red-400";
    }, []);

    const renderTable = useCallback(
        (chapters: LessonProgress[]) => (
        <table className="text-center min-w-full table-fixed bg-slate-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow hidden md:table mt-5">
            <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                    <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-200 w-1/3">Chapitre</th>
                    <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-200 w-1/6">Progression</th>
                    <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-200 w-1/6">Statut</th>
                    <th className="py-2 px-4 text-center text-gray-700 dark:text-gray-200 w-1/6">Visualiser</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {chapters.map((progress) => (
                <tr key={progress.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/30 transition">
                    <td className="text-left py-5 px-4 text-gray-700 dark:text-gray-300">
                        {progress.lesson.title}
                        <div className="progress-bar w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
                                <div
                                    className={`progress h-full ${getProgressColor(Math.min(progress.progress, 100))} rounded-full`}
                                    style={{ width: `${Math.min(progress.progress, 100)}%` }}
                                ></div>
                        </div>
                    </td>
                    <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                        {Math.min(progress.progress, 100).toFixed(0)} %
                    </td>
                    <td className={`py-2 px-4 text-sm ${progress.completed ? "text-green-500" : "text-yellow-500"}`}>
                        {progress.completed ? "Terminé" : "En cours"}
                    </td>
                    <td className="py-2 px-4 text-center">
                        <Link href={`/lesson/${progress.lesson.id}`} className="dark:text-white flex justify-center items-center h-full">
                        <Eye size={20} />
                        </Link>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        ),
        [getProgressColor]
    );

    const renderResponsive = useCallback(
        (chapters: LessonProgress[]) => (
        <div className="md:hidden">
            {chapters.map((progress) => (
            <div key={progress.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700/60 rounded-lg shadow">
                <Link className="dark:text-white" href={`/lesson/${progress.lesson.id}`}>
                    {progress.lesson.title}
                </Link>
                <div className="progress-bar w-full h-2 bg-gray-200 rounded-full dark:bg-gray-600 mt-2">
                    <div
                        className={`progress h-full ${getProgressColor(Math.min(progress.progress, 100))} rounded-full`}
                        style={{ width: `${Math.min(progress.progress, 100)}%` }}
                    ></div>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Progression : {Math.min(progress.progress, 100).toFixed(0)} %</p>
                <p className={`text-sm ${progress.completed ? "text-green-500" : "text-yellow-500"}`}>
                    {progress.completed ? "Terminé" : "En cours"}
                </p>
                <Link href={`/lesson/${progress.lesson.id}`} className="p-3 text-white bg-emerald-500 hover:bg-emerald-600 mt-5 rounded-lg inline-flex justify-center items-center h-full transition duration-300">
                    <Eye size={20} />
                </Link>
            </div>
            ))}
        </div>
        ),
        [getProgressColor]
    );

    if (loading) {
        return <p className="text-gray-500 text-center dark:text-gray-400 mt-5">Chargement...</p>;
    }

    return (
        <div className="px-0 py-4 md:p-4">
            <div className="mx-auto p-3 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Progressions des chapitres par cours</h2>
                <div className="mt-4 overflow-x-auto">
                {Object.keys(progressionsByCourse).map((courseTitle) => (
                    <div key={courseTitle} className="mb-8 border dark:border-slate-600 p-6 rounded-lg">
                    {(progressionsByCourse[courseTitle].inProgress.length > 0 ||
                        progressionsByCourse[courseTitle].completed.length > 0) && (
                        <Link
                            className="flex gap-2 items-center"
                            href={`/course/${
                                progressionsByCourse[courseTitle].inProgress[0]?.lesson.course.id ||
                                progressionsByCourse[courseTitle].completed[0]?.lesson.course.id
                            }`}
                        >
                            <LibraryBigIcon className="dark:text-white" size={20} />
                            <span className="font-bold text-2xl dark:text-white">{courseTitle}</span>
                        </Link>
                    )}

                    {progressionsByCourse[courseTitle].inProgress.length > 0 && (
                        <>
                            <h4 className="text-md font-semibold text-yellow-600 dark:text-yellow-400 my-5">Chapitres en cours</h4>
                            {renderTable(progressionsByCourse[courseTitle].inProgress)}
                            {renderResponsive(progressionsByCourse[courseTitle].inProgress)}
                        </>
                    )}

                    {progressionsByCourse[courseTitle].completed.length > 0 && (
                        <>
                            <h4 className="text-md font-semibold text-green-600 dark:text-green-400 my-5">Chapitres terminés</h4>
                            {renderTable(progressionsByCourse[courseTitle].completed)}
                            {renderResponsive(progressionsByCourse[courseTitle].completed)}
                        </>
                    )}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default UserProgressions;
