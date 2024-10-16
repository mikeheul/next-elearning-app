import { db } from "@/lib/db"; // Assurez-vous que le chemin vers votre DB est correct
import { getAuth } from "@clerk/nextjs/server"; // Import Clerk pour obtenir l'authentification
import { NextRequest, NextResponse } from "next/server";

// Méthode GET pour récupérer la progression d'une leçon pour un utilisateur connecté
export async function GET(req: NextRequest, { params }: { params: { lessonId: string } }) {
    try {
        // Récupération de l'ID de la leçon à partir de l'URL
        const { lessonId } = params;

        // Récupérer l'utilisateur connecté via Clerk
        const { userId } = getAuth(req);

        // Vérification que l'utilisateur est bien authentifié
        if (!userId) {
            return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
        }

        // Récupérer la progression de la leçon pour cet utilisateur
        const progress = await db.lessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
        });

        // Si aucune progression n'est trouvée, renvoyer 0
        if (!progress) {
            return NextResponse.json({ progress: 0 }, { status: 200 });
        }

        // Retourner la progression trouvée
        return NextResponse.json({ progress: progress.progress }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération de la progression de la leçon:', error);
        return NextResponse.json({ error: 'Erreur lors de la récupération de la progression de la leçon' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { lessonId: string } }) {
    const { userId } = getAuth(req);

     // Vérification que l'utilisateur est bien authentifié
    if (!userId) {
        return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    }

    const { progress } = await req.json(); // Récupérer la progression depuis le corps de la requête

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return NextResponse.json({ error: 'Progression invalide.' }, { status: 400 });
    }

    try {
        // Vérifier si une entrée pour cet utilisateur et ce cours existe déjà
        const courseProgress = await db.courseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: params.lessonId, // Assurez-vous d'utiliser le bon champ pour identifier le cours
                },
            },
        });

        if (courseProgress) {
            // Met à jour la progression si elle existe déjà
            await db.courseProgress.update({
                where: { id: courseProgress.id },
                data: {
                    progress: Math.max(courseProgress.progress, progress), // On veut garder le max pour éviter de diminuer la progression
                    completed: progress >= 100, // Mise à jour du statut de complétion
                },
            });
        } else {
            // Crée une nouvelle entrée si elle n'existe pas
            await db.courseProgress.create({
                data: {
                    userId,
                    courseId: params.lessonId,
                    progress,
                    completed: progress >= 100,
                },
            });
        }

        return NextResponse.json({ message: 'Progression mise à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la progression:', error);
        return NextResponse.json({ error: 'Erreur lors de la mise à jour de la progression.' }, { status: 500 });
    }
}
