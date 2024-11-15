import Cards from "../Components/Cards";
import Slider from "../Components/Slider";
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