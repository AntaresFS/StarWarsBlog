import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {

	return (
		<div className="container d-flex align-items-center text-center text-light fw-boldh-100 mt-5">
			<h1>
				<p>Bienvenidos a este intento de DataBank</p>
				<p>donde podremos consultar información de los personajes,</p>
				<p>vehículos y planetas del universo de Star Wars.</p>
			</h1>
		</div>

	)
};
