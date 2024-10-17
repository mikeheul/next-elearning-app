import { db } from "@/lib/db"; // Assurez-vous que le chemin vers votre DB est correct
import { getAuth } from "@clerk/nextjs/server"; // Import Clerk pour obtenir l'authentification
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Récupérer l'utilisateur connecté via Clerk
        const { userId } = getAuth(req);

        // Vérification que l'utilisateur est bien authentifié
        if (!userId) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        // Récupérer la progression de la leçon pour cet utilisateur
        const progresses = await db.lessonProgress.findMany({
            where: {
                userId
            },
        });

        return NextResponse.json(progresses, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération des progressions', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération des progressions' }, { status: 500 });
    }
}