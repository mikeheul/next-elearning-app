const Placeholder = () => {
    return (
        <div className="rounded-lg shadow-md bg-white dark:bg-gray-800 animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-2/3"></div>
            </div>
        </div>
    );
};

export default Placeholder;