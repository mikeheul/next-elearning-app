// import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw';
// import rehypeReact from 'rehype-react';
// import VideoEmbed from './VideoEmbed'; // Composant personnalisé pour les vidéos

// interface MarkdownRendererProps {
//     content: string;
// }

// const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
//     return (
//         <ReactMarkdown
//             children={content}
//             rehypePlugins={[
//                 rehypeRaw, // Permet de traiter du HTML brut dans le Markdown
//                 [
//                     rehypeReact,
//                     {
//                         createElement: React.createElement,
//                         components: {
//                             video: VideoEmbed, // Remplace la balise <video> par VideoEmbed
//                         },
//                     },
//                 ],
//             ]}
//         />
//     );
// };

// export default MarkdownRenderer;
