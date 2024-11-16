import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import swLogo from "../../img/sw-logo.jpg"
import ClearSwapiButton from "../component/clearSwapiButton";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [messageVisible, setMessageVisible] = useState(false);
    const navigate = useNavigate();

    const handleLoadData = async () => {
        setLoading(true);
        await actions.loadAllData();
        setLoading(false);
    };

    // Función que se ejecuta al hacer clic en el botón
    const handleClearStorage = () => {
        // Llama a la función clearSwapiLocalStorage desde flux
        actions.clearSwapiLocalStorage();

        // Muestra el mensaje de éxito
        setMessageVisible(true);

        // Oculta el mensaje después de 5 segundos
        setTimeout(() => {
            setMessageVisible(false);
        }, 5000);
    };

    const handleHomeRedirect = () => {
        navigate("/");
    };

    const handleDataListRedirect = () => {
        navigate("/list");
    };

    const handleFavoritesRedirect = () => {
        navigate("/favorites");
    };



    return (
        <>
            <nav className="navbar navbar-dark bg-dark p-3 mb-3">
                <div className="container d-flex -justify-content-between">
                    <div className="btn btn-dark d-flex justify-content-start align-items-center" onClick={handleHomeRedirect}>
                        <img src={swLogo} />
                    </div>

                    {messageVisible && (<a className="alert alert-success" role="alert">Datos eliminados</a>)}

                    <div className="d-flex align-items-center">
                        {/* Botón que redirige a Data List*/}
                        <button className="btn btn-link text-light fw-bold mx-1" onClick={handleDataListRedirect}>
                            Data
                        </button>

                        {/* Botón que redirige a la página de favoritos */}
                        <button className="btn btn-link text-light fw-bold mx-1" onClick={handleFavoritesRedirect} >
                            Favoritos
                        </button>

                        {/* Botón que eliminna los datos almacenados en el localStorage */}
                        <div className="dropdown">
                            <button className="btn btn-link text-danger fw-bold mx-1" onClick={handleClearStorage} >
                                Borrar datos
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};


