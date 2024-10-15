export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">À propos de nous</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
                Nous sommes une équipe passionnée dédiée à fournir des contenus éducatifs de haute qualité.
                Notre mission est d&apos;inspirer et d&apos;aider nos utilisateurs à atteindre leurs objectifs d&apos;apprentissage.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full md:w-1/3">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Notre Vision</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Offrir une plateforme d&apos;apprentissage accessible à tous, où chacun peut progresser à son rythme.
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full md:w-1/3">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Notre Équipe</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Composée d&apos;experts dans divers domaines, notre équipe est là pour vous accompagner et vous guider.
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full md:w-1/3">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Nos Valeurs</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        L&apos;intégrité, la transparence et l&apos;innovation sont au cœur de tout ce que nous faisons.
                    </p>
                </div>
            </div>
        </div>
    );
}
