import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
    const { courseId } = params;

    try {
        const { userId, progress } = await req.json(); // Assurez-vous de récupérer userId aussi

        // Validation de la progression
        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return NextResponse.json({ message: 'Progression invalide' }, { status: 400 });
        }

        // Upsert de la progression du cours
        const updatedCourseProgress = await db.courseProgress.upsert({
            where: {
                userId_courseId: { // Utilisez la clé unique combinée
                    userId: userId, // Assurez-vous que userId est présent dans la requête
                    courseId: courseId,
                },
            },
            update: {
                progress, // Mettez à jour la progression existante
            },
            create: {
                userId, // Créez une nouvelle entrée si elle n'existe pas
                courseId, // Assurez-vous que courseId est fourni
                progress, // Enregistrez la progression
            },
        });

        return NextResponse.json(updatedCourseProgress); // Retourne le cours mis à jour
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression globale du cours :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
