"use client";

import { Lesson } from '@/types/types';
import { useUser } from '@clerk/nextjs';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditIcon, GripVerticalIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SortableLessonProps {
    lesson: Lesson;
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson }) => {

    const router = useRouter();
    const { isSignedIn } = useUser();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: lesson.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative flex justify-between bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 hover:shadow-xl transition-shadow duration-300"
        >
            <div className='flex flex-col justify-between'>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 py-5 pr-8">
                    {lesson.title}
                </h3>

                <a href={`/lesson/${lesson.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                    Voir le chapitre →
                </a>
            </div>

            {isSignedIn && (
                <div className="flex items-center space-x-4">
                    <div className='bg-slate-200 dark:bg-slate-900 flex gap-2 absolute top-0 right-0 p-3 rounded-bl-md rounded-tr-md'>
                        <button
                            onClick={() => {
                                router.push(`/admin/lesson/delete/${lesson.id}`);
                            }}
                            // className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg shadow-md"
                            className="flex items-center text-red-500"
                        >
                            <Trash2Icon className="" size={18} />
                        </button>
                        <button
                            onClick={() => {
                                router.push(`/admin/lesson/edit/${lesson.id}`);
                            }}
                            // className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md"
                            className="flex items-center text-slate-900 dark:text-slate-200"
                        >
                            <EditIcon className="" size={18} />
                        </button>
                    </div>

                    <div className="cursor-grab">
                        <GripVerticalIcon className="text-gray-600 dark:text-gray-600" size={24} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortableLesson;