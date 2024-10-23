import Link from "next/link";

interface CategoryCardProps {
    id: string;
    name: string;
}

const CategoryCard = ({ id, name }: CategoryCardProps) => {
    return (
        <Link href={`/category/${id}`} className="w-full">
            <div className="relative px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-700 dark:to-gray-800 transition duration-300 shadow-lg rounded-lg flex flex-col items-center text-center transform hover:scale-105 hover:shadow-2xl">
            
                <h3 className="text-2xl font-semibold text-white dark:text-gray-100 transition-transform duration-300 transform hover:scale-110">
                    {name}
                </h3>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-4 w-full h-2 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full"></div>
            </div>
        </Link>
    );
};

export default CategoryCard;
