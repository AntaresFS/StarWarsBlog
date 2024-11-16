import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router';
import { Context } from '../store/appContext';

export const SingleElement = ({ match }) => {
    const { store, actions } = useContext(Context);
    const { uid, category } = useParams();
    const [imageUrl, setImageUrl] = useState("");


    useEffect(() => {
        // Cargar los detalles del elemento si no están en el store
        if (!store.details[`${category}_${uid}`]) {
            actions.loadElementDetails(category, uid);
        }

        // Obtener la imagen y actualizar el estado
        actions.getImageUrl(category, uid).then((url) => {
            setImageUrl(url);
        });

    }, [category, uid, actions, store.details]);

    // Renderizar la información del elemento
    const elementDetails = store.details[`${category}_${uid}`];

    if (!elementDetails) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container d-flex flex-column text-light">
            <h1 className=" text-center mb-3">{elementDetails.name}</h1>
            <div className="d-flex justify-content-evenly align-items-center">
                <img className="mb-5" src={imageUrl} alt={elementDetails.name} />
                <div>
                    {/* Renderiza aquí todos los detalles del elemento */}
                    <p className="fw-bold fs-3 ps-4">Detalles:</p>
                    <ul>
                        {Object.entries(elementDetails).map(([key, value]) => (
                            <li className="fs-5" key={key}>
                                <strong >{key}:</strong> {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


