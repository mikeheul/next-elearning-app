// components/CategoryCard.tsx
import Link from "next/link";

interface CategoryCardProps {
    id: string;
    name: string;
}

const CategoryCard = ({ id, name }: CategoryCardProps) => {
    return (
        <Link href={`/category/${id}`} className="">
        <div className="p-6 bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition duration-300 shadow-md rounded-lg flex flex-col items-center text-center">
            <h3 className="text-xl text-gray-800 dark:text-gray-100 mb-2">
                {name}
            </h3>
        </div>
        </Link>
    );
};

export default CategoryCard;
