"use client";

import { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import Image from "next/image";

interface User {
    id: string;
    emailAddresses: { emailAddress: string }[];
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | '';
}

interface ApiResponse {
    data: User[]; 
    totalCount: number; 
}

// Import ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const dynamic = 'force-dynamic';

// Types for popular course data
type CoursePopularity = {
    courseId: string;
    title: string;
    totalProgressions: number;
};

export default function AdminPage() {
    const [courseData, setCourseData] = useState<CoursePopularity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                
                const data: ApiResponse = await response.json();
                console.log(data);
                setUsers(data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Fetch the 5 most popular courses
    useEffect(() => {
        const fetchPopularCourses = async () => {
            try {
                const response = await fetch("/api/admin/popularCourses");
                if (!response.ok) {
                    throw new Error("Unable to fetch popular courses");
                }
                const data: CoursePopularity[] = await response.json();
                setCourseData(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        };

        fetchPopularCourses();
    }, []);

    // Prepare data for Chart.js using useMemo
    const chartData = useMemo(() => ({
        labels: courseData.map((course) => course.title),
        datasets: [
            {
                label: "Nombre de suivis",
                data: courseData.map((course) => course.totalProgressions),
                backgroundColor: "rgba(54, 162, 235, 0.5)", // Blue color
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    }), [courseData]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Cours les + populaires",
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Tableau de bord
                </h1>
                
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Cours les plus populaires
                    </h2>
                    
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-300">Chargement des données...</p>
                    ) : error ? (
                        <p className="text-red-600 dark:text-red-300">{error}</p>
                    ) : courseData.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">Aucune donnée disponible</p>
                    ) : (
                        <div className="w-full md:w-2/3" style={{ height: "400px" }}>
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 overflow-x-auto"> 
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Utilisateurs
                </h2>
                {users.length > 0 ? (
                    <table className="my-8 min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                {/* Avatar column hidden on screens smaller than 'md' */}
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase hidden md:table-cell">
                                    Avatar
                                </th>
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase">
                                    Email
                                </th>
                                {/* Name column hidden on screens smaller than 'md' */}
                                <th className="px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold text-left text-sm uppercase hidden md:table-cell">
                                    Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                                    {/* Avatar column hidden on smaller screens */}
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4 hidden md:table-cell">
                                        <Image 
                                            src={user.imageUrl} 
                                            alt={user.id} 
                                            width={50} 
                                            height={50} 
                                            className="w-[50px] h-[50px] rounded-full object-cover" 
                                        />
                                    </td>
                                    <td className="border-b border-gray-200 dark:border-gray-600 px-4 py-4">
                                        {/* Truncate the email and use tooltip to show full email */}
                                        <div className="line-clamp-1 truncate dark:text-white" title={user.emailAddresses[0]?.emailAddress || 'N/A'}>
                                            {user.emailAddresses[0]?.emailAddress || 'N/A'}
                                        </div>
                                    </td>
                                    {/* Name column hidden on smaller screens */}
                                    <td className="border-b border-gray-200 dark:text-white dark:border-gray-600 px-4 py-4 hidden md:table-cell">
                                        {user.firstName} {user.lastName}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="dark:text-white">Aucun utilisateur</p>
                )}
            </div>
        </div>
    );
}