import './App.css'
import {Route , Routes, useLocation, Navigate} from 'react-router-dom';
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Layout from './Layout.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PlacesPage from './pages/PlacesPage.jsx';
import PlacesFormPage from './pages/PlacesFormPage.jsx';
import axios from 'axios';
import PlacePage from './pages/PlacePage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import OwnerBookingsPage from './pages/OwnerBookingsPage.jsx';
import { UserContextProvider, UserContext } from "./UserContext";
import { useContext } from 'react';

// Set API base URL based on environment
if (window.location.hostname === 'localhost') {
  axios.defaults.baseURL = 'http://localhost:4000';
} else {
  axios.defaults.baseURL = 'https://mybookingapp-backend.onrender.com';
}
axios.defaults.withCredentials = true; 
function AppRoutes() {
  const { user, ready } = useContext(UserContext);
  const location = useLocation();
  if (!ready) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }
  // Only allow /login and /register if not logged in
  if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace />;
  }
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<IndexPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/account" element={<ProfilePage/>}/>
        <Route path="/account/places" element={<PlacesPage/>}/>
        <Route path="/account/places/new" element={<PlacesFormPage/>}/>
        <Route path="/account/places/:id" element={<PlacesFormPage/>}/>
        <Route path="/place/:id" element={<PlacePage/>}/>
        <Route path="/account/bookings" element={<BookingsPage/>}/>  
        <Route path="/account/bookings/:id" element={<BookingPage/>}/>  
        <Route path="/account/owner-bookings" element={<OwnerBookingsPage/>}/>  
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserContextProvider>
      <AppRoutes />
    </UserContextProvider>
  );
}

export default App
