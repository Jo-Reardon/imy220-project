import { library } from '@fortawesome/fontawesome-svg-core';
import {
        faHouse,
        faFolder,
        faUsers,
        faRocket,
        faHashtag,
        faCode,
        faSatelliteDish,
        faUserGroup,
        faGlobe,
        faProjectDiagram,
        faPlusCircle,
        faPlus
        } from '@fortawesome/free-solid-svg-icons';

library.add(
        faHouse,
        faFolder,
        faUsers,
        faRocket,
        faHashtag,
        faCode,
        faSatelliteDish,
        faUserGroup,
        faGlobe,
        faProjectDiagram,
        faPlusCircle,
        faPlus
    );


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Starfield from './components/Starfield.js';
import SplashPage from './pages/SplashPage.js';
import LoginForm from './components/forms/LoginForm.js';
import HomePage from './pages/HomePage.js';
import ProfilePage from './pages/ProfilePage.js';
import ExplorePage from './pages/ExplorePage.js';
import FriendsPage from './pages/FriendsPage.js';
import NewProjectPage from './pages/NewProjectPage.js';

function App() {
    const isLoggedIn = localStorage.getItem('user');

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                        <>
                            <Starfield />
                            <SplashPage />
                        </>
                        }
                    />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
                    <Route path="/explore" element={isLoggedIn ? <ExplorePage /> : <Navigate to="/login" />} />
                    <Route path="/profile/:username" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" />} />
                    <Route path="/friends" element={isLoggedIn ? <FriendsPage /> : <Navigate to="/login" />} />
                    <Route path="/projects/new" element={isLoggedIn ? <NewProjectPage /> : <Navigate to="/login" />} />
                    <Route path="/projects/:projectId/edit" element={isLoggedIn ? <NewProjectPage /> : <Navigate to="/login" />} />
                </Routes>

            </BrowserRouter>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);