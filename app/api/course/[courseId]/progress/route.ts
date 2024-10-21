import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
    const { courseId } = params;

    try {
        const { userId, progress } = await req.json();

        // Validation de la progression
        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return NextResponse.json({ message: 'Progression invalide' }, { status: 400 });
        }

        // Upsert de la progression du cours
        const updatedCourseProgress = await db.courseProgress.upsert({
            where: {
                userId_courseId: { 
                    userId: userId, 
                    courseId: courseId,
                },
            },
            update: {
                progress, 
            },
            create: {
                userId, 
                courseId, 
                progress, 
            },
        });

        return NextResponse.json(updatedCourseProgress); // Retourne le cours mis à jour
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression globale du cours :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
