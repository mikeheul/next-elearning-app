import { useRef, useEffect, useState } from 'react';

interface VideoEmbedProps {
    src: string;
}

const VideoEmbed = ({ src }: VideoEmbedProps) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Référence à l'élément vidéo
    const [currentTime, setCurrentTime] = useState(0); // État pour mémoriser le temps de lecture

    useEffect(() => {
        const videoElement = videoRef.current;

        // Reprendre la lecture de la vidéo là où elle s'est arrêtée
        if (videoElement) {
            videoElement.currentTime = currentTime;
        }

        const handleTimeUpdate = () => {
            if (videoElement) {
                setCurrentTime(videoElement.currentTime); // Mettre à jour le temps écoulé
            }
        };

        // Ajouter un écouteur pour suivre la progression de la vidéo
        videoElement?.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            videoElement?.removeEventListener('timeupdate', handleTimeUpdate); // Nettoyage
        };
    }, [currentTime]);

    return (
        <video ref={videoRef} controls width="100%">
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoEmbed;