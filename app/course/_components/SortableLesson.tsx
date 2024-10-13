"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditIcon, GripVerticalIcon } from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    courseId: string;
}

interface SortableLessonProps {
    lesson: Lesson;
}

const SortableLesson: React.FC<SortableLessonProps> = ({ lesson }) => {
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
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    {lesson.title}
                </h3>
                <a href={`/lesson/${lesson.id}`} className="text-blue-600 hover:underline dark:text-blue-400">
                    Voir la leçon →
                </a>
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={() => {
                        window.location.href = `/admin/lesson/edit/${lesson.id}`;
                    }}
                    className="absolute text-xs top-3 right-3 flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md"
                >
                    <EditIcon className="" size={15} />
                </button>

                <div className="cursor-grab">
                    <GripVerticalIcon className="text-gray-600 dark:text-gray-600" size={24} />
                </div>
            </div>
        </div>
    );
};

export default SortableLesson;