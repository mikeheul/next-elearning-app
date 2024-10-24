import React from 'react'
import { PencilIcon } from "lucide-react";

interface EditButtonProps {
    id: string;
    handleEdit: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void; // Accepte l'événement ici
}

const EditButton = ({ id, handleEdit }: EditButtonProps) => {

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        handleEdit(event, id);
    };

    return (
        <button 
            onClick={onClick}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 transition duration-300 ease-in-out focus:outline-none"
        >
            <PencilIcon size={12} />
        </button>
    )
}

export default EditButton