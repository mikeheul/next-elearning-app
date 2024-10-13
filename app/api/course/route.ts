import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Méthode POST pour créer un cours
export async function POST(req: Request) {
    try {
        // Extraction des données du corps de la requête
        const { title, description } = await req.json(); // req.json() est asynchrone dans cette nouvelle API
        const userId = 'user123'

        // Vérification que les données requises sont présentes
        if (!title || !description) {
        return new Response(JSON.stringify({ message: 'Titre et description sont requis' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
        }

        // Création du cours avec Prisma
        const course = await db.course.create({
            data: {
                title,
                description,
                userId
            },
        });

        // Réponse de succès avec le cours créé
        return new Response(JSON.stringify(course), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Erreur lors de la création du cours:', error);

        // Réponse d'erreur en cas de problème
        return new Response(JSON.stringify({ error: 'Erreur lors de la création du cours' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function GET() {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublic: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                lessons: true
            },
        });

        return NextResponse.json(courses);
    } catch (error) {
        console.error('Erreur lors de la récupération des cours :', error);
        return NextResponse.json({ message: 'Erreur lors de la récupération des cours' }, { status: 500 });
    }
}
