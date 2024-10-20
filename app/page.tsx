import Link from "next/link";

interface FeatureCardProps {
    title: string;
    description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md text-center">
    <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 sm:p-20 bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Section d'accueil */}
      <header className="flex flex-col gap-8 row-start-1 items-center text-center">
        <h1 className="text-4xl text-center sm:text-6xl font-bold text-blue-600 dark:text-blue-400">
          Bienvenue sur <span className="text-blue-500">Learnify</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
          Maîtrisez de nouvelles compétences, explorez des connaissances et libérez votre potentiel grâce à nos cours animés par des experts.
        </p>
        <Link href="/course" className="w-full text-center mb-10" aria-label="Commencer le cours">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300">
            Commencer
          </button>
        </Link>
      </header>

      {/* Section des caractéristiques */}
      <main className="row-start-2 flex flex-col items-center sm:items-stretch gap-16">
        <h2 className="text-3xl sm:text-4xl text-center font-semibold text-gray-800 dark:text-gray-100">
          Pourquoi choisir Learnify&nbsp;?
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
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
    </div>
  );
}
