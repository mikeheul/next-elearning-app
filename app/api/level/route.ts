import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        const levels = await db.level.findMany({});

        // Return JSON response with the sorted list of levels
        return NextResponse.json(levels);
    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[LEVELS]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
