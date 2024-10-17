import React from 'react';

interface VideoEmbedProps {
    src: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ src }) => {
    return (
        <video controls width="100%">
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
};

export default VideoEmbed;