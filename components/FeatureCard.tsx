"use client";

interface FeatureCardProps {
    title: string;
    description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => (
    <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md text-center">
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
);

export default FeatureCard;