export interface Lesson {
    id: string;
    title: string;
    content: string;
    order: number; 
    courseId: string;
    course: Course;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    quizzes: Quiz[];
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
}