import React from 'react'
import { TrashIcon } from "lucide-react";
import Swal from 'sweetalert2';

interface DeleteButtonProps {
    id: string;
    handleDelete: (event: React.MouseEvent<HTMLButtonElement>, id: string) => void; // Accepte l'événement ici
}

const DeleteButton = ({ id, handleDelete }: DeleteButtonProps) => {

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action ne peut pas être annulée !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result: { isConfirmed: boolean }) => {
            if (result.isConfirmed) {
                handleDelete(event, id);
            }
        });
    };

    return (
        <button 
            onClick={onClick}
            className="text-white font-bold transition duration-300 ease-in-out"
        >
            <TrashIcon className="text-red-500 hover:text-red-600" size={14} />
        </button>
    )
}

export default DeleteButton