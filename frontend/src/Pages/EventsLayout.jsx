import React from "react";
import { Outlet } from "react-router-dom";
import EventsNavigation from "../Components/EventsNavigation.jsx";

function EventsLayout() {
  return (
    <div>
      <EventsNavigation />
      <Outlet />
    </div>
  );
}

export default EventsLayout;
