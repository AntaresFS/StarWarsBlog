const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			people: JSON.parse(localStorage.getItem("people")) || [],
			vehicles: JSON.parse(localStorage.getItem("vehicles")) || [],
			planets: JSON.parse(localStorage.getItem("planets")) || [],
			details: JSON.parse(localStorage.getItem("details")) || {},
			favorites: JSON.parse(localStorage.getItem("favorites")) || [],
		},
		actions: {

			// Función para cargar todos los elementos de una categoría
			loadCategory: async (category, totalPages) => {
				const storedItems = localStorage.getItem(category); // Verificar si ya hay datos en localStorage
				if (storedItems) {
					// Si hay datos en localStorage, no hacer nada
					console.log(`Ya hay datos en localStorage para ${category}.`);
					return;
				}

				try {
					const allItems = [];

					// Realizar una llamada por cada página para obtener todos los elementos
					for (let page = 1; page <= totalPages; page++) {
						const response = await fetch(`https://www.swapi.tech/api/${category}?page=${page}&limit=10`);
						if (!response.ok) {
							console.error(`Error al cargar ${category} en la página ${page}: ${response.statusText}`);
							return;
						}

						const data = await response.json();
						const items = data.results || [];
						allItems.push(...items);
					}

					// Almacenar todos los elementos de la categoría
					setStore({ [category]: allItems });
					localStorage.setItem(category, JSON.stringify(allItems));

					// Cargar los detalles de cada elemento
					const actions = getActions();
					allItems.forEach(item => actions.loadElementDetails(category, item.uid));
				} catch (error) {
					console.error(`Error al cargar la categoría ${category}:`, error);
				}
			},

			// Función para cargar los detalles de un elemento
			loadElementDetails: async (category, uid) => {
				const store = getStore();

				// Verificar si ya se tienen los detalles almacenados
				if (store.details[`${category}_${uid}`]) {
					return;
				}

				try {
					const response = await fetch(`https://www.swapi.tech/api/${category}/${uid}`);
					if (!response.ok) {
						console.error(`Error al cargar detalles de ${category} con UID ${uid}: ${response.statusText}`);
						return;
					}

					const data = await response.json();
					const details = data.result.properties;

					// Almacenar los detalles en el store
					const updatedDetails = {
						...store.details,
						[`${category}_${uid}`]: details
					};
					setStore({ details: updatedDetails });
					localStorage.setItem("details", JSON.stringify(updatedDetails));
				} catch (error) {
					console.error(`Error en la solicitud de detalles de ${category} con UID ${uid}:, error`);
				}
			},

			// Función para obtener la URL de la imagen
			getImageUrl: (category, uid) => {
				const imageCategory = category === "people" ? "characters" : category;
				const imageUrl = `https://starwars-visualguide.com/assets/img/${imageCategory}/${uid}.jpg`;

				// Definir las URLs de los placeholders según la categoría
				const placeholderImages = {
					vehicles: "https://via.placeholder.com/304x202?text=No+Image+Available",
					planets: "https://via.placeholder.com/304x304?text=No+Image+Available",
					characters: "https://via.placeholder.com/304x418?text=No+Image+Available",
				};

				// Comprobar si la imagen está disponible
				return fetch(imageUrl)
					.then(response => {
						if (response.ok) {
							return imageUrl; // Si la imagen está disponible, devolver la URL
						} else {
							return placeholderImages[imageCategory] || placeholderImages.characters; // Devolver placeholder si no está disponible
						}
					})
					.catch(() => {
						// En caso de error, devolver el placeholder
						return placeholderImages[imageCategory] || placeholderImages.characters;
					});
			},

			// Función para cargar datos de todas las categorías
			loadAllData: async () => {
				const actions = getActions();

				// Solo cargar la categoría si no hay datos en localStorage
				if (!localStorage.getItem("people")) {
					await actions.loadCategory("people", 9); // People tiene 9 páginas
				} else {
					console.log(`Ya hay datos en localStorage para people.`);
				}

				if (!localStorage.getItem("vehicles")) {
					await actions.loadCategory("vehicles", 4); // Vehicles tiene 4 páginas
				} else {
					console.log(`Ya hay datos en localStorage para vehicles.`);
				}

				if (!localStorage.getItem("planets")) {
					await actions.loadCategory("planets", 6); // Planets tiene 6 páginas
				} else {
					console.log(`Ya hay datos en localStorage para planets.`);
				}
			},

			// Función para agregar un elemento a favoritos
			addToFavorites: (element, category) => {
				const store = getStore();
				const updatedFavorites = [...store.favorites, { ...element, category }];

				setStore({ favorites: updatedFavorites });
				localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
			},

			// Función para eliminar un elemento de favoritos
			removeFromFavorites: (uid, category) => {
				const store = getStore();
				const updatedFavorites = store.favorites.filter(
					(fav) => fav.uid !== uid || fav.category !== category
				);

				setStore({ favorites: updatedFavorites });
				localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
			},

			// Cargar los favoritos desde localStorage cuando la aplicación se inicia
			loadFavoritesFromLocalStorage: () => {
				const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
				setStore({ favorites: storedFavorites });
			},

			// Función para redirigir a vista detallada del elemento
			navigateToElementDetail: (category, uid, navigate) => {
                const store = getStore();

                // Verificar si el elemento existe en la categoría correspondiente
                const element = store[category].find(item => item.uid === uid);
                if (!element) {
                    console.error(`Elemento con UID ${uid} no encontrado en la categoría ${category}`);
                    return;
                }

                // Cargar los detalles si no están en el store
                const detailKey = `${category}_${uid}`;
                if (!store.details[detailKey]) {
                    getActions().loadElementDetails(category, uid);
                }

                // Redirigir a la página de detalles del elemento
                navigate(`/single/${category}/${uid}`);
            },


			// Función para limpiar el localStorage relacionado con SWAPI
			clearSwapiLocalStorage: () => {
				for (let i = localStorage.length - 1; i >= 0; i--) {
					const key = localStorage.key(i);
					// Limpiar solo las claves relacionadas con SWAPI
					if (key && (key.startsWith("people") || key.startsWith("vehicles") || key.startsWith("planets") || key.startsWith("favorites") || key.startsWith("details_"))) {
						localStorage.removeItem(key);
					}
				}

				// Limpiar el store local para mantener la consistencia
				setStore({
					people: [],
					vehicles: [],
					planets: [],
					favorites: [],
				});
				console.log("LocalStorage de SWAPI y store limpiados.");
			},

		},
	}
};

export default getState;
