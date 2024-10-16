import { db } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server"; // Import Clerk pour obtenir l'authentification
import { NextRequest } from "next/server";

// Méthode PUT pour mettre à jour la progression d'une leçon
export async function PUT(req: NextRequest) {
    try {
        const { lessonId, progress } = await req.json();

        // Récupérer l'utilisateur connecté via Clerk
        const { userId } = getAuth(req);

        // Vérification que l'utilisateur est bien authentifié
        if (!userId) {
            return new Response(JSON.stringify({ message: 'Non autorisé' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validation des données d'entrée
        if (!lessonId || typeof progress !== 'number') {
            return new Response(JSON.stringify({ message: 'Leçon ID et progression sont requis' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Vérifier si la leçon existe
        const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
        if (!lesson) {
            return new Response(JSON.stringify({ message: 'Leçon non trouvée' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const completed = progress >= 100;

        // Mise à jour de la progression de la leçon pour cet utilisateur
        const updatedProgress = await db.lessonProgress.upsert({
            where: {
                userId_lessonId: { userId, lessonId },
            },
            update: { progress, completed },
            create: {
                userId,
                lessonId,
                progress,
                completed
            },
        });

        // Réponse de succès avec la progression mise à jour
        return new Response(JSON.stringify(updatedProgress), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression de la leçon:', error);
        return new Response(JSON.stringify({ error: 'Erreur lors de la mise à jour de la progression de la leçon' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
