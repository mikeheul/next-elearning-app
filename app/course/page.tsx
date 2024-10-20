"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/types';
import CourseCard from './_components/CourseCard';
import Pagination from './[courseId]/_components/Pagination';
import { useUser } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(6);
    const [searchTerm, setSearchTerm] = useState('');
    
    const router = useRouter();
    const { isSignedIn, user } = useUser();

    const isAdmin = user?.publicMetadata?.role === 'admin';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/course');
                if (!response.ok) throw new Error('Erreur lors de la récupération des cours.');
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des cours :', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Utilisation de useMemo pour le filtrage des cours
    const filteredCourses = useMemo(() => 
        courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        ), [courses, searchTerm]
    );

    // Calcul des cours à afficher pour la page actuelle
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = useMemo(() => 
        filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse), 
        [filteredCourses, indexOfFirstCourse, indexOfLastCourse]
    );

    // Calcul du nombre total de pages
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    // Fonction pour changer de page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return <p className="text-center text-gray-500 mt-5">Chargement...</p>;
    }

    return (
        <div className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Cours</h1>

                {/* Barre de recherche */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher un cours..."
                        className="border rounded-lg px-4 py-2 w-full border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => {
                            setCurrentPage(1); // Reset to the first page when the search term changes
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>

                {/* Bouton d'ajout de cours visible uniquement pour les admins */}
                {isSignedIn && isAdmin && (
                    <div className="mb-8">
                        <button
                            onClick={() => router.push(`/admin/course`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ajouter un cours
                        </button>
                    </div>
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                />

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {currentCourses.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                            Aucun cours disponible.
                        </p>
                    ) : (
                        currentCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}