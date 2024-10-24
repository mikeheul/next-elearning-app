import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    const { courseId } = params;
    
    if (!courseId) {
        return;
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