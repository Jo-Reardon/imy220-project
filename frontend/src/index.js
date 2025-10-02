import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faFolder, faUsers, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faFolder, faUsers, faSearch, faPlus);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Starfield from './components/Starfield.js';
import SplashPage from './pages/SplashPage.js';
import LoginForm from './components/forms/LoginForm.js';
import HomePage from './pages/HomePage.js';
import ProfilePage from './pages/ProfilePage.js';

function App() {
    const isLoggedIn = localStorage.getItem('user');

    return (
        <>
            <Starfield />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <SplashPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} />
                    <Route path="/profile/:username" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);