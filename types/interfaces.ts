// Types communs pour éviter la redondance
export interface BaseEntity {
    id: string;
    title: string;
}

export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

// Interface principale pour les cours populaires
export interface PopularCourse extends BaseEntity {
    description: string;
    totalProgressions: number;
}

// Niveau d'un cours ou leçon
export interface Level extends BaseEntity {
    name: string;
}

// Cours avec la catégorie et des leçons
export interface Course extends BaseEntity, Timestamps {
    description: string;
    category: Category;
    level: Level;
    lessons: Lesson[];
    quizzes: Quiz[];
    isPublic: boolean;
}

// Catégorie des cours
export interface Category extends BaseEntity {
    courses: Course[];
}

// Interface pour une leçon avec progression
export interface Lesson extends BaseEntity {
    content: string;
    level?: Level | null;
    order?: number | null; 
    courseId: string;
    course: Course;
    lessonprogresses: LessonProgress[];
}

// Quiz et questions associées
export interface Quiz extends BaseEntity {
    description: string;
    questions: Question[];
}

// Question dans un quiz
export interface Question extends BaseEntity {
    question: string;
    quizId: string;
    answerSelectionType: string;
    answers: string[];
    correctAnswer: string;
}

// Progrès d'une leçon pour un utilisateur spécifique
export interface LessonProgress {
    id: string;            
    userId: string;        
    progress: number;         
    completed: boolean;
    lesson: Lesson;
    updatedAt: Date;
    course: Course;
}

// Structure simplifiée pour le cours avec leçons
export interface CourseWithLessons extends BaseEntity, Timestamps {
    description: string;
    lessons: {
        id: string;
        title: string;
        content: string;
        level?: Level | null;
        order?: number | null;
        lessonprogresses: {
            id: string;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            completed: boolean;
            lessonId: string;
        }[];
        courseId: string;
    }[];
}

// Progrès global d'un cours
export interface CourseProgress extends BaseEntity {
    progress: number; 
    description: string;
    updatedAt: string;  
}
