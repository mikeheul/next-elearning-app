import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
    // const courseId = params.courseId;

    try {
        // Récupérer le corps de la requête
        const lessons = await req.json();

        // Validation : vérifier si c'est un tableau
        if (!Array.isArray(lessons)) {
            return NextResponse.json({ error: 'Le format des données est invalide.' }, { status: 400 });
        }

        // Mise à jour de l'ordre des leçons dans la base de données
        const updatePromises = lessons.map((lesson: { id: string; order: number }) =>
            db.lesson.update({
                where: { id: lesson.id },
                data: { order: lesson.order },
            })
        );

        // Attendre la finalisation de toutes les mises à jour
        await Promise.all(updatePromises);

        return NextResponse.json({ message: 'Leçons réorganisées avec succès.' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des leçons :', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour des leçons.' }, { status: 500 });
    }
}
