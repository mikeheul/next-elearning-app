import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch users from Clerk
        const categories = await db.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        // Return JSON response with the sorted list of tools
        return NextResponse.json(categories);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[CATEGORIES]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
