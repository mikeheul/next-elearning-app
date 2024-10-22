"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/interfaces';
import CourseCard from './_components/CourseCard';
import Pagination from './[courseId]/_components/Pagination';
import { useUser } from '@clerk/nextjs';
import { Tab } from '@headlessui/react';

import { Clock, Play, CheckCircle } from 'lucide-react'; // Importez les icônes nécessaires

export const dynamic = 'force-dynamic';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseProgressions, setCourseProgressions] = useState<{ id: string; progress: number }[]>([]);
    const [selectedTab, setSelectedTab] = useState(0); // Pour gérer l'onglet sélectionné

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
                        courses.map(course => 
                            fetch(`/api/user/progress/course/${course.id}`)
                        )
                    );

                    const progressions = await Promise.all(responses.map(res => res.json()));
                    const formattedProgressions = progressions.map((progress, index) => ({
                        id: courses[index].id,
                        progress: progress.length > 0 ? progress[0].progress : 0
                    }));

                    setCourseProgressions(formattedProgressions);
                } catch (error) {
                    console.error('Erreur lors de la récupération des progressions :', error);
                }
            }
        };

        fetchProgressions();
    }, [isSignedIn, user, courses]);

    // Filtrage des cours en fonction de l'onglet actif
    const completedCourses = useMemo(() => 
        courses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progress >= 100;
        }), 
        [courses, courseProgressions]
    );

    const ongoingCourses = useMemo(() => 
        courses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progress > 0 && progress < 100; // En cours
        }), 
        [courses, courseProgressions]
    );

    const notStartedCourses = useMemo(() => 
        courses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progress === 0; // Pas commencés
        }), 
        [courses, courseProgressions]
    );

    // Filtrage basé sur le terme de recherche
    const filteredCompletedCourses = useMemo(() => 
        completedCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [completedCourses, searchTerm]
    );

    const filteredOngoingCourses = useMemo(() => 
        ongoingCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [ongoingCourses, searchTerm]
    );

    const filteredNotStartedCourses = useMemo(() => 
        notStartedCourses.filter(course => 
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [notStartedCourses, searchTerm]
    );

    // Pagination pour les cours
    const totalCompletedPages = Math.ceil(filteredCompletedCourses.length / coursesPerPage);
    const totalOngoingPages = Math.ceil(filteredOngoingCourses.length / coursesPerPage);
    const totalNotStartedPages = Math.ceil(filteredNotStartedCourses.length / coursesPerPage);

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;

    const currentCompletedCourses = useMemo(() => 
        filteredCompletedCourses.slice(indexOfFirstCourse, indexOfLastCourse), 
        [filteredCompletedCourses, indexOfFirstCourse, indexOfLastCourse]
    );

    const currentOngoingCourses = useMemo(() => 
        filteredOngoingCourses.slice(indexOfFirstCourse, indexOfLastCourse), 
        [filteredOngoingCourses, indexOfFirstCourse, indexOfLastCourse]
    );

    const currentNotStartedCourses = useMemo(() => 
        filteredNotStartedCourses.slice(indexOfFirstCourse, indexOfLastCourse), 
        [filteredNotStartedCourses, indexOfFirstCourse, indexOfLastCourse]
    );

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
                            setCurrentPage(1); // Réinitialiser à la première page lors du changement de terme de recherche
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

                {/* Onglets pour "En cours", "Pas commencés" et "Terminés" */}
                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                    <Tab.List className="mb-4 flex justify-end space-x-4">
                        <Tab className={({ selected }) => 
                            `py-2 px-4 cursor-pointer focus:outline-none 
                            ${selected ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'dark:text-gray-400 hover:text-blue-600'}`
                        }>
                            <Clock className="inline-block mr-2" />
                            <span className="text-sm">En cours</span>
                        </Tab>
                        <Tab className={({ selected }) => 
                            `py-2 px-4 cursor-pointer focus:outline-none
                            ${selected ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'dark:text-gray-400 hover:text-blue-600'}`
                        }>
                            <Play className="inline-block mr-2" />
                            <span className="text-sm">Pas commencés</span>
                        </Tab>
                        <Tab className={({ selected }) => 
                            `py-2 px-4 cursor-pointer focus:outline-none
                            ${selected ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'dark:text-gray-400 hover:text-blue-600'}`
                        }>
                            <CheckCircle className="inline-block mr-2" />
                            <span className="text-sm">Terminés</span>
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalOngoingPages}
                                paginate={paginate => {
                                    setCurrentPage(paginate);
                                    setSelectedTab(0); // Reset à l'onglet "En cours" quand on change de page
                                }}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {currentOngoingCourses.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentOngoingCourses.map((course) => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return (
                                            <CourseCard key={course.id} course={course} progress={progress} />
                                        );
                                    })
                                )}
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalNotStartedPages}
                                paginate={paginate => {
                                    setCurrentPage(paginate);
                                    setSelectedTab(1); // Reset à l'onglet "Pas commencés" quand on change de page
                                }}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {currentNotStartedCourses.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentNotStartedCourses.map((course) => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return (
                                            <CourseCard key={course.id} course={course} progress={progress} />
                                        );
                                    })
                                )}
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalCompletedPages}
                                paginate={paginate => {
                                    setCurrentPage(paginate);
                                    setSelectedTab(2); // Reset à l'onglet "Terminés" quand on change de page
                                }}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {currentCompletedCourses.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentCompletedCourses.map((course) => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return (
                                            <CourseCard key={course.id} course={course} progress={progress} />
                                        );
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
