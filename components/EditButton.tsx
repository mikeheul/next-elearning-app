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
            className="text-white font-bold transition duration-300 ease-in-out focus:outline-none"
        >
            <PencilIcon className="text-orange-500 hover:text-orange-600" size={14} />
        </button>
    )
}

export default EditButton