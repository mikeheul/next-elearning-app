"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react"; // ou lucide-react pour les icônes
import Link from 'next/link';
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className={`bg-slate-200 dark:bg-gray-800 shadow-md w-full z-10 py-5`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                            Learnify
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/course" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Cours
                        </Link>
                        <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            À propos
                        </Link>
                        <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Contact
                        </Link>
                        <ThemeSwitcher />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 focus:outline-none">
                            {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/course" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium">
                            Cours
                        </Link>
                        <Link href="/about" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium">
                            À propos
                        </Link>
                        <Link href="/contact" className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium">
                            Contact
                        </Link>
                        <ThemeSwitcher />
                    </div>
                </div>
            )}
        </nav>
    );
}
