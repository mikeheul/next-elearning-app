"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/types";
import { PanelsTopLeftIcon, CheckIcon } from "lucide-react";

export default function LessonPage({ params }: { params: { lessonId: string } }) {
    const initialLessonId = params.lessonId; // Récupération de l'ID de la leçon à partir des paramètres de la route
    const [lesson, setLesson] = useState<Lesson | null>(null); // État pour stocker la leçon actuelle
    const [lessons, setLessons] = useState<Lesson[]>([]); // Liste des leçons du cours
    const [chapterProgress, setChapterProgress] = useState<{ [key: string]: number }>({}); // État pour suivre la progression de chaque chapitre
    const [readChapters, setReadChapters] = useState<{ [key: string]: boolean }>({}); // État pour suivre si un chapitre a été lu
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle pour la barre latérale sur mobile
    const router = useRouter(); // Hook pour accéder à l'instance du routeur

    // Effet pour récupérer les données de la leçon et des leçons du cours
    useEffect(() => {
        async function fetchLesson(lessonId: string) {
            try {
                const response = await fetch(`/api/lesson/${lessonId}`); // Requête pour récupérer les détails de la leçon
                if (!response.ok) {
                    throw new Error("Leçon non trouvée"); // Gestion d'erreur si la leçon n'est pas trouvée
                }
                const data = await response.json(); // Conversion de la réponse en JSON
                setLesson(data); // Mise à jour de l'état avec la leçon récupérée

                if (!lessons.length) { // Si aucune leçon n'est déjà chargée, récupérer les leçons du cours
                    fetchLessons(data.courseId);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la leçon :", error);
                router.push("/404"); // Redirection vers une page 404 en cas d'erreur
            }
        }

        // Fonction pour récupérer la liste des leçons d'un cours
        async function fetchLessons(courseId: string) {
            try {
                const response = await fetch(`/api/course/${courseId}/lessonslist`); // Requête pour récupérer la liste des leçons
                if (response.ok) {
                    const lessonsData = await response.json(); // Conversion de la réponse en JSON
                    setLessons(lessonsData); // Mise à jour de l'état avec les leçons
                } else {
                    console.error("Erreur lors de la récupération des leçons du cours.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des leçons :", error);
            }
        }

        fetchLesson(initialLessonId); // Appel de la fonction pour récupérer la leçon initiale
    }, [initialLessonId, router, lessons.length]); // Dépendances de l'effet

    // Fonction de debounce pour limiter la fréquence d'exécution d'une fonction
    function debounce<F extends (...args: unknown[]) => void>(func: F, wait: number) {
        let timeout: NodeJS.Timeout | undefined;

        return function (...args: Parameters<F>) {
            const later = () => {
                if (timeout) {
                    clearTimeout(timeout); // Nettoyage du timeout
                }
                func(...args); // Exécution de la fonction
            };

            if (timeout) {
                clearTimeout(timeout); // Nettoyage du timeout précédent
            }
            
            timeout = setTimeout(later, wait); // Réglage du nouveau timeout
        };
    }

    // Fonction pour mettre à jour la progression en fonction du scroll de la page
    const handleScroll = debounce(() => {
        if (lesson) {
            const { scrollY, innerHeight } = window; // Position de scroll actuelle et hauteur de la fenêtre
            const totalHeight = document.documentElement.scrollHeight; // Hauteur totale de la page
            const progress = (scrollY / (totalHeight - innerHeight)) * 101; // Calcul de la progression

            const currentLessonId = lesson?.id; // ID de la leçon actuelle
            if (currentLessonId) {
                // Mettre à jour la progression du chapitre
                setChapterProgress((prev) => ({
                    ...prev,
                    [currentLessonId]: progress,
                }));

                console.log(chapterProgress)

                // Vérifier si le chapitre a été lu (100%)
                if (progress >= 100 && !readChapters[currentLessonId]) {
                    setReadChapters((prev) => ({
                        ...prev,
                        [currentLessonId]: true, // Marquer comme lu
                    }));
                }

                console.log(progress); // Afficher la progression actuelle dans la console

                // Calculer le pourcentage total du cours
                const totalChapters = lessons.length; // Nombre total de chapitres
                const completedChapters = Object.values(readChapters).filter(checked => checked).length; // Chapitres déjà lus
                const courseProgress = ((completedChapters + (progress >= 100 ? 1 : 0)) / totalChapters) * 100; // Pourcentage de progression du cours

                // Afficher le pourcentage de progression du cours dans la console
                console.log(`Progression du cours: ${courseProgress.toFixed(2)}%`);
            }
        }
    }, 200); // Débounce de 200 ms pour gérer le scroll

    // Attache l'événement de scroll à la fenêtre
    useEffect(() => {
        window.addEventListener("scroll", handleScroll); // Écouteur d'événement pour le défilement
        return () => {
            window.removeEventListener("scroll", handleScroll); // Nettoyage de l'écouteur lors du démontage
        };
    }, [lesson, handleScroll]); // Dépendances de l'effet

    // Fonction pour gérer le clic sur une leçon
    const handleLessonClick = async (lessonId: string) => {
        try {
            const response = await fetch(`/api/lesson/${lessonId}`); // Requête pour récupérer les détails de la leçon sélectionnée
            if (response.ok) {
                const data = await response.json(); // Conversion de la réponse en JSON
                setLesson(data); // Mise à jour de l'état avec la leçon récupérée
            } else {
                console.error("Erreur lors de la récupération de la leçon sélectionnée.");
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la nouvelle leçon :", error);
        }
    };

    // Affichage d'un message de chargement si la leçon n'est pas encore disponible
    if (!lesson) {
        return <p className="text-center text-gray-400 mt-5">...</p>;
    }

    // Conversion du contenu de la leçon en HTML à partir du Markdown
    const lessonContent = marked(lesson.content);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
            {/* En-tête mobile */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chapitres</h2>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle pour ouvrir/fermer la barre latérale
                    className="text-gray-900 dark:text-white"
                >
                    <PanelsTopLeftIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Barre latérale des chapitres */}
            <aside
                className={`fixed md:relative z-40 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:mr-8 transition-transform duration-300 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
                style={{
                    top: 0,
                    left: 0,
                    height: "100vh", // Hauteur fixe de la barre latérale
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
                                    handleLessonClick(l.id); // Charger la leçon sélectionnée
                                    setIsSidebarOpen(false); // Fermer la barre latérale après sélection
                                }}
                                className={`block w-full text-left px-4 py-2 rounded-lg ${
                                    l.id === lesson.id // Vérification si la leçon est actuellement sélectionnée
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-900 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {l.title} {/* Titre de la leçon */}
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
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" // Couverture sombre sur l'écran pour le mode mobile
                    onClick={() => setIsSidebarOpen(false)} // Fermer la barre latérale lorsque l'overlay est cliqué
                ></div>
            )}

            {/* Contenu de la leçon */}
            <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <h1 className="text-md text-gray-900 dark:text-yellow-500 mb-6">
                    <a className="font-bold" href={`/course/${lesson.courseId}`}>
                        {lesson.course.title} {/* Titre du cours */}
                    </a>{" "}
                    / {lesson.title} {/* Titre de la leçon */}
                </h1>
                <div
                    className="prose prose-md text-gray-800 dark:text-gray-200" // Styles de prose pour le contenu
                    dangerouslySetInnerHTML={{ __html: lessonContent }} // Insertion du contenu HTML
                ></div>
            </div>
        </div>
    );
}
