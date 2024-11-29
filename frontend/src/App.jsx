import React from "react";
import {Route , BrowserRouter, Routes } from 'react-router-dom';
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
import ProfilePage from "./Pages/ProfilePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx"; // Логін
import RegisterPage from "./Pages/RegisterPage.jsx"; // Реєстрація
import PrivateRoute from "./Components/PrivateRoute.jsx"; // Захищений маршрут
import { AuthProvider } from "./Contexts/AuthContext.jsx";
import EventsNavigation from "./Components/EventsNavigation.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="module" element={<PrivateRoute />}>
              <Route index element={<EventsLayout />} />
              <Route path="activity" element= {<ActivityPage />} />
              <Route path="stats" element={<StatisticsPage />} />
              <Route path="leaderboard" element={<LeadersPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
            <Route path="m2" element={<PageContent title="Development" />} />
            <Route path="profile" element={<PrivateRoute />}>
              <Route index element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;