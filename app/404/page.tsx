import Link from 'next/link';
import { HomeIcon } from 'lucide-react'; // ou tout autre pack d'icônes que tu utilises

export default function Custom404() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="text-center">
                <h1 className="text-8xl font-extrabold text-blue-500 dark:text-yellow-500">404</h1>
                <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">
                    Oups ! La page que vous recherchez n'existe pas.
                </p>
                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
                    Il semble que vous ayez emprunté un mauvais chemin.
                </p>

                {/* Boutons de navigation */}
                <div className="mt-8 space-x-4">
                    <Link href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600">
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Retourner à l'accueil
                    </Link>
                    <Link href="/course" className="inline-flex items-center px-6 py-3 border border-blue-600 dark:border-yellow-500 text-base font-medium rounded-lg text-blue-600 bg-transparent hover:bg-blue-100 dark:text-yellow-500 dark:hover:bg-gray-800">
                        Explorer les cours
                    </Link>
                </div>
            </div>
        </div>
    );
}
