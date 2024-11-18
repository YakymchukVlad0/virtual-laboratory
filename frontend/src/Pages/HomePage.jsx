import React from "react";
import Cards from "../Components/Cards.jsx";
import Slider from "../Components/Slider.jsx";
import "../Styles/HomePage.css";
import "../Styles/Slider.css";


const HomePage = () => {
    return ( 
    <>
    <Slider/>
    <div className="cards-info">
        <h1>The service is created for: </h1>
        <Cards/>
    </div>
    </>
     );
}
 
export default HomePage;