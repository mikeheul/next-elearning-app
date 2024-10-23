import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
    
    const { categoryId } = params;

    try {
        const category = await db.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                courses: true
            }
        });

        if (!category) {
            return NextResponse.json({ message: 'Catégorie non trouvé' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie :', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}