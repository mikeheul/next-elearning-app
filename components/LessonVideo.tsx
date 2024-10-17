"use client";

import { useRef, useEffect } from "react";

interface VideoProps {
    src: string;
}

const Video = ({ src }: VideoProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Empêche la réinitialisation de la vidéo à chaque re-rendu
    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
        videoElement.currentTime = parseFloat(localStorage.getItem(src) || "0");

        const saveCurrentTime = () => {
            localStorage.setItem(src, videoElement.currentTime.toString());
        };

        videoElement.addEventListener("timeupdate", saveCurrentTime);

        return () => {
            videoElement.removeEventListener("timeupdate", saveCurrentTime);
        };
        }
    }, [src]);

    return (
        <video ref={videoRef} controls width="100%" height="auto">
            <source src={src} type="video/mp4" />
            Votre navigateur ne supporte pas la balise vidéo.
        </video>
    );
};

export default Video;
