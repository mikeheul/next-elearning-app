import { NextResponse } from 'next/server';
import { marked } from 'marked';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';

function sanitizeFileName(title: string): string {
    return title
        .trim() // Supprime les espaces au début et à la fin
        .replace(/[\s]+/g, '_') // Remplace les espaces par des underscores
        .replace(/[^\w.-]+/g, '') // Supprime les caractères non alphanumériques, sauf les underscores, tirets et points
        .toLowerCase(); // Optionnel : convertir en minuscules
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, content, courseId } = body;

        if (!title || !content || !courseId) {
            return NextResponse.json({ message: 'Titre et contenu requis.' }, { status: 400 });
        }

        // Convertir le Markdown en HTML
        const htmlContent = marked(content);

        const lessonCount = await db.lesson.count({
            where: { courseId },
        });

        const lesson = await db.lesson.create({
            data: {
                title,
                content, 
                courseId, 
                order: lessonCount + 1,
            },
        });

        await db.course.update({
            where: { id: courseId },
            data: { updatedAt: new Date() }, // Mettez à jour la date de modification
        });

        if(!lesson) {
            console.log('Error')
        }

        // Fichier HTML de la leçon
        // const lessonHtml = `
        // <!DOCTYPE html>
        // <html lang="fr">
        // <head>
        //     <meta charset="UTF-8">
        //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //     <title>${title}</title>
        // </head>
        // <body>
        //     <div id="lesson-content">
        //         ${htmlContent}
        //     </div>
        // </body>
        // </html>`;

        // // Fichier imsmanifest.xml
        // const imsManifest = `
        // <?xml version="1.0" encoding="UTF-8"?>
        // <manifest identifier="com.example.course" version="1.2" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
        //     <metadata>
        //         <schema>ADL SCORM</schema>
        //         <schemaversion>1.2</schemaversion>
        //         <lom>
        //             <general>
        //                 <title>
        //                     <string>${title}</string>
        //                 </title>
        //             </general>
        //         </lom>
        //     </metadata>
        //     <organizations default="org">
        //         <organization identifier="org">
        //             <item identifier="item1" identifierref="resource1">
        //                 <title>${title}</title>
        //             </item>
        //         </organization>
        //     </organizations>
        //     <resources>
        //         <resource identifier="resource1" type="webcontent" href="index.html">
        //             <file href="index.html" />
        //         </resource>
        //     </resources>
        // </manifest>`;

        // const sanitizedTitle = sanitizeFileName(title); // Nettoyage du titre
        // const zipFilePath = path.join(process.cwd(), 'public', `${sanitizedTitle}.zip`); // Chemin de sauvegarde du ZIP

        // // Crée une écriture de fichier
        // const output = fs.createWriteStream(zipFilePath);
        // const archive = archiver('zip', { zlib: { level: 9 } });

        // // Connecter le stream de l'archive au fichier de sortie
        // archive.pipe(output);

        // // Ajouter les fichiers HTML et XML dans l'archive
        // archive.append(lessonHtml, { name: 'index.html' });
        // archive.append(imsManifest, { name: 'imsmanifest.xml' });

        // // Finaliser l'archive
        // await archive.finalize();

        // Réponse avec l'emplacement du fichier ZIP
        return NextResponse.json({ message: 'Leçon créée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la génération du fichier SCORM:', error);
        return NextResponse.json({ message: 'Erreur interne' }, { status: 500 });
    }
}
