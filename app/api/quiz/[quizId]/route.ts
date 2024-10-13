import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
    const { quizId } = params;

    try {
        const quiz = await db.quiz.findUnique({
            where: {
                id: quizId,
            },
            include: {
                questions: true
            },
        });

        if (!quiz) {
            return NextResponse.json({ message: 'Quiz non trouvé' }, { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Erreur lors de la récupération du quiz :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
