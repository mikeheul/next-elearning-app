import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    const { courseId } = params;
    
    if (!courseId) {
        return;
    }

    const { userId, sessionId } = getAuth(req);

    if (!userId || !sessionId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = userId ? await clerkClient().users.getUser(userId) : null
    const isAdmin = user?.publicMetadata?.role === 'admin';

    if (!isAdmin) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        await db.course.delete({
            where: { id: courseId },
        });

        return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("[COURSE_DELETE]", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}