import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import './App.css';
import HomePage from './Pages/HomePage';

function App() {
  return (<Router>
    <Navbar/>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/module' /> 
    </Routes>
  </Router>
    
  );
}

export default App;
