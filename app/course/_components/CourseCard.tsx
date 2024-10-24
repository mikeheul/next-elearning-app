"use client";

import DeleteButton from "@/components/DeleteButton";
import { Course } from "@/types/interfaces";
import { BookOpenIcon, Clock10Icon, LockIcon, UnlockIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
    course: Course;
    progress?: number;
    onDelete: (id: string) => void;
}

type DifficultyLevel = 'débutant' | 'intermédiaire' | 'expert';

const CourseCard = ({ course, progress, onDelete }: CourseCardProps) => {

    const handleDelete = async (id: string) => {

        try {
            const response = await fetch(`/api/course/${course.id}/delete`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onDelete(id);
            }
        } catch (error) {
            console.error('Error deleting course : ', error);
        }
    }; 

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
        event.preventDefault();
        event.stopPropagation(); // Arrête la propagation de l'événement
        handleDelete(id); 
    };
    
    const formattedDate = new Date(course.updatedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const creationDate = new Date(course.createdAt);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate.getTime() - creationDate.getTime()) / (1000 * 3600 * 24));

    const levelInfo: Record<DifficultyLevel, { color: string; percent: number, label: string; icon: string }> = {
        débutant: { color: "bg-green-500", percent: 100,  label: "Débutant", icon: "🌱" },
        intermédiaire: { color: "bg-orange-500", percent: 100, label: "Intermédiaire", icon: "🌼" },
        expert: { color: "bg-red-500", percent: 100, label: "Expert", icon: "🌟" }
    };

    const level: DifficultyLevel = course.level?.name.toLowerCase() as DifficultyLevel || "Débutant";

    return (
        <Link
            href={`/course/${course.id}`}
        >
            <div
                key={course.id}
                className="rounded-lg relative overflow-hidden flex flex-col h-full justify-between bg-white px-8 py-10 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 hover:dark:bg-slate-700"
            >
                {/* Jauge de difficulté */}
                <div className="absolute top-0 right-0 h-full w-1 bg-gray-200">
                    <div 
                        style={{ height: `${levelInfo[level].percent}%` }}
                        className={`${levelInfo[level].color}`}
                    />
                </div>

                <div className="absolute bottom-0 left-0">
                    <DeleteButton id={course.id} handleDelete={handleDeleteClick} />
                </div>

                <div>
                    <div className="flex absolute top-0 left-0">
                        {daysDifference < 4 && (
                            <span className="bg-red-400 text-white text-xs py-1 px-3 rounded-tl-lg">
                                Nouveau
                            </span>
                        )}

                        {course.category?.name && (
                            <div className="flex items-center">
                                <span className={`bg-blue-100 text-blue-800 font-semibold text-xs py-1 px-3 ${daysDifference < 4 ? 'rounded-none' : 'rounded-tl-lg'}`}>
                                    {course.category.name}
                                </span>
                            </div>
                        )}
                    </div>

                    <h2 className="flex gap-3 text-2xl font-semibold text-gray-800 dark:text-white mt-5">
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

                    <div className="absolute right-6 top-4">
                        {course.isPublic ? (
                            <UnlockIcon className="text-green-500" size={20} /> 
                        ) : (
                            <LockIcon className="text-red-500" size={20} />
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