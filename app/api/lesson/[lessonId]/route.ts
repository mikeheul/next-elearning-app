import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
    const { lessonId } = params;

    try {
        const lesson = await db.lesson.findUnique({
            where: {
                id: lessonId,
            },
            include: {
                course: true
            }
        });

        if (!lesson) {
            return NextResponse.json({ message: 'Leçon non trouvé' }, { status: 404 });
        }

        return NextResponse.json(lesson);
    } catch (error) {
        console.error('Erreur lors de la récupération du cours :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { lessonId: string } }) {
    try {
        const body = await req.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json({ message: 'Titre et contenu requis.' }, { status: 400 });
        }

        // Mettre à jour la leçon dans la base de données
        const updatedLesson = await db.lesson.update({
            where: { id: params.lessonId },
            data: { title, content },
        });

        return NextResponse.json({ message: 'Leçon mise à jour avec succès', lesson: updatedLesson });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la leçon:', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}