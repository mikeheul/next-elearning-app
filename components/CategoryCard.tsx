import Link from "next/link";
import { Book, Code, ShoppingCart, Globe, Calculator, Paintbrush } from "lucide-react";

interface CategoryCardProps {
    id: string;
    name: string;
}

const CategoryCard = ({ id, name }: CategoryCardProps) => {

    const getCategoryStyle = (categoryName: string) => {
        switch (categoryName.toLowerCase()) {
            case "webdev":
                return {
                    icon: <Code strokeWidth={1} className="w-10 h-10 text-blue-400" />,
                    borderColor: "border-blue-400",
                    bgColor: "hover:bg-blue-400/10",
                };
            case "compta":
                return {
                    icon: <Calculator strokeWidth={1} className="w-10 h-10 text-green-400" />,
                    borderColor: "border-green-400",
                    bgColor: "hover:bg-green-400/10",
                };
            case "culture g":
                return {
                    icon: <Globe strokeWidth={1} className="w-10 h-10 text-purple-400" />,
                    borderColor: "border-purple-400",
                    bgColor: "hover:bg-purple-400/10",
                };
            case "commerce":
                return {
                    icon: <ShoppingCart strokeWidth={1} className="w-10 h-10 text-red-400" />,
                    borderColor: "border-red-400",
                    bgColor: "hover:bg-red-400/10",
                };
            case "graphisme":
                return {
                    icon: <Paintbrush strokeWidth={1} className="w-10 h-10 text-yellow-400" />,
                    borderColor: "border-yellow-400",
                    bgColor: "hover:bg-yellow-400/10",
                };
            default:
                return {
                    icon: <Book strokeWidth={1} className="w-10 h-10 text-gray-400" />,
                    borderColor: "border-gray-400",
                    bgColor: "hover:bg-gray-400/10",
                };
        }
    };

    const { icon, borderColor, bgColor } = getCategoryStyle(name);

    return (
        <Link href={`/category/${id}`} className="w-full sm:w-48">
            <div className={`flex flex-col w-full h-auto sm:h-48 px-6 py-8 border-[1px] ${bgColor} transition-transform duration-200 shadow-md rounded-lg items-center justify-center text-center hover:shadow-lg ${borderColor}`}>
                {icon}
                <h3 className="text-md text-gray-800 dark:text-gray-100 mt-4">
                    {name}
                </h3>
            </div>
        </Link>
    );
};

export default CategoryCard;
