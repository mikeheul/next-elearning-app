"use client";

import { Course } from "@/types/types";
import { BookOpenIcon, Clock10Icon, LockIcon, UnlockIcon, ClipboardListIcon } from "lucide-react";

interface CourseCardProps {
    course: Course;
}

const getBadgeColor = (count: number) => {
    if (count === 0) return 'bg-gray-500';
    if (count < 4) return 'bg-yellow-600';
    if (count < 5) return 'bg-green-700';
    return 'bg-blue-500';
};

const CourseCard = ({ course }: CourseCardProps) => {
    const badgeColor = getBadgeColor(course.lessons.length);
    
    const formattedDate = new Date(course.updatedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div
            key={course.id}
            className="relative flex flex-col justify-between bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 hover:dark:bg-slate-700"
        >
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {course.title}
                </h2>

                <div className="absolute right-4 top-4">
                    {course.isPublic ? (
                        <UnlockIcon className="text-green-500" size={20} /> // Icône de cours public
                    ) : (
                        <LockIcon className="text-red-500" size={20} /> // Icône de cours privé
                    )}
                </div>

                <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                    <Clock10Icon size={15} /> 
                    <span>Dernière mise à jour : {formattedDate}</span>
                </p>
                
                <div className="flex gap-4 my-5">
                    <span className={`inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white ${badgeColor} rounded-full`}>
                        <BookOpenIcon className="mr-1" size={16} /> {/* Icône BookOpen */}
                        {course.lessons.length} chapitre{course.lessons.length > 1 ? 's' : ''}
                    </span>

                    {/* Affichage du nombre de quizz */}
                    {course.quizzes && course.quizzes.length > 0 && (
                        <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-full">
                            <ClipboardListIcon className="mr-1" size={16} />
                            {course.quizzes.length} quiz{course.quizzes.length > 1 ? 'zes' : ''}
                        </span>
                    )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {course.description}
                </p>
            </div>
            <a 
                href={`/course/${course.id}`} 
                className="inline-block text-blue-600 hover:underline dark:text-blue-400"
            >
                Voir le cours →
            </a>
        </div>
    );
};

export default CourseCard;