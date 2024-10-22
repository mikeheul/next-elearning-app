import { Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">

                    {/* Logo or Brand Name */}
                    <div className="mb-4 md:mb-0">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            Learnify
                        </span>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 text-sm mb-4 md:mb-0">
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
                    <div className="flex justify-center space-x-4">
                        <a
                            href="#"
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            aria-label="GitHub"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
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
