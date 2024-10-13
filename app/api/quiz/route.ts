import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { title, description, courseId, questions } = await request.json();

    const quiz = await db.quiz.create({
        data: {
            title,
            description,
            course: {
                connect: { id: courseId },
            },
            questions: {
                create: questions.map((q: any) => ({
                    question: q.question,
                    answerSelectionType: "multiple", // Spécifiez le type de sélection
                    answers: q.answers,
                    correctAnswer: q.correctAnswer,
                })),
            },
        },
    });

    return NextResponse.json(quiz);
}
