interface PaginationProps {
    currentPage: number;
    totalPages: number;
    paginate: (pageNumber: number) => void;
}

export default function Pagination({ currentPage, totalPages, paginate }: PaginationProps) {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center my-8">
            <ul className="inline-flex -space-x-px">
                {/* Bouton Précédent */}
                <li>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 leading-tight rounded-l-lg ${
                            currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
                        } bg-white dark:bg-gray-800`}
                    >
                        Précédent
                    </button>
                </li>

                {/* Lien vers chaque page */}
                {pageNumbers.map((number) => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight ${
                                currentPage === number
                                    ? 'text-white bg-blue-600 border-blue-600 dark:border-none dark:bg-cyan-700 dark:border-cyan-700'
                                    : 'text-gray-700 border-gray-300 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700'
                            } dark:bg-gray-800`}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                {/* Bouton Suivant */}
                <li>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-2 leading-tight rounded-r-lg ${
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-200  dark:hover:bg-gray-700'
                        } bg-white dark:bg-gray-800`}
                    >
                        Suivant
                    </button>
                </li>
            </ul>
        </nav>
    );
}