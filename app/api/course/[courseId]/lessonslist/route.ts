import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
    const { courseId } = params;

    try {
        const lessons = await db.lesson.findMany({
            where: {
                courseId: courseId,
            },
            orderBy: {
                order: 'asc'
            },
            include: {
                level: true
            }
        });

        if (!lessons) {
            return NextResponse.json({ message: 'Leçons non trouvés' }, { status: 404 });
        }

        return NextResponse.json(lessons);
    } catch (error) {
        console.error('Erreur lors de la récupération des leçons :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
