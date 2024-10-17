import React from 'react';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });

const markdownParser = new MarkdownIt({ 
    html: true, // Permet le rendu de HTML
    linkify: true,
    typographer: true,
});

interface MarkdownEditorProps {
    content: string;
    setContent: (content: string) => void;
}

interface EditorChangeEvent {
    html: string;
    text: string;
}

export default function MarkdownEditor({ content, setContent }: MarkdownEditorProps) {
    const handleEditorChange = ({ text }: EditorChangeEvent) => {
        setContent(text);
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            <MdEditor
                value={content}
                style={{ height: '400px' }}
                renderHTML={(text) => markdownParser.render(text)}
                onChange={handleEditorChange}
            />
        </div>
    );
}
