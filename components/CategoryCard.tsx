    import Link from "next/link";

    interface CategoryCardProps {
        id: string;
        name: string;
    }

    const CategoryCard = ({ id, name }: CategoryCardProps) => {
        return (
            <Link href={`/category/${id}`} className="w-full">
                <div className="px-6 py-8 bg-white dark:bg-gray-800 transition-transform duration-200 shadow-md rounded-lg flex flex-col items-center text-center hover:shadow-lg">
                    <h3 className="text-xl text-gray-800 dark:text-gray-100">
                        {name}
                    </h3>
                </div>
            </Link>
        );
    };

    export default CategoryCard;