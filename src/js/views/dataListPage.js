import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";
import ElementCard from "../component/elementCard";
import SearchBar from "../component/buscador";

export const DataListPage = () => {
    const { store, actions } = useContext(Context);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [visibleItems, setVisibleItems] = useState(3);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState({
        people: 0,
        vehicles: 0,
        planets: 0,
    });


    useEffect(() => {

        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 576) {
                setVisibleItems(1);
            } else if (width < 768) {
                setVisibleItems(2);
            } else if (width < 992) {
                setVisibleItems(3);
            } else {
                setVisibleItems(4);
            }
        };

        // Llamar a handleResize al cargar el componente
        handleResize();

        // Llamar a loadAllData cuando el componente se monte
        actions.loadAllData();

        // Agregar el listener para el evento resize
        window.addEventListener('resize', handleResize);

        // Limpiar el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [actions]); // Dependencia para evitar warnings



    const handleNext = (category) => {
        setCurrentIndex((prevIndex) => ({
            ...prevIndex,
            [category]: prevIndex[category] + visibleItems,
        }));
    };

    const handlePrev = (category) => {
        setCurrentIndex((prevIndex) => ({
            ...prevIndex,
            [category]: Math.max(prevIndex[category] - visibleItems, 0),
        }));
    };

    const renderCarousel = (category, items) => {
        return (
            <div>
                <h2 className="text-light">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => handlePrev(category)}
                        disabled={currentIndex[category] === 0}
                    >
                        {"<"}
                    </button>
                    
                    <div className="d-flex overflow-hidden" style={{ width: `${visibleItems * 18}rem` }}>
                        {items.slice(currentIndex[category], currentIndex[category] + visibleItems).map((item) => {
                            const details = store.details[`${category}_${item.uid}`] || {};
                            return (
                                <ElementCard
                                    key={item.uid}
                                    category={category}
                                    element={{ ...item, ...details }}
                                />
                            );
                        })}
                    </div>
                    <button
                        className="btn btn-secondary ms-2"
                        onClick={() => handleNext(category)}
                        disabled={currentIndex[category] + visibleItems >= items.length}
                    >
                        {">"}
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (selectedCategory) {
            case "people":
                return renderCarousel("people", store.people);
            case "vehicles":
                return renderCarousel("vehicles", store.vehicles);
            case "planets":
                return renderCarousel("planets", store.planets);
            default:
                return (
                    <>
                        {renderCarousel("people", store.people)}
                        {renderCarousel("vehicles", store.vehicles)}
                        {renderCarousel("planets", store.planets)}
                    </>
                );
        }
    };

    return (
        <div >
            <div className="offcanvas offcanvas-start"
                data-bs-scroll="true"
                id="offcanvasCategories"
                tabIndex="-1"
                aria-labelledby="offcanvasCategoriesLabel"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white' }}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasCategoriesLabel">Categorías</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body">
                    <ul className="list-group">
                        <li
                            className={`list-group-item  ${selectedCategory === "all" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedCategory("all");
                                setIsPanelOpen(false); // Cerrar al seleccionar
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Todas las categorías
                        </li>
                        <li
                            className={`list-group-item ${selectedCategory === "people" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedCategory("people");
                                setIsPanelOpen(false); // Cerrar al seleccionar
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            People
                        </li>
                        <li
                            className={`list-group-item  ${selectedCategory === "vehicles" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedCategory("vehicles");
                                setIsPanelOpen(false); // Cerrar al seleccionar
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Vehicles
                        </li>
                        <li
                            className={`list-group-item  ${selectedCategory === "planets" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedCategory("planets");
                                setIsPanelOpen(false); // Cerrar al seleccionar
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            Planets
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mt-4">
                <h1 className="text-center text-light">Data List Page</h1>
                <div className="d-flex align-items-center justify-content-between">
                    <h2 className="btn-link text-light fw-bold mb-4"
                        role="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasCategories"
                        aria-controls="Categories"
                    >
                        Categorías
                    </h2>
                    <SearchBar />
                </div>

                {renderContent()}
            </div>
        </div>
    );
};
