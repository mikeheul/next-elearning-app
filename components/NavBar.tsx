"use client";

import { useState } from "react";
import { LogIn, MenuIcon, User, UserPlus, XIcon } from "lucide-react";
import Link from 'next/link';
import ThemeSwitcher from "./ThemeSwitcher";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();

    const toggleMenu = () => setIsOpen(!isOpen);
    const handleLinkClick = () => setIsOpen(false);

    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <nav className="bg-slate-200 dark:bg-gray-800 shadow-md z-10 py-5">
            <div className="px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" onClick={handleLinkClick} className="text-2xl font-bold text-gray-900 dark:text-white">
                        Learnify
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <SignedOut>
                            <Link href="/sign-in" className="flex items-center dark:text-white transition duration-300">
                                <LogIn size={20} strokeWidth={1} />
                                <span className="ml-2">Se connecter</span>
                            </Link>
                            <Link href="/sign-up" className="flex items-center dark:text-white transition duration-300">
                                <UserPlus size={20} strokeWidth={1} />
                                <span className="ml-2">S&apos;inscrire</span>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <div className="flex items-center space-x-3">
                                <UserButton afterSignOutUrl="/" />
                                <Link href="/profile" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                                    {user?.firstName || user?.username}
                                </Link>
                                {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white rounded-full px-4 py-1 transition duration-300 shadow-lg flex items-center gap-2"
                                    aria-label="Accéder à l'espace Admin"
                                >
                                    <User className="w-5 h-5" />
                                    Admin
                                </Link>
                                )}
                            </div>
                            <Link href="/course" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
                                Cours
                            </Link>
                            <Link href="/progression" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
                                Progressions
                            </Link>
                        </SignedIn>

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
                            <div className="flex flex-col items-center justify-center gap-3 rounded-full p-1 px-3">
                                <Link href="/profile" onClick={handleLinkClick} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow duration-300">
                                    {user?.firstName || user?.username}
                                </Link>
                                {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white rounded-full px-4 py-1 transition duration-300 shadow-lg flex items-center gap-2"
                                    aria-label="Accéder à l'espace Admin"
                                >
                                    <User className="w-5 h-5" />
                                    Admin
                                </Link>
                                )}
                                <Link href="/course" onClick={handleLinkClick} className="block text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 text-base font-medium transition duration-300">
                                    Cours
                                </Link>
                                <Link href="/progression" onClick={handleLinkClick} className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
                                    Progressions
                                </Link>
                            </div>
                        </SignedIn>

                        <SignedOut>
                            <Link href="/sign-in" className="flex items-center dark:text-white transition duration-300">
                                <LogIn size={20} strokeWidth={1} />
                                <span className="ml-2">Se connecter</span>
                            </Link>
                            <Link href="/sign-up" className="flex items-center dark:text-white transition duration-300">
                                <UserPlus size={20} strokeWidth={1} />
                                <span className="ml-2">S&apos;inscrire</span>
                            </Link>
                        </SignedOut>

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
