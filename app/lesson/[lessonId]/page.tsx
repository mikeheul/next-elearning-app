"use client";

import { useEffect, useState } from "react";
import { marked } from "marked"; // Utilisé pour rendre le Markdown en HTML
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/types";

export default function LessonPage({ params }: { params: { lessonId: string } }) {
    const { lessonId } = params;
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchLesson() {
            try {
                const response = await fetch(`/api/lesson/${lessonId}`);

                if (!response.ok) {
                    throw new Error("Leçon non trouvée");
                }

                const data = await response.json();
                setLesson(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de la leçon :", error);
                router.push("/404"); // Redirection vers une page 404 si la leçon n'est pas trouvée
            } finally {
                setLoading(false);
            }
        }

        fetchLesson();
    }, [lessonId, router]);

    if (loading) {
        return <p className="text-center text-gray-400 mt-5">Chargement...</p>; // Texte gris pour le chargement
    }

    if (!lesson) {
        return <p className="text-center text-gray-400 mt-5">Leçon non trouvée.</p>; // Texte gris pour l'erreur
    }

    // Convertir le contenu Markdown en HTML
    const lessonContent = marked(lesson.content);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8"> {/* Couleurs de fond */}
            <div className="mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                <h1 className="text-md text-gray-900 dark:text-yellow-500 mb-6"><a className="font-bold" href={`/course/${lesson.courseId}`}>{lesson.course.title}</a> / {lesson.title}</h1>
                <div
                    className="prose prose-md text-gray-800 dark:text-gray-200" // Met le texte en fonction du thème
                    dangerouslySetInnerHTML={{ __html: lessonContent }} // Affiche le contenu de la leçon en HTML
                ></div>
            </div>
        </div>
    );
}
