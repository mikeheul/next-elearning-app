"use client";

import { Course } from "@/types/interfaces";
import { BookOpenIcon, Clock10Icon, LockIcon, UnlockIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
    course: Course;
    progress?: number;
}

const CourseCard = ({ course, progress }: CourseCardProps) => {
    
    const formattedDate = new Date(course.updatedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Link
            href={`/course/${course.id}`} // Lien pour accéder au cours
        >
            <div
                key={course.id}
                className="relative flex flex-col h-full justify-between bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 hover:dark:bg-slate-700"
            >
                <div>
                    <h2 className="flex gap-3 text-2xl font-semibold text-gray-800 dark:text-white">
                        {/* Affichage de la progression uniquement si l'utilisateur est connecté */}
                        {progress !== undefined && progress >= 100 && (
                            <div className="flex items-center">
                                {/* Affichage de l'icône d'achèvement si la progression est de 100% */}
                                {/* <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" /> */}
                                <span className="bg-green-300 text-green-800 font-bold text-xs px-3 py-1 rounded-full">
                                    Terminé
                                </span>
                            </div>
                        )}
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
                        <span className={`inline-flex gap-1 items-center justify-center px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-full`}>
                            <BookOpenIcon className="mr-1 relative top-[1px]" size={16} /> {/* Ajuste la position de l'icône */}
                            <span className="align-middle">
                                {course.lessons.length} chapitre{course.lessons.length > 1 ? 's' : ''}
                            </span>
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
            </div>
        </Link>
    );
};

export default CourseCard;