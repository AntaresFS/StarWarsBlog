import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./views/home";
import { SingleElement } from "./views/singleElement";
import { Favorites } from "./views/favorites";
import { DataListPage } from "./views/dataListPage";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import bgImage from '../img/sw-bg.jpg'
import bgImage2 from '../img/sw-space.jpg';


import '../styles/index.css'


//create your first component
const Layout = () => {
	//the basename is used when your project is published in a subdirectory and not in the root of the domain
	// you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
	const basename = process.env.BASENAME || "";

	const backgroundStyle = {
		backgroundImage: `url(${bgImage}), url(${bgImage2})`,
		backgroundSize: 'cover, auto',
		backgroundPosition: 'center, left top',
		backgroundRepeat: 'no-repeat, repeat',
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
	};


	return (
		<div className="app-background" style={backgroundStyle}>
			<BrowserRouter basename={basename}>
				<ScrollToTop>
					<Navbar />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/single/:category/:uid" element={<SingleElement />} />
						<Route path="/favorites" element={<Favorites />} />
						<Route path="/list" element={<DataListPage />} />
						<Route path="*" element={<h1>Not found!</h1>} />
					</Routes>
					<Footer />
				</ScrollToTop>
			</BrowserRouter>
		</div>
	);
};

export default injectContext(Layout);
