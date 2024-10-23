"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/interfaces';
import CourseCard from './_components/CourseCard';
import Pagination from './[courseId]/_components/Pagination';
import { useUser } from '@clerk/nextjs';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Clock, Play, CheckCircle } from 'lucide-react';
import Placeholder from '@/components/Placeholder';

export const dynamic = 'force-dynamic';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseProgressions, setCourseProgressions] = useState<{ id: string; progress: number }[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [showNoCoursesMessage, setShowNoCoursesMessage] = useState(false);

    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    useEffect(() => {
        const fetchCoursesAndProgressions = async () => {
            setLoading(true);
            setShowNoCoursesMessage(false);
            try {
                const courseResponse = await fetch('/api/course');
                if (!courseResponse.ok) throw new Error('Erreur lors de la récupération des cours.');
                const courseData = await courseResponse.json();
                setCourses(courseData);
    
                if (isSignedIn && user) {
                    const responses = await Promise.all(
                        courseData.map((course: Course) => fetch(`/api/user/progress/course/${course.id}`))
                    );
                    const progressions = await Promise.all(responses.map(res => res.json()));
                    const formattedProgressions = progressions.map((progress, index) => ({
                        id: courseData[index].id,
                        progress: progress.length > 0 ? progress[0].progress : 0,
                    }));
                    setCourseProgressions(formattedProgressions);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des cours et progressions :', error);
            } finally {
                setLoading(false); 

                setTimeout(() => {
                    if (ongoingCourses.length === 0 || notStartedCourses.length === 0 || completedCourses.length === 0) {
                        setShowNoCoursesMessage(true);
                    }
                }, 1500);
            }
        };
    
        fetchCoursesAndProgressions();
    }, [isSignedIn, user]);
    
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
                <TabGroup selectedIndex={selectedTab} onChange={(index) => setSelectedTab(index)}>
                    <TabList className="mb-4 flex flex-col md:flex-row justify-end gap-2">
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none 
                            ${selected ? 'text-red-400 font-bold border-b-2 border-red-400' : 'text-gray-400 hover:text-red-400'}`}
                        >
                            <Clock className="inline-block mr-2" />
                            <span className="text-sm">En cours</span>
                        </Tab>
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none
                            ${selected ? 'text-red-400 font-bold border-b-2 border-red-400' : 'text-gray-400 hover:text-red-400'}`}
                        >
                            <Play className="inline-block mr-2" />
                            <span className="text-sm">Pas commencés</span>
                        </Tab>
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none
                            ${selected ? 'text-red-400 font-bold border-b-2 border-red-400' : 'text-gray-400 hover:text-red-400'}`}
                        >
                            <CheckCircle className="inline-block mr-2" />
                            <span className="text-sm">Terminés</span>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        {/* Onglet "En cours" */}
                        <TabPanel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalOngoingPages}
                                paginate={paginate => setCurrentPage(paginate)}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {loading ? (
                                    // Render placeholders if loading
                                    Array.from({ length: 9 }).map((_, index) => (
                                        <Placeholder key={index} />
                                    ))
                                ) : currentOngoingCourses.length === 0 && showNoCoursesMessage ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                        Aucun cours disponible.
                                    </p>
                                ) : (
                                    currentOngoingCourses.map((course) => {
                                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                        return <CourseCard key={course.id} course={course} progress={progress} />;
                                    })
                                )}
                            </div>
                        </TabPanel>

                        {/* Onglet "Pas commencés" */}
                        <TabPanel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalNotStartedPages}
                                paginate={paginate => setCurrentPage(paginate)}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {loading ? (
                                    Array.from({ length: 9 }).map((_, index) => (
                                        <Placeholder key={index} />
                                    ))
                                ) : (
                                    currentNotStartedCourses.length === 0 && showNoCoursesMessage ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                            Aucun cours disponible.
                                        </p>
                                    ) : (
                                        currentNotStartedCourses.map(course => {
                                            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                            return <CourseCard key={course.id} course={course} progress={progress} />;
                                        })
                                    )
                                )}
                            </div>
                        </TabPanel>

                        {/* Onglet "Terminés" */}
                        <TabPanel>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalCompletedPages}
                                paginate={paginate => setCurrentPage(paginate)}
                            />
                            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {loading ? (
                                    Array.from({ length: 9 }).map((_, index) => (
                                        <Placeholder key={index} />
                                    ))
                                ) : (
                                    currentCompletedCourses.length === 0 && showNoCoursesMessage ? (
                                        <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                                            Aucun cours disponible.
                                        </p>
                                    ) : (
                                        currentCompletedCourses.map(course => {
                                            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                                            return <CourseCard key={course.id} course={course} progress={progress} />;
                                        })
                                    )
                                )}
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    );
}
