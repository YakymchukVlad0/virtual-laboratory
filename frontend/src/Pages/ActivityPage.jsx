import React from "react";
import DateFilter from "../Components/DateFilter.jsx";
import EventsNavigation from "../Components/EventsNavigation.jsx";


const ActivityPage = () => {
    return ( <>
    <EventsNavigation/>
    <h1>My activity</h1>
    <h3>Activity insights</h3>
    <p>Keep track of your learning activity, and progress toward your goals. Use the date filter for activity in different time frames
    </p>
    <DateFilter/>
    </> );
}
 
export default ActivityPage;