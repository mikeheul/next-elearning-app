export interface Lesson {
    id: string;
    title: string;
    content: string;
    order: number; 
    courseId: string;
    course: Course;
    lessonprogresses: LessonProgress[]
}

export interface Category {
    id: string;       
    name: string;
    courses: Course[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    category: Category;
    lessons: Lesson[];
    quizzes: Quiz[];
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

export interface Question {
    id: string;
    question: string;
    quizId: string;
    answerSelectionType: string;
    answers: string[];
    correctAnswer: string;
}

export interface LessonProgress {
    id: string;            
    userId: string;        
    progress: number;         
    completed: boolean;
    lesson: Lesson;
    updatedAt: Date;
    course: Course;
}

export interface PopularCourse {
    id: string;
    title: string;
    description: string;
    totalProgressions: number;
}

export interface CourseWithLessons {
    id: string;
    title: string;
    description: string;
    updatedAt: Date;
    category: Category;
    lessons: {
        id: string;
        title: string;
        content: string;
        order: number | null;
        lessonprogresses: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            completed: boolean;
            lessonId: string;
        }[];
        courseId: string; // Ajoutez cette propriété
    }[];
}

export interface CourseProgress {
    id: string;
    title: string;
    progress: number;  // Pourcentage de progression
    description: string;
    updatedAt: string;  // ou Date
}