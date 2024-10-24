"use client";

import CategoryCard from "@/components/CategoryCard";
import FeatureCard from "@/components/FeatureCard";
import { Category } from "@/types/interfaces";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des catégories.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Section d'accueil */}
      <header className="flex flex-col gap-4 sm:gap-8 row-start-1 items-center text-center max-w-[250px] sm:max-w-full">
        <h1 className="text-2xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 break-words">
          Bienvenue sur <span className="text-blue-500">Learnify</span>
        </h1>
        <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300">
          Maîtrisez de nouvelles compétences, explorez des connaissances et libérez votre potentiel grâce à nos cours animés par des experts.
        </p>
        <Link href="/course" className="w-full text-center py-5">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition duration-300">
            Commencer
          </button>
        </Link>
      </header>

      {/* Section des caractéristiques */}
      <main className="row-start-2 flex flex-col items-center gap-8 sm:gap-16 w-full sm:max-w-full">
        <h2 className="text-xl sm:text-3xl text-center font-semibold text-gray-800 dark:text-gray-100">
          Pourquoi choisir Learnify&nbsp;?
        </h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          <FeatureCard
            title="Instructeurs Experts"
            description="Apprenez auprès d'experts du secteur avec une expérience réelle."
          />
          <FeatureCard
            title="Apprentissage Flexible"
            description="Étudiez à votre rythme, à tout moment et en tout lieu."
          />
          <FeatureCard
            title="Soutien Communautaire"
            description="Rejoignez une communauté d'apprenants et collaborez ensemble."
          />
        </div>
      </main>

      {/* Section des catégories */}
      <section className="flex flex-col items-center justify-center w-full sm:max-w-full mt-4 sm:mt-8">
  <h2 className="text-xl sm:text-3xl text-center font-semibold text-gray-800 dark:text-gray-100 my-8">
    Explorez nos catégories
  </h2>
  <div className="flex flex-wrap justify-center gap-4 w-full sm:max-w-5xl">
    {categories.length > 0 ? (
      categories.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          name={category.name}
        />
      ))
    ) : (
      <p className="flex w-full items-center justify-center text-center text-gray-600 dark:text-gray-400">
        Chargement des catégories...
      </p>
    )}
  </div>
</section>

    </div>
  );
}