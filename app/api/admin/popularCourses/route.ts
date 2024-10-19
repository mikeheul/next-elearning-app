import { NextResponse } from 'next/server'; 
import { db } from "@/lib/db"; 
import { CourseWithLessons } from '@/types/types'; 

export async function GET() {
    try {
        // Récupérer les cours avec le nombre de progressions de leçon
        const popularCourses: CourseWithLessons[] = await db.course.findMany({
            include: {
                lessons: {
                    include: {
                        lessonprogresses: true, // Inclure les progressions pour chaque leçon
                    },
                },
            },
        });

        // Calculer le nombre total de progressions par cours
        const coursesWithProgressCounts = popularCourses.map((course) => {
            const totalProgressions = course.lessons.reduce((sum: number, lesson) => {
                return sum + lesson.lessonprogresses.length; // Ajouter le nombre de progressions pour chaque leçon
            }, 0);

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                totalProgressions,
            };
        });

        // Trier les cours par nombre total de progressions décroissant
        const sortedCourses = coursesWithProgressCounts.sort((a, b) => b.totalProgressions - a.totalProgressions);

        // Retourner les 5 cours les plus suivis
        return NextResponse.json(sortedCourses.slice(0, 5));
        // return NextResponse.json(sortedCourses);

    } catch (error) {
        console.error("Erreur lors de la récupération des cours populaires :", error);
        return NextResponse.json({ error: "Erreur lors de la récupération des cours populaires" }, { status: 500 });
    }
}
