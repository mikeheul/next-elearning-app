"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/interfaces';
import CourseCard from './_components/CourseCard';
import Pagination from './[courseId]/_components/Pagination';
import { useUser } from '@clerk/nextjs';
import { Tab } from '@headlessui/react';
import { Clock, Play, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseProgressions, setCourseProgressions] = useState<{ id: string; progress: number }[]>([]);
    const [selectedTab, setSelectedTab] = useState(0); // Onglet sélectionné

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

    useEffect(() => {
        const fetchProgressions = async () => {
            if (isSignedIn && user) {
                try {
                    const responses = await Promise.all(
                        courses.map(course => fetch(`/api/user/progress/course/${course.id}`))
                    );
                    const progressions = await Promise.all(responses.map(res => res.json()));
                    const formattedProgressions = progressions.map((progress, index) => ({
                        id: courses[index].id,
                        progress: progress.length > 0 ? progress[0].progress : 0,
                    }));
                    setCourseProgressions(formattedProgressions);
                } catch (error) {
                    console.error('Erreur lors de la récupération des progressions :', error);
                }
            }
        };

        fetchProgressions();
    }, [isSignedIn, user, courses]);

    // Filtrer tous les cours par terme de recherche
    const filteredCourses = useMemo(() => {
        return courses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [courses, searchTerm]);

    // Filtrage des cours en fonction du statut
    const completedCourses = useMemo(() => {
        return filteredCourses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progress >= 100;
        });
    }, [filteredCourses, courseProgressions]);

    const ongoingCourses = useMemo(() => {
        return filteredCourses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progress > 0 && progress < 100;
        });
    }, [filteredCourses, courseProgressions]);

    const notStartedCourses = useMemo(() => {
        return filteredCourses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progress === 0;
        });
    }, [filteredCourses, courseProgressions]);

    // Pagination des cours par statut
    const paginateCourses = (courseList: Course[], currentPage: number) => {
        const indexOfLastCourse = currentPage * coursesPerPage;
        const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
        return courseList.slice(indexOfFirstCourse, indexOfLastCourse);
    };

    // Pagination pour chaque type de cours
    const currentCompletedCourses = paginateCourses(completedCourses, currentPage);
    const currentOngoingCourses = paginateCourses(ongoingCourses, currentPage);
    const currentNotStartedCourses = paginateCourses(notStartedCourses, currentPage);

    // Calculer le nombre total de pages pour chaque type de cours
    const totalCompletedPages = Math.ceil(completedCourses.length / coursesPerPage);
    const totalOngoingPages = Math.ceil(ongoingCourses.length / coursesPerPage);
    const totalNotStartedPages = Math.ceil(notStartedCourses.length / coursesPerPage);

    // Réinitialiser la page courante lorsque l'onglet change ou que le terme de recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTab, searchTerm]);

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
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>

                {/* Bouton d'ajout de cours pour les admins */}
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

                {/* Onglets pour "En cours", "Pas commencés" et "Terminés" */}
                <Tab.Group selectedIndex={selectedTab} onChange={(index) => setSelectedTab(index)}>
                    <Tab.List className="mb-4 flex flex-col md:flex-row justify-end gap-2">
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none 
                            ${selected ? 'text-red-400 font-bold border-b-2 border-red-400' : 'dark:text-gray-400 hover:text-red-400'}`}
                        >
                            <Clock className="inline-block mr-2" />
                            <span className="text-sm">En cours</span>
                        </Tab>
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none
                            ${selected ? 'text-red-400 font-bold border-b-2 border-red-400' : 'dark:text-gray-400 hover:text-red-400'}`}
                        >
                            <Play className="inline-block mr-2" />
                            <span className="text-sm">Pas commencés</span>
                        </Tab>
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none
                            ${selected ? 'text-red-400 font-bold border-b-2 border-red-400' : 'dark:text-gray-400 hover:text-red-400'}`}
                        >
                            <CheckCircle className="inline-block mr-2" />
                            <span className="text-sm">Terminés</span>
                        </Tab>
                    </Tab.List>

                    <Tab.Panels>
                        {/* Onglet "En cours" */}
                        <Tab.Panel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalOngoingPages}
                                paginate={paginate => setCurrentPage(paginate)}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {currentOngoingCourses.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentOngoingCourses.map(course => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return <CourseCard key={course.id} course={course} progress={progress} />;
                                    })
                                )}
                            </div>
                        </Tab.Panel>

                        {/* Onglet "Pas commencés" */}
                        <Tab.Panel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalNotStartedPages}
                                paginate={paginate => setCurrentPage(paginate)}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {currentNotStartedCourses.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentNotStartedCourses.map(course => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return <CourseCard key={course.id} course={course} progress={progress} />;
                                    })
                                )}
                            </div>
                        </Tab.Panel>

                        {/* Onglet "Terminés" */}
                        <Tab.Panel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalCompletedPages}
                                paginate={paginate => setCurrentPage(paginate)}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {currentCompletedCourses.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentCompletedCourses.map(course => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return <CourseCard key={course.id} course={course} progress={progress} />;
                                    })
                                )}
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    );
}
