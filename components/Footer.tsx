export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 py-8">
            <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center">
                
                {/* Logo or Brand Name */}
                <div className="flex items-center mb-4 md:mb-0">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        Learnify
                    </span>
                </div>
    
                {/* Links Section */}
                <div className="flex flex-wrap space-x-6 text-sm mb-4 md:mb-0">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                        Accueil
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                        À propos
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                        Contact
                    </a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                        Blog
                    </a>
                </div>
    
                {/* Social Media Links */}
                <div className="flex space-x-4">
                    <a
                        href="#"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        aria-label="Twitter"
                    >
                        <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        aria-label="GitHub"
                    >
                        <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M12 0a12 12 0 00-3.79 23.4c.6.1.82-.25.82-.57v-2.25c-3.34.73-4-1.63-4-1.63A3.15 3.15 0 004 17.68c-1.08-.74.08-.72.08-.72a2.5 2.5 0 011.8 1.22 2.54 2.54 0 003.46 1 2.53 2.53 0 01.76-1.6c-2.66-.3-5.47-1.34-5.47-6a4.71 4.71 0 011.26-3.26 4.41 4.41 0 01.12-3.21s1-.32 3.3 1.24a11.4 11.4 0 016 0C15 5.34 16 5 16 5a4.42 4.42 0 01.12 3.21 4.7 4.7 0 011.26 3.26c0 4.7-2.82 5.67-5.5 5.96a2.86 2.86 0 01.8 2.2v3.27c0 .33.22.68.83.57A12 12 0 0012 0z" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        aria-label="LinkedIn"
                    >
                        <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path d="M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zM8 19H5v-8h3v8zM6.5 9A1.75 1.75 0 116.5 6a1.75 1.75 0 010 3zm12.5 10h-3v-4c0-1.08-.92-2-2-2s-2 .92-2 2v4h-3v-8h3v1.18A3.37 3.37 0 0114 11c1.88 0 3.5 1.63 3.5 3.5V19z" />
                        </svg>
                    </a>
                </div>
            </div>
    
            {/* Copyright */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Learnify. Tous droits réservés.
            </div>
            </div>
        </footer>
    );
}
