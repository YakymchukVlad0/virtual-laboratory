import React from "react";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './Pages/Error.jsx';
import Navbar from './Components/Navbar.jsx';
import './App.css';
import HomePage from './Pages/HomePage.jsx';
import StatisticsPage from './Pages/StatisticsPage.jsx';
import EventsLayout from './Pages/EventsLayout.jsx';
import PageContent from './Components/PageContent.jsx';
import ActivityPage from './Pages/ActivityPage.jsx';
import AnalyticsPage from './Pages/AnalyticsPage.jsx';
import LeadersPage from './Pages/LeadersPage.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navbar/>,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: '/module',
          element: <EventsLayout/>,
          children: [
            {
              index: true,
              element: <ActivityPage/>
            },
            {
              path: 'stats',
              element: <StatisticsPage/>
              
            },
            {
              path: 'leaderboard',
              element: <LeadersPage/>
            },
            {
              path: 'analytics',
              element: <AnalyticsPage/>
            },
          ],
        },
        {
          path: '/m2',
          element: <PageContent title="Development" />
          
        },
      ],
    },
  ]);


  return (
    <RouterProvider router={router} />
  );
}

export default App;
