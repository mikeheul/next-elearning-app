import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
    const { courseId } = params;

    try {
        const course = await db.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                lessons: {
                    orderBy: {
                        order: 'asc'
                    },
                    include: {
                        level: true
                    }
                },
                quizzes: true,
                level: true
            },
        });

        if (!course) {
            return NextResponse.json({ message: 'Cours non trouvé' }, { status: 404 });
        }

        return NextResponse.json(course);
    } catch (error) {
        console.error('Erreur lors de la récupération du cours :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
