import "../Styles/SearchResultList.css";
import { SearchResult } from "./SearchResult.jsx";

export const SearchResultsList = ({ results, tasksData }) => {
  console.log(tasksData);
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.name} key={id} tasks={tasksData}/>;
      })}
    </div>
  );
};