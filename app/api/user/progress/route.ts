import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    const { userId } = getAuth(request); // Récupère l'ID de l'utilisateur connecté

    if (!userId) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    try {
        const progressions = await db.lessonProgress.findMany({
            where: {
                userId: userId,
            },
            include: {
                lesson: true,
            },
        });

        return NextResponse.json(progressions);
    } catch (error) {
        console.error('Erreur lors de la récupération des progressions :', error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des progressions' }, { status: 500 });
    }
}
