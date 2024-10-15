"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/types";
import { PanelsTopLeftIcon, CheckIcon } from "lucide-react"; // Import the Menu icon and Check icon

export default function LessonPage({ params }: { params: { lessonId: string } }) {
    const initialLessonId = params.lessonId;
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]); // Liste des leçons du cours
    const [chapterProgress, setChapterProgress] = useState<{ [key: string]: number }>({}); // État pour suivre la progression de chaque chapitre
    const [readChapters, setReadChapters] = useState<{ [key: string]: boolean }>({}); // État pour suivre si un chapitre a été lu
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

    function debounce<F extends (...args: unknown[]) => void>(func: F, wait: number) {
        let timeout: NodeJS.Timeout | undefined;
    
        return function (...args: Parameters<F>) {
            const later = () => {
                if (timeout) {
                    clearTimeout(timeout);
                }
                func(...args);
            };
    
            if (timeout) {
                clearTimeout(timeout);
            }
            
            timeout = setTimeout(later, wait);
        };
    }

    // Fonction pour mettre à jour la progression en fonction du scroll de la page
    const handleScroll = debounce(() => {
        if (lesson) {
            const { scrollY, innerHeight } = window; // Position de scroll actuelle et hauteur de la fenêtre
            const totalHeight = document.documentElement.scrollHeight; // Hauteur totale de la page
            const progress = (scrollY / (totalHeight - innerHeight)) * 100; // Calcul de la progression

            const currentLessonId = lesson?.id;
            if (currentLessonId) {
                setChapterProgress((prev) => ({
                    ...prev,
                    [currentLessonId]: progress,
                }));

                // Vérifier si le chapitre a été lu (100%)
                if (progress >= 100 && !readChapters[currentLessonId]) {
                    setReadChapters((prev) => ({
                        ...prev,
                        [currentLessonId]: true, // Marquer comme lu
                    }));
                }

                console.log(chapterProgress)

                // Calculer le pourcentage total du cours
                const totalChapters = lessons.length;
                const completedChapters = Object.values(readChapters).filter(checked => checked).length; // Chapitres déjà lus
                const courseProgress = ((completedChapters + (progress >= 100 ? 1 : 0)) / totalChapters) * 100;

                // Afficher le pourcentage de progression du cours dans la console
                console.log(`Progression du cours: ${courseProgress.toFixed(2)}%`);
            }
        }
    }, 200);

    // Attache l'événement de scroll à la fenêtre
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lesson, handleScroll]);

    const handleLessonClick = async (lessonId: string) => {
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
                style={{
                    top: 0,
                    left: 0,
                    height: "100vh",
                    maxHeight: "100vh", // Limiter la hauteur
                    overflowY: "auto",   // Activer le défilement vertical
                }}
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
                                {readChapters[l.id] && ( // Afficher l'icône de check si le chapitre a été lu
                                    <CheckIcon className="inline-block ml-2 text-green-500" size={16} />
                                )}
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
