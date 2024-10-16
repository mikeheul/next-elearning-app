"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/types";
import { PanelsTopLeftIcon, CheckIcon, Loader2Icon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import Swal from 'sweetalert2';

const getProgressBarColor = (progress: number) => {
    if (progress === 100) {
        return 'bg-green-500';
    } else if (progress >= 75) {
        return 'bg-yellow-500'; 
    } else if (progress >= 50) {
        return 'bg-orange-500'; 
    } else {
        return 'bg-red-500'; 
    }
};

export default function LessonPage({ params }: { params: { lessonId: string } }) {
    const initialLessonId = params.lessonId; // Récupération de l'ID de la leçon à partir des paramètres de la route
    const [lesson, setLesson] = useState<Lesson | null>(null); // État pour stocker la leçon actuelle
    const [lessons, setLessons] = useState<Lesson[]>([]); // Liste des leçons du cours
    const [chapterProgress, setChapterProgress] = useState<{ [key: string]: number }>({}); // État pour suivre la progression de chaque chapitre
    const [courseProgress, setCourseProgress] = useState<number>(0); // État pour la progression du cours
    const [readChapters, setReadChapters] = useState<{ [key: string]: boolean }>({}); // État pour suivre si un chapitre a été lu
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle pour la barre latérale sur mobile
    const [isLoading, setIsLoading] = useState(false); // Ajout de l'état de chargement
    
    const router = useRouter(); // Hook pour accéder à l'instance du routeur
    const { user } = useUser();

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

                const progressResponse = await fetch(`/api/user/progress/${lessonId}`);
                if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    setChapterProgress((prev) => ({
                        ...prev,
                        [lessonId]: progressData.progress || 0, // mettez à jour avec la progression récupérée
                    }));
                    if (progressData.progress >= 100) {
                        setReadChapters((prev) => ({
                            ...prev,
                            [lessonId]: true, // Marque le chapitre comme lu
                        }));
                    }
                }

                if (!lessons.length) { // Si aucune leçon n'est déjà chargée, récupérer les leçons du cours
                    fetchLessons(data.courseId);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la leçon :", error);
                router.push("/404"); // Redirection vers une page 404 en cas d'erreur
            }
        }

        function calculateCourseProgress(updatedReadChapters: { [key: string]: boolean }, totalLessons: number) {
            const completedChapters = Object.values(updatedReadChapters).filter(Boolean).length;
            const newCourseProgress = (completedChapters / totalLessons) * 100;
            setCourseProgress(newCourseProgress);
            
            // Mettez à jour la progression dans la base de données
            if (lesson) {
                updateCourseProgress(lesson.courseId, newCourseProgress);
            }
        }

        // Fonction pour récupérer la liste des leçons d'un cours
        async function fetchLessons(courseId: string) {
            try {
                setIsLoading(true); // Démarrage du chargement des chapitres
                const response = await fetch(`/api/course/${courseId}/lessonslist`); // Requête pour récupérer la liste des leçons
                if (response.ok) {
                    const lessonsData = await response.json(); // Conversion de la réponse en JSON
                    setLessons(lessonsData); // Mise à jour de l'état avec les leçons

                    // Check read status for all lessons
                    const readStatusPromises = lessonsData.map(async (l: Lesson) => {
                        const progressResponse = await fetch(`/api/user/progress/${l.id}`);
                        if (progressResponse.ok) {
                            const progressData = await progressResponse.json();
                            return { id: l.id, completed: progressData.progress >= 100 };
                        }
                        return { id: l.id, completed: false };
                    });
                    const readStatuses = await Promise.all(readStatusPromises);
                    
                    const updatedReadChapters = readStatuses.reduce((acc, { id, completed }) => {
                        acc[id] = completed;
                        return acc;
                    }, {} as { [key: string]: boolean });
                    
                    setReadChapters(updatedReadChapters);
                    calculateCourseProgress(updatedReadChapters, lessonsData.length);

                } else {
                    console.error("Erreur lors de la récupération des leçons du cours.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des leçons :", error);
            } finally {
                setIsLoading(false);
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

    const updateCourseProgress = async (courseId: string, progress: number) => {
        if (!user) {
            console.error("L'utilisateur n'est pas défini."); // Vérifiez si l'utilisateur est connecté
            return; // Sortir si l'utilisateur n'est pas connecté
        }
    
        try {
            const response = await fetch(`/api/course/${courseId}/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, progress }), // Envoyer l'ID utilisateur et la progression
            });
    
            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la progression du cours");
            }
    
            console.log("Progression du cours mise à jour avec succès !");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la progression du cours :", error);
        }
    };

    const updateProgress = async (lessonId: string, progress: number) => {
        // Vérifiez si `lesson` n'est pas null avant de procéder
        if (!lesson) {
            console.error("La leçon n'est pas définie."); // Vous pouvez également gérer cela d'une autre manière, selon vos besoins
            return; // Sortir de la fonction si la leçon est nulle
        }
    
        try {
            const response = await fetch(`/api/lesson/${lessonId}/progress`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lessonId, progress }), 
            });
    
            if (!response.ok) {
                throw new Error("Erreur lors de la mise à jour de la progression");
            }
    
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la progression :", error);
        }
    };

    // Fonction pour mettre à jour la progression en fonction du scroll de la page
    const handleScroll = debounce(() => {
        if (lesson) {
            const { scrollY, innerHeight } = window;
            const totalHeight = document.documentElement.scrollHeight;
            const progress = (scrollY / (totalHeight - innerHeight)) * 101; // Calcul de la progression de défilement
    
            const currentLessonId = lesson.id;
    
            if (currentLessonId) {
                setChapterProgress((prev) => {
                    const previousProgress = prev[currentLessonId] || 0; // Récupérer la progression précédente
                    const newProgress = Math.max(previousProgress, progress); // Mise à jour de la progression
    
                    // Marquer le chapitre comme lu seulement si le scroll atteint 100%
                    if (newProgress >= 100 && !readChapters[currentLessonId]) {
                        setReadChapters((prev) => ({
                            ...prev,
                            [currentLessonId]: true, // Marquer comme lu
                        }));
                    }

                    // Appeler la fonction pour mettre à jour la progression sur le serveur
                    updateProgress(currentLessonId, newProgress);
    
                    return {
                        ...prev,
                        [currentLessonId]: newProgress, // Mettre à jour la progression maximale
                    };
                });
    
                // Calculer le pourcentage total du cours
                const totalChapters = lessons.length; // Nombre total de chapitres
                const completedChapters = Object.values(readChapters).filter((checked) => checked).length; // Chapitres déjà lus
                
                // Utiliser 'progress' pour calculer la progression globale
                const courseProgressValue = ((completedChapters + (progress >= 100 && !readChapters[currentLessonId] ? 1 : 0)) / totalChapters) * 100;
    
                // Mettre à jour la progression globale du cours
                setCourseProgress(courseProgressValue);

                console.log("Progress :" + progress); // Log pour vérifier la progression
                console.log(`Progression du cours: ${courseProgress.toFixed(2)}%`); // Log pour vérifier la progression
            }
        }
    }, 200);
        

    // Effet pour attacher l'événement de scroll à la fenêtre
    useEffect(() => {
        window.addEventListener("scroll", handleScroll); // Écouteur d'événement pour le défilement
        return () => {
            window.removeEventListener("scroll", handleScroll); // Nettoyage de l'écouteur lors du démontage
        };
    }, [lesson, handleScroll]); // Dépendances de l'effet

    // Effet pour initialiser la progression du chapitre à 100% si déjà lu
    useEffect(() => {
        if (lesson && readChapters[lesson.id]) {
            setChapterProgress((prev) => ({
                ...prev,
                [lesson.id]: 100, // Initialiser la progression à 100% si le chapitre a été lu
            }));
        }
    }, [lesson, readChapters]);

    // Fonction pour gérer le clic sur une leçon
    const handleLessonClick = async (lessonId: string) => {

        if (!user) {
            Swal.fire({
                title: 'Connectez-vous',
                text: "Vous devez être connecté pour accéder à ce chapitre !",
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return; 
        }

        try {
            const response = await fetch(`/api/lesson/${lessonId}`); // Requête pour récupérer les détails de la leçon sélectionnée
            if (response.ok) {
                const data = await response.json(); // Conversion de la réponse en JSON
                setLesson(data); // Mise à jour de l'état avec la leçon récupérée

                window.scrollTo({
                    top: 0, // Position tout en haut
                    behavior: "smooth", // Optionnel : défilement en douceur
                });

                // Vérifier si le chapitre a déjà été lu et initialiser la progression
                if (readChapters[lessonId]) {
                    setChapterProgress((prev) => ({
                        ...prev,
                        [lessonId]: 100, // Initialiser la progression à 100%
                    }));
                }
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
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900 p-4 md:p-8 relative">
            {/* Overlay dégradé pour cacher le contenu */}

            {/* Barre de progression fixe en haut */}
            <div className="fixed top-0 left-0 right-0 bg-gray-300 z-50">
                <div
                    className="h-2 bg-blue-500 transition-all duration-300"
                    style={{ width: `${Math.min(Math.floor(chapterProgress[lesson.id] || 0), 100)}%` }}
                ></div>
            </div>
            
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
                    height: "100vh",
                    maxHeight: "100vh",
                    overflowY: "auto",
                }}
            >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Chapitres</h2>
                
                {isLoading ? (
                    <div className="flex justify-center">
                        <Loader2Icon className="animate-spin h-6 w-6 text-gray-500" /> {/* Icône de chargement */}
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {lessons.map((l) => (
                            <li key={l.id} className="relative">
                                <button
                                    onClick={() => {
                                        handleLessonClick(l.id); // Charger la leçon sélectionnée
                                        setIsSidebarOpen(false); // Fermer la barre latérale après sélection
                                    }}
                                    className={`block w-full text-left px-4 py-2 rounded-lg ${
                                        l.id === lesson.id // Vérification si la leçon est actuellement sélectionnée
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-900 bg-slate-100 dark:bg-[#2e3a4a] dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {l.title} {/* Titre de la leçon */}
                                    {user && ( // Vérifiez si l'utilisateur est connecté
                                        <>
                                            {readChapters[l.id] && (
                                                <CheckIcon className="absolute w-2 h-2 p-1 top-2 right-2 bg-green-400 text-black rounded-full flex items-center justify-center ml-2" size={16} />
                                            )}
                                        </>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {user && (
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm">
                        <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300">Progression du cours</h3>
                        <div className="relative w-full h-2 bg-gray-300 rounded-lg overflow-hidden my-2">
                            <div
                                className={`absolute h-full transition-all duration-300 ${getProgressBarColor(courseProgress)}`}
                                style={{
                                    width: `${courseProgress.toFixed(2)}%`, // Affiche la progression globale du cours
                                }}
                            ></div>
                        </div>
                        <p className="text-right text-sm text-gray-600 dark:text-gray-400">
                            {courseProgress.toFixed(0)}% {/* Pourcentage de progression du cours */}
                        </p>
                    </div>
                )}
            </aside>

            {/* Overlay pour fermer la barre latérale sur mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30" // Couverture sombre sur l'écran pour le mode mobile
                    onClick={() => setIsSidebarOpen(false)} // Fermer la barre latérale lorsque l'overlay est cliqué
                ></div>
            )}

            {/* Contenu de la leçon */}
            <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 relative z-20">
                <h1 className="text-md text-gray-900 dark:text-yellow-500 mb-6">
                    <a className="font-bold" href={`/course/${lesson.courseId}`}>
                        {lesson.course.title} {/* Titre du cours */}
                    </a>{" "}
                    / {lesson.title} {/* Titre de la leçon */}
                </h1>

                {!user && (
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white dark:from-gray-800/90 dark:to-gray-900 opacity-1 z-0 h-full">
                        {/* Si l'utilisateur n'est pas connecté, afficher le bouton de connexion */}
                        <div className="flex flex-col justify-start h-full mt-4 mb-10 text-center p-10">
                            <p className="text-gray-600 dark:text-gray-400">
                                Connectez-vous pour accéder à l&apos;intégralité du cours.
                            </p>
                            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
                                Se connecter
                            </button>
                        </div>
                    </div>
                )}

                {/* Contenu de la leçon */}
                <div className="prose prose-md text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: lessonContent }}></div>

            </div>
        </div>
    );
}
