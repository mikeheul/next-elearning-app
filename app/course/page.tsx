"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/types';
import CourseCard from './_components/CourseCard';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await fetch('/api/course', {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error('Erreur lors de la récupération des cours.');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des cours :', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500 mt-5">Chargement...</p>;
    }

    return (
        <div className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                    Liste des cours
                </h1>

                {/* Bouton pour ajouter un nouveau cours */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push(`/admin/course`)} // Redirige vers la page de création de cours
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Ajouter un cours
                    </button>
                </div>

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {courses.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                            Aucun cours disponible.
                        </p>
                    ) : (
                        courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
