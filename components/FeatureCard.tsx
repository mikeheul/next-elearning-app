"use client";

interface FeatureCardProps {
    title: string;
    description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-12 rounded-lg shadow-md text-center w-full">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4 break-words">
            {title}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 break-words">
            {description}
        </p>
    </div>
);

export default FeatureCard;

