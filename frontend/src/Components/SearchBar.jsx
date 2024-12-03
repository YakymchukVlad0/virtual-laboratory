import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import {taskData as data} from "../FakeData/Data";
import "../Styles/SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const styleObject = {
    backgroundColor: 'transparent',
    border: 'none',
    height: '100%',
    fontSize: '1.25rem',
    width: '100%',
    marginLeft: '5px',
    color: '#333',
    marginTop: '0px',
  };

  const fetchData = (value) => {
    const results = data.filter((task)=>{
        return ( 
            value &&
            task &&
            task.name &&
            task.name.includes(value)
        );
    });
    setResults(results);

   /* fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        setResults(results);
      });*/
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        style={styleObject}
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};