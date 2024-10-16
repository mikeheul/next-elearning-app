'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Course } from '@/types/types';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableLesson from '../_components/SortableLesson';
import { DownloadIcon, LoaderCircleIcon } from 'lucide-react'; // Import a loading icon from lucide-react
import { useUser } from '@clerk/nextjs';

export default function CourseDetail({ params }: { params: { courseId: string } }) {

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false); // Détection mobile
    const router = useRouter();
    const courseId = params.courseId;

    const { isSignedIn } = useUser();

    useEffect(() => {
        // Détection de la taille de l'écran
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // Considérer mobile si largeur < 768px
        };

        // Vérifier à l'initialisation et ajouter un listener pour le redimensionnement
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        async function fetchCourse() {
            try {
                const response = await fetch(`/api/course/${courseId}`);

                if (response.ok) {
                    const data = await response.json();
                    setCourse(data);
                } else {
                    throw new Error('Erreur lors de la récupération du cours.');
                }
            } catch (error) {
                if (error instanceof Error) { // Type guard to check if error is an instance of Error
                    setError(error.message); // Safely access the message property
                } else {
                    setError('Une erreur inconnue est survenue.'); // Fallback for unknown error
                }
                router.push('/404');
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [courseId, router]);

    // Sensors for DnD Kit
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Handling drag and drop for lessons
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = course!.lessons.findIndex((lesson) => lesson.id === active.id);
            const newIndex = course!.lessons.findIndex((lesson) => lesson.id === over.id);

            const reorderedLessons = arrayMove(course!.lessons, oldIndex, newIndex);

            // Update local lessons
            setCourse((prev) => ({ ...prev!, lessons: reorderedLessons }));

            // Update order in the database
            await fetch(`/api/course/${courseId}/lessons`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    reorderedLessons.map((lesson, index) => ({
                        ...lesson,
                        order: index + 1,
                    }))
                ),
            });
        }
    };

    const handleQuizClick = (quizId: string) => {
        router.push(`/quiz/${quizId}`); // Redirect to the selected quiz page
    };

    const handleDownload = async () => {
        console.log("Download zip !")
    };

    const goToFirstLesson = () => {
        if (course && course.lessons.length > 0) {
            const firstLessonId = course.lessons[0].id; // ID de la première leçon
            router.push(`/lesson/${firstLessonId}`); // Redirection vers la première leçon
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-gray-900">
                <LoaderCircleIcon className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-center text-red-600 mt-5">
                {error}
            </p>
        );
    }

    if (!course) {
        return <p className="text-center text-gray-500 mt-5">Cours non trouvé.</p>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
                    {course.title}
                </h1>

                <div className="flex flex-col gap-3 md:flex-row my-8">
                    <button
                        onClick={handleDownload}
                        className="flex justify-center items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <DownloadIcon size={20} />
                    </button>

                    {/* Bouton pour accéder à la première leçon */}
                    <button
                            onClick={goToFirstLesson}
                            className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
                        >
                            Accéder au cours
                    </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
                    {course.description}
                </p>

                {isSignedIn && (
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => router.push(`/admin/lesson/${course.id}`)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ajouter un chapitre
                        </button>
                        <button
                            onClick={() => router.push(`/admin/${course.id}/quiz`)} // Use router to navigate
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            <span>Ajouter un Quiz</span>
                        </button>
                    </div>
                )}

                {/* Section des Leçons */}
                <div className="flex gap-5 items-center my-5">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Chapitres
                    </h2>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        {course.lessons.length} chapitre{course.lessons.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {!isMobile ? (
                    isSignedIn ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={course.lessons} strategy={verticalListSortingStrategy}>
                                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {course.lessons.length > 0 ? (
                                        course.lessons.map((lesson) => (
                                            <SortableLesson key={lesson.id} lesson={lesson} />
                                        ))
                                    ) : (
                                        <p className='dark:text-white'>Aucun chapitre pour ce cours</p>
                                    )}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {course.lessons.length > 0 ? (
                            course.lessons.map((lesson) => (
                                <div key={lesson.id}>
                                    <SortableLesson lesson={lesson} />
                                </div>
                            ))
                        ) : (
                            <p className='dark:text-white'>Aucun chapitre pour ce cours</p>
                        )}
                        </div>
                    )
                ) : (
                    // Si on est sur mobile, afficher les leçons sans drag-and-drop
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {course.lessons.length > 0 ? (
                            course.lessons.map((lesson) => (
                                <div key={lesson.id}>
                                    <SortableLesson lesson={lesson} />
                                </div>
                            ))
                        ) : (
                            <p className='dark:text-white'>Aucun chapitre pour ce cours</p>
                        )}
                    </div>
                )}
                
                {/* Section des Quizzes */}
                <div className="my-8 bg-slate-200 dark:bg-slate-800 p-6 rounded-md">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
                        Quizz
                    </h2>
                    {course.quizzes.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {course.quizzes.map((quiz: { id: string; title: string; }) => (
                                <div key={quiz.id} className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{quiz.title}</h4>
                                    <button
                                        onClick={() => handleQuizClick(quiz.id)}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Démarrer le Quiz
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='dark:text-white'>Aucun quiz disponible pour ce cours.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
