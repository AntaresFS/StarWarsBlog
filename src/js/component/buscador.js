import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext'; // Ajusta la ruta según tu estructura de archivos
import { useNavigate } from 'react-router-dom';

const Buscador = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm === '') {
            setSuggestions([]);
            return;
        }

        const filteredSuggestions = [];

        // Busca coincidencias en todas las categorías
        ['people', 'vehicles', 'planets'].forEach(category => {
            const items = store[category] || [];
            items.forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    filteredSuggestions.push({ ...item, category });
                }
            });
        });

        setSuggestions(filteredSuggestions);
    }, [searchTerm, store]);

    const handleSuggestionClick = (suggestion) => {
        actions.navigateToElementDetail(suggestion.category, suggestion.uid, navigate);
        setSearchTerm('');
        setSuggestions([]);
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Buscador;


