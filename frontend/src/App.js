//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './Pages/Error';
import Navbar from './Components/Navbar';
import './App.css';
import HomePage from './Pages/HomePage';
import StatisticsPage from './Pages/StatisticsPage';
import EventsLayout from './Pages/EventsLayout';
import PageContent from './Components/PageContent';
import ActivityPage from './Pages/ActivityPage';
import AnalyticsPage from './Pages/AnalyticsPage';
import LeadersPage from './Pages/LeadersPage';

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
              path: 'stats',
              element: <StatisticsPage/>
              
            },
            {
              path: 'my_activity',
              element: <ActivityPage/>
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
