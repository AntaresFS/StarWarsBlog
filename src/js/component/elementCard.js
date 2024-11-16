import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router';

const ElementCard = ({ category, element }) => {
    const { store, actions } = useContext(Context);
    const [imageUrl, setImageUrl] = useState("");
    const navigate = useNavigate();


    // Obtener la URL de la imagen cuando el componente se monta
    useEffect(() => {
        actions.getImageUrl(category, element.uid)
            .then(url => {
                setImageUrl(url); // Establecer la URL de la imagen
            });
    }, [category, element.uid, actions]);

    // Verificar si el elemento está en la lista de favoritos
    const isFavorite = store.favorites.some(
        (fav) => fav.uid === element.uid && fav.category === category
    );

    const handleFavoriteClick = () => {
        if (isFavorite) {
            actions.removeFromFavorites(element.uid, category);
        } else {
            actions.addToFavorites(element, category);
        }
    };


    return (
        <div className="card" style={{ width: '18rem', margin: '10px' }}>
            <img
                src={imageUrl}
                alt={element.name}
                className="card-img-top"
                role="button"
                onClick={() => actions.navigateToElementDetail(category, element.uid, navigate)}
                onError={() => setImageUrl(actions.getImageUrl(category, 'placeholder'))}
            />
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title" role="button" onClick={() => actions.navigateToElementDetail(category, element.uid, navigate)} >{element.name}</h5>
                    <button
                        className={`btn ${isFavorite ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                        onClick={handleFavoriteClick}
                    >
                        <i className={isFavorite ? 'fa fa-trash' : 'fa fa-heart'}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ElementCard;