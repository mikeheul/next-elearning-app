import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 sm:p-20 bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Section d'accueil */}
      <header className="flex flex-col gap-8 row-start-1 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl font-bold text-blue-600 dark:text-blue-400">
          Bienvenue sur <span className="text-blue-500">Learnify</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300">
          Maîtrisez de nouvelles compétences, explorez des connaissances et libérez votre potentiel grâce à nos cours animés par des experts.
        </p>
        <Link href="/course">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 my-5">
            Commencer
          </button>
        </Link>
      </header>

      {/* Section des caractéristiques */}
      <main className="row-start-2 flex flex-col items-center sm:items-stretch gap-16">
        <h2 className="text-3xl text-center sm:text-4xl font-semibold text-gray-800 dark:text-gray-100">
          Pourquoi choisir Learnify&nbsp;?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3 w-full">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Instructeurs Experts</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Apprenez auprès d&apos;experts du secteur avec une expérience réelle.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Apprentissage Flexible</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Étudiez à votre rythme, à tout moment et en tout lieu.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md text-center">
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Soutien Communautaire</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Rejoignez une communauté d&apos;apprenants et collaborez ensemble.
            </p>
          </div>
        </div>
      </main>

      {/* Appel à l'action */}
      <footer className="row-start-3 flex flex-col items-center gap-4 mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Prêt à plonger ?
        </h2>
        <Link href="/course">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg transition duration-300">
            Explorer les Cours
          </button>
        </Link>
      </footer>
    </div>
  );
}