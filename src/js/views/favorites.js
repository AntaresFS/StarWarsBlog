import React, { useContext } from "react";
import { Context } from "../store/appContext";
import ElementCard from "../component/elementCard";

export const Favorites = () => {
    const { store } = useContext(Context);

    // Agrupar los favoritos por categorías
    const groupedFavorites = store.favorites.reduce((acc, item) => {
        // Crear un array para cada categoría si no existe
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        // Agregar el elemento a su respectiva categoría
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="container mt-5 h-100">
            <h1 className="text-center text-light mb-4">Favoritos</h1>
            {Object.keys(groupedFavorites).length > 0 ? (
                Object.keys(groupedFavorites).map((category) => (
                    <div key={category} className="mb-5">
                        <h2 className="text-capitalize text-light mb-3">{category}</h2>
                        <div className="row">
                            {groupedFavorites[category].map((item) => (
                                <div className="col-md-3 mb-4" key={`${item.uid}_${item.category}`}>
                                    <ElementCard 
                                        category={item.category} 
                                        element={item} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-light">No tienes favoritos.</p>
            )}
        </div>
    );
};

