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
import ProjectDetailPage from './pages/ProjectDetailPage.js';
import SearchPage from './pages/SearchPage.js';
import FriendsPage from './pages/FriendsPage.js';
import MyProjectsPage from './pages/MyProjectsPage.js';
import ExplorePage from './pages/ExplorePage.js';
import TestPage from './pages/TestPage.js';

function PrivateRoute({ children }) {
    const user = localStorage.getItem('user');
    return user ? children : <Navigate to="/" />;
}

function App() {
    return (
        <>
            <Starfield />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SplashPage />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/home" element={
                        <PrivateRoute><HomePage /></PrivateRoute>
                    } />
                    <Route path="/profile/:username" element={
                        <PrivateRoute><ProfilePage /></PrivateRoute>
                    } />
                    <Route path="/project/:projectId" element={
                        <PrivateRoute><ProjectDetailPage /></PrivateRoute>
                    } />
                    <Route path="/projects" element={
                        <PrivateRoute><MyProjectsPage /></PrivateRoute>
                    } />
                    <Route path="/search" element={
                        <PrivateRoute><SearchPage /></PrivateRoute>
                    } />
                    <Route path="/friends" element={
                        <PrivateRoute><FriendsPage /></PrivateRoute>
                    } />
                    <Route path="/explore" element={
                        <PrivateRoute><ExplorePage /></PrivateRoute>
                    } />
                    <Route path="/test" element={<TestPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);