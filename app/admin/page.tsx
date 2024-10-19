"use client";

import { useEffect, useState } from "react";
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

// Import ChartJS modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const dynamic = 'force-dynamic'

// Types for popular course data
type CoursePopularity = {
    courseId: string;
    title: string;
    totalProgressions: number; // Assurez-vous que c'est correct
};

export default function AdminPage() {
    const [courseData, setCourseData] = useState<CoursePopularity[]>([]);

    // Fetch the 5 most popular courses
    useEffect(() => {
        async function fetchPopularCourses() {
            try {
                const response = await fetch("/api/admin/popularCourses");
                if (!response.ok) {
                    throw new Error("Unable to fetch popular courses");
                }
                const data: CoursePopularity[] = await response.json();
                setCourseData(data);
            } catch (error) {
                console.error("Error fetching popular courses:", error);
            }
        }

        fetchPopularCourses();
    }, []);

    // Prepare data for Chart.js
    const chartData = {
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
    };

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
                    
                    {courseData.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300">Aucune donnée disponible</p>
                    ) : (
                        <div className="w-full md:w-2/3" style={{ height: "400px" }}>
                            <Bar data={chartData} options={chartOptions} />
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}