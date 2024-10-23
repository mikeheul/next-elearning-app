"use client";

import { Lesson } from '@/types/interfaces';
import { useUser } from '@clerk/nextjs';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditIcon, GripVerticalIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SortableLessonProps {
    lesson: Lesson;
}

type DifficultyLevel = 'débutant' | 'intermédiaire' | 'expert';

const SortableLesson = ({ lesson }: SortableLessonProps) => {

    const router = useRouter();
    const { isSignedIn, user } = useUser();
    const [isMobile, setIsMobile] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: lesson.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    let isAdmin = false;
    if (user) {
        isAdmin = user.publicMetadata?.role === 'admin'; // Optional chaining to prevent errors
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Vérification initiale
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const levelInfo: Record<DifficultyLevel, { color: string; percent: number, label: string; icon: string }> = {
        débutant: { color: "bg-green-500", percent: 100,  label: "Débutant", icon: "🌱" },
        intermédiaire: { color: "bg-orange-500", percent: 100, label: "Intermédiaire", icon: "🌼" },
        expert: { color: "bg-red-500", percent: 100, label: "Expert", icon: "🌟" }
    };

    const level: DifficultyLevel = lesson.level?.name.toLowerCase() as DifficultyLevel || "Débutant";

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative overflow-hidden h-full flex justify-between bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
            <div className='flex flex-col justify-between'>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 py-5 pr-8">
                    {lesson.title}
                </h3>

                <a href={`/lesson/${lesson.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                    Voir le chapitre →
                </a>
            </div>

            {/* Jauge de difficulté */}
            <div className="absolute top-0 right-0 h-full w-1 bg-gray-200">
                <div 
                    style={{ height: `100%` }}
                    className={`bg-red-500`}
                />
            </div>

            {(isSignedIn && isAdmin) && (
                <div className="flex items-center space-x-4">
                    <div className='bg-slate-200 dark:bg-slate-900 flex absolute top-0 right-0 rounded-bl-md rounded-tr-md'>
                        <button
                            onClick={() => {
                                router.push(`/admin/lesson/delete/${lesson.id}`);
                            }}
                            // className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md"
                            className="flex items-center text-red-500 hover:bg-slate-300 dark:hover:bg-slate-700/80 p-2"
                        >
                            <Trash2Icon className="" size={18} />
                        </button>
                        <button
                            onClick={() => {
                                router.push(`/admin/lesson/edit/${lesson.id}`);
                            }}
                            // className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md"
                            className="flex items-center text-slate-900 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700/80 p-2"
                        >
                            <EditIcon className="" size={18} />
                        </button>
                    </div>

                    { isAdmin && !isMobile && (
                    <div className="cursor-grab">
                        <GripVerticalIcon className="text-gray-600 dark:text-gray-600" size={24} />
                    </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SortableLesson;