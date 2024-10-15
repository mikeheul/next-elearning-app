export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contactez-nous</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
                Nous serions ravis de recevoir vos questions ou vos commentaires.
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
            </p>
            <form className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                        Nom
                    </label>
                    <input
                        type="text"
                        id="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="message">
                        Message
                    </label>
                    <textarea
                        id="message"
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
}
