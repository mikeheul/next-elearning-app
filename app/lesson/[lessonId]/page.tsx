"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/types";
import { PanelsTopLeftIcon } from "lucide-react"; // Import the Menu icon for mobile

export default function LessonPage({ params }: { params: { lessonId: string } }) {
    const initialLessonId = params.lessonId;
    const [lesson, setLesson] = useState<Lesson | null>(null);
    // const [loading, setLoading] = useState(true);
    const [lessons, setLessons] = useState<Lesson[]>([]); // Liste des leçons du cours
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle pour la barre latérale sur mobile
    const router = useRouter();

    useEffect(() => {
        async function fetchLesson(lessonId: string) {
            try {
                const response = await fetch(`/api/lesson/${lessonId}`);
                if (!response.ok) {
                    throw new Error("Leçon non trouvée");
                }
                const data = await response.json();
                setLesson(data);

                if (!lessons.length) {
                    fetchLessons(data.courseId);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la leçon :", error);
                router.push("/404");
            } finally {
                // setLoading(false);
            }
        }

        async function fetchLessons(courseId: string) {
            try {
                const response = await fetch(`/api/course/${courseId}/lessonslist`);
                if (response.ok) {
                    const lessonsData = await response.json();
                    setLessons(lessonsData);
                } else {
                    console.error("Erreur lors de la récupération des leçons du cours.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des leçons :", error);
            }
        }

        fetchLesson(initialLessonId);
    }, [initialLessonId, router, lessons.length]);

    const handleLessonClick = async (lessonId: string) => {
        // setLoading(true);
        try {
            const response = await fetch(`/api/lesson/${lessonId}`);
            if (response.ok) {
                const data = await response.json();
                setLesson(data);
            } else {
                console.error("Erreur lors de la récupération de la leçon sélectionnée.");
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la nouvelle leçon :", error);
        } finally {
            // setLoading(false);
        }
    };

    if (!lesson) {
        return <p className="text-center text-gray-400 mt-5">...</p>;
    }

    const lessonContent = marked(lesson.content);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chapitres</h2>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-gray-900 dark:text-white"
                >
                    <PanelsTopLeftIcon className="h-6 w-6" />
                </button>
            </div>

            <aside
                className={`fixed md:relative z-40 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:mr-8 transition-transform duration-300 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
                style={{ top: 0, left: 0, height: "100vh" }} 
            >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Chapitres</h2>
                <ul className="space-y-2">
                    {lessons.map((l) => (
                        <li key={l.id}>
                            <button
                                onClick={() => {
                                    handleLessonClick(l.id);
                                    setIsSidebarOpen(false); 
                                }}
                                className={`block w-full text-left px-4 py-2 rounded-lg ${
                                    l.id === lesson.id
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {l.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Overlay pour fermer la barre latérale sur mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Contenu de la leçon */}
            <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <h1 className="text-md text-gray-900 dark:text-yellow-500 mb-6">
                    <a className="font-bold" href={`/course/${lesson.courseId}`}>
                        {lesson.course.title}
                    </a>{" "}
                    / {lesson.title}
                </h1>
                <div
                    className="prose prose-md text-gray-800 dark:text-gray-200"
                    dangerouslySetInnerHTML={{ __html: lessonContent }}
                ></div>
            </div>
        </div>
    );
}
