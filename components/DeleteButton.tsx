import React from 'react'
import { TrashIcon } from "lucide-react";

interface DeleteButtonProps {
    id: string;
    handleDelete: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void; // Accepte l'événement ici
}

const DeleteButton = ({ id, handleDelete }: DeleteButtonProps) => {

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        handleDelete(event, id);
    };

    return (
        <button 
            onClick={onClick}
            className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-bl-lg rounded-tr-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
        >
            <TrashIcon size={12} />
        </button>
    )
}

export default DeleteButton