import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.js';
import ProjectCard from '../components/ProjectCard.js';
import { users, projects } from '../utils/api.js';

function ProfilePage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [projectsList, setProjectsList] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        const data = await users.getProfile(username);
        setProfile(data.user);
        setProjectsList(data.projects || []);
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <Header user={user} />
            <h2>{profile.username}</h2>
            {projectsList.map(p => <ProjectCard key={p._id} project={p} />)}
        </div>
    );
}

export default ProfilePage;
