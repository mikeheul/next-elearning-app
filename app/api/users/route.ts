import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

// Define a GET function that handles incoming requests
export async function GET() {
    try {
        // Fetch users from Clerk
        const users = await clerkClient().users.getUserList();

        console.log(users)

        // Return JSON response with the sorted list of tools
        return NextResponse.json(users);

    } catch (error) {
        // Log any errors that occur during the execution
        console.log("[USERS]", error);

        // Return an internal server error response
        return new NextResponse("Internal Error", { status: 500 });
    }
}
