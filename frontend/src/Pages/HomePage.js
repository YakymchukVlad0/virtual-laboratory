import React from "react";
import Cards from "../Components/Cards";
import Slider from "../Components/Slider";

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