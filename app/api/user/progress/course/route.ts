import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { CourseWithLessons } from '@/types/types';

export async function GET(request: NextRequest) {
    const { userId } = getAuth(request);

    if (!userId) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    try {
        const courses: CourseWithLessons[] = await db.course.findMany({
            include: {
                lessons: {
                    include: {
                        lessonprogresses: {
                            where: {
                                userId: userId,
                            },
                        },
                    },
                },
            },
        });

        const courseProgressions = courses.map(course => {
            const totalLessons = course.lessons.length;
            // Calculer la progression totale basée sur les leçons
            const totalProgression = course.lessons.reduce((acc, lesson) => {
                const lessonProgress = lesson.lessonprogresses.find(progress => progress.userId === userId);
                // Utiliser le pourcentage de progression de la leçon, ou 0 si aucune progression
                const lessonProgressPercentage = lessonProgress ? lessonProgress.progress : 0;
                return acc + lessonProgressPercentage;
            }, 0);

            // Calculer la moyenne de progression des leçons
            const progressPercentage = totalLessons > 0 ? (totalProgression / totalLessons) : 0;

            return {
                id: course.id,
                title: course.title,
                progress: progressPercentage,
                description: course.description,
                updatedAt: course.updatedAt,
            };
        });

        const filteredCourseProgressions = courseProgressions.filter(course => course.progress > 0);

        return NextResponse.json(filteredCourseProgressions);
    } catch (error) {
        console.error('Erreur lors de la récupération des progressions :', error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des progressions' }, { status: 500 });
    }
}