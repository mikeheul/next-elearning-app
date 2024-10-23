"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';
import { CloudinaryUploadWidgetResults, CldUploadWidget } from 'next-cloudinary';
import { Level } from '@/types/interfaces';

export default function AddLesson() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [levelId, setLevelId] = useState('');
    const [levelOptions, setLevelOptions] = useState<Level[]>([]);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const router = useRouter();

    const { courseId } = useParams(); 

    useEffect(() => {
        async function fetchLevels() {
            try {
                const response = await fetch('/api/level');
                const data = await response.json();
                setLevelOptions(data);
                if (data.length > 0) {
                    setLevelId(data[0].id);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des niveaux de difficulté', error);
            }
        }
        fetchLevels();
    }, []);

    const handleSuccess = useCallback((result: CloudinaryUploadWidgetResults) => {
        const info = result.info;

        if (info && typeof info !== 'string') {
            console.log('Upload success:', info.secure_url);
            const uploadedVideoUrl = info.secure_url;

            // Enregistre l'URL de la vidéo
            setVideoUrl(uploadedVideoUrl);

            // Générer la balise vidéo une seule fois pour l'intégrer dans le Markdown
            const videoHtml = `<video controls width="100%">
                <source src="${uploadedVideoUrl}" type="video/mp4">
                Your browser does not support the video tag.
            </video>`;

            // Ajoute la vidéo dans le contenu Markdown
            setContent((prevContent) => `${prevContent}\n\n${videoHtml}`);
        } else {
            console.error('Upload failed: info is undefined or is a string');
        }
    }, []);

    useEffect(() => {
        if (videoRef.current && videoUrl) {
            videoRef.current.play();
        }
    }, [videoUrl]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const response = await fetch(`/api/lesson`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                { 
                    title, 
                    content,
                    courseId,
                    levelId
                }
            ),
        });

        if (response.ok) {
            router.push(`/course/${courseId}`);
        } else {
            console.error('Erreur lors de la création de la leçon');
        }
    };

    const handleUploadButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full p-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Ajouter un nouveau chapitre</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Titre du chapitre
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            placeholder="Titre du chapitre"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contenu du chapitre
                        </label>
                        <MarkdownEditor content={content} setContent={setContent} />
                    </div>

                    {/* Difficulty Level Selector */}
                    <div className="mb-6">
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Niveau de difficulté
                        </label>
                        <select
                            id="level"
                            value={levelId}
                            onChange={(e) => setLevelId(e.target.value)}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            {levelOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <CldUploadWidget 
                            key={2}
                            uploadPreset="pmqgswly"
                            onSuccess={handleSuccess}
                            options={
                                {
                                    "clientAllowedFormats": ['mp4', 'avi'],
                                }
                            }
                        >
                            {({ open }) => (
                                <button 
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={(e) => {
                                        handleUploadButtonClick(e); // Empêche la soumission
                                        open(); // Ouvre le widget de téléchargement
                                    }}
                                >
                                    Téléverser une vidéo
                                </button>
                            )}
                        </CldUploadWidget>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {/* {isUploading ? 'Uploading video...' : 'Enregistrer le chapitre'} */}
                        Enregistrer le chapitre
                    </button>
                </form>

                {/* <div className="mt-5">
                    {videoUrl && (
                        <video ref={videoRef} controls width="100%">
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div> */}
            </div>
        </div>
    );
}
