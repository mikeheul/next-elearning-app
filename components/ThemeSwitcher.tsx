"use client";

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react'; // Importer les icônes

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="rounded-md focus:outline-none flex items-center justify-center p-2"
            aria-label="Switch theme" // Ajout d'une étiquette pour l'accessibilité
        >
            {theme === 'light' ? (
                <Moon className="w-6 h-6 text-gray-400" /> // Icône de la lune
            ) : (
                <Sun className="w-6 h-6 text-yellow-500" /> // Icône du soleil
            )}
        </button>
    );
};

export default ThemeSwitcher;
