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
    const coursesPerPage = 9;
    const [searchTerm, setSearchTerm] = useState('');
    const [courseProgressions, setCourseProgressions] = useState<{ id: string; progress: number }[]>([]);
    const [selectedTab, setSelectedTab] = useState(0);

    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    const handleCourseDelete = (deletedCourseId: string) => {
        setCourses(prevCourses => prevCourses.filter(course => course.id !== deletedCourseId));
        setSelectedTab(0);
    };

    // Fonction pour récupérer les cours et les progressions
    useEffect(() => {
        const fetchCoursesAndProgressions = async () => {
            setLoading(true);
            try {
                const courseResponse = await fetch('/api/course');
                if (!courseResponse.ok) throw new Error('Erreur lors de la récupération des cours.');
                const courseData = await courseResponse.json();
                setCourses(courseData);

                if (isSignedIn && user) {
                    const progressResponses = await Promise.all(
                        courseData.map((course: Course) => fetch(`/api/user/progress/course/${course.id}`))
                    );
                    const progressData = await Promise.all(progressResponses.map(res => res.json()));
                    const formattedProgressions = courseData.map((course: Course, index: number) => ({
                        id: course.id,
                        progress: progressData[index]?.[0]?.progress || 0,
                    }));
                    setCourseProgressions(formattedProgressions);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des cours et progressions :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoursesAndProgressions();
    }, [isSignedIn, user]);

    // Tri des cours par "Nouveau" et date de mise à jour
    const sortedCourses = useMemo(() => {
        const now = new Date().getTime();
        return [...courses].sort((a, b) => {
            const isANew = (now - new Date(a.createdAt).getTime()) / (1000 * 3600 * 24) < 4;
            const isBNew = (now - new Date(b.createdAt).getTime()) / (1000 * 3600 * 24) < 4;
            if (isANew && !isBNew) return -1;
            if (!isANew && isBNew) return 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [courses]);

    // Filtrer et paginer les cours
    const filteredCourses = useMemo(() => {
        return sortedCourses.filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedCourses, searchTerm]);

    const getCoursesByProgress = (progressFilter: (progress: number) => boolean) => {
        return filteredCourses.filter(course => {
            const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
            return progressFilter(progress);
        });
    };

    const completedCourses = getCoursesByProgress(progress => progress >= 100);
    const ongoingCourses = getCoursesByProgress(progress => progress > 0 && progress < 100);
    const notStartedCourses = getCoursesByProgress(progress => progress === 0);

    const paginateCourses = (courseList: Course[]) => {
        const indexOfLastCourse = currentPage * coursesPerPage;
        const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
        return courseList.slice(indexOfFirstCourse, indexOfLastCourse);
    };

    // Réinitialiser la page courante lorsque l'onglet ou le terme de recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTab, searchTerm]);

    // Composant de liste de cours avec pagination
    const CourseListWithPagination = ({ courses, totalCourses }: { courses: Course[], totalCourses: number }) => (
        <>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCourses / coursesPerPage)}
                paginate={paginate => setCurrentPage(paginate)}
            />
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    Array.from({ length: 9 }).map((_, index) => (
                        <Placeholder key={index} />
                    ))
                ) : courses.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg col-span-full">
                        Aucun cours disponible.
                    </p>
                ) : (
                    courses.map(course => {
                        const progress = courseProgressions.find(p => p.id === course.id)?.progress || 0;
                        return <CourseCard key={course.id} course={course} progress={progress} onDelete={() => handleCourseDelete(course.id)} />;
                    })
                )}
            </div>
        </>
    );

    return (
        <div className="min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
            <div className="px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Cours</h1>

                {/* Barre de recherche */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher un cours..."
                        className="border rounded-lg px-4 py-2 w-full border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Bouton d'ajout de cours pour les admins */}
                {isSignedIn && isAdmin && (
                    <div className="mb-8">
                        <button
                            onClick={() => router.push(`/admin/course`)}
                            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ajouter un cours
                        </button>
                    </div>
                )}

                {/* Onglets */}
                <TabGroup selectedIndex={selectedTab} onChange={(index) => setSelectedTab(index)}>
                    <TabList className="mb-4 flex justify-between sm:justify-end gap-2">
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none inline-block ${selected ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 font-normal border-b-2 border-transparent hover:text-red-400'}`
                        }>
                            <Clock className="inline-block sm:mr-2" />
                            <span className="hidden sm:inline-block text-sm">En cours</span>
                        </Tab>
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none inline-block ${selected ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 font-normal border-b-2 border-transparent hover:text-red-400'}`
                        }>
                            <Play className="inline-block sm:mr-2" />
                            <span className="hidden sm:inline-block text-sm">Pas commencés</span>
                        </Tab>
                        <Tab className={({ selected }) =>
                            `py-2 px-4 cursor-pointer focus:outline-none inline-block ${selected ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400 font-normal border-b-2 border-transparent hover:text-red-400'}`
                        }>
                            <CheckCircle className="inline-block sm:mr-2" />
                            <span className="hidden sm:inline-block text-sm">Terminés</span>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <CourseListWithPagination courses={paginateCourses(ongoingCourses)} totalCourses={ongoingCourses.length} />
                        </TabPanel>
                        <TabPanel>
                            <CourseListWithPagination courses={paginateCourses(notStartedCourses)} totalCourses={notStartedCourses.length} />
                        </TabPanel>
                        <TabPanel>
                            <CourseListWithPagination courses={paginateCourses(completedCourses)} totalCourses={completedCourses.length} />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
            </div>
        </div>
    );
}
