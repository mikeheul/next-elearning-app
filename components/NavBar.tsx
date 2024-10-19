"use client";

import { useState } from "react";
import { LogIn, MenuIcon, UserPlus, XIcon } from "lucide-react"; // ou lucide-react pour les icônes
import Link from 'next/link';
import ThemeSwitcher from "./ThemeSwitcher";

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();

    const toggleMenu = () => setIsOpen(!isOpen);
    const handleLinkClick = () => setIsOpen(false);

    let isAdmin = false;
    if (user) {
        isAdmin = user.publicMetadata?.role === 'admin'; // Optional chaining to prevent errors
    }

    return (
        <nav className={`bg-slate-200 dark:bg-gray-800 shadow-md w-full z-10 py-5`}>
            <div className="px-4 sm:px-6 lg:px-20">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" onClick={handleLinkClick} className="text-2xl font-bold text-gray-900 dark:text-white">
                            Learnify
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">

                        <SignedOut>
                            <Link
                                href="/sign-in"
                                className="block md:inline-block dark:text-white transition duration-300"
                            >
                                <LogIn size={20} strokeWidth={1} />
                            </Link>
                            <Link
                                href="/sign-up"
                                className="block md:inline-block dark:text-white transition duration-300"
                                >
                                <UserPlus size={20} strokeWidth={1} />
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center justify-center gap-3 rounded-full p-1">
                                <div className="flex items-center space-x-2">
                                    {/* Icône utilisateur */}
                                    <Link href="/profile" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                                        {user?.firstName || user?.username}
                                    </Link>
                                </div>
                                <UserButton afterSignOutUrl="/" />

                                {isAdmin && (
                                    <Link href='/admin' className="rounded-lg bg-red-500 hover:bg-red-600 px-3 py-1 text-white">Admin</Link>
                                )}

                                <Link href="/progression" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                    Progressions
                                </Link>    
                            </div>
                        </SignedIn>

                        <Link href="/course" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Cours
                        </Link>
                        {/* <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            À propos
                        </Link>
                        <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Contact
                        </Link> */}
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
                    <div className="flex flex-col items-center px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                        <SignedIn>
                            <div className="flex flex-col justify-center gap-3 rounded-full p-1 px-3">
                                <div className="flex items-center justify-center space-x-2 py-2">
                                    {/* Icône utilisateur */}
                                    <Link href="/profile" onClick={handleLinkClick} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                                        {user?.firstName || user?.username}
                                    </Link>
                                </div>

                                {isAdmin && (
                                    <Link href='/' onClick={handleLinkClick} className="rounded-lg bg-red-500 hover:bg-red-600 px-3 py-1 text-white">Admin</Link>
                                )}

                                <Link href="/progression" onClick={handleLinkClick} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                    Progressions
                                </Link>    
                            </div>
                        </SignedIn>

                        <Link href="/course" onClick={handleLinkClick} className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium">
                            Cours
                        </Link>
                        <Link href="/about" onClick={handleLinkClick} className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium">
                            À propos
                        </Link>
                        <Link href="/contact" onClick={handleLinkClick} className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium">
                            Contact
                        </Link>
                        <ThemeSwitcher />

                        <div className="p-3">
                            <UserButton afterSignOutUrl="/" /> 
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
