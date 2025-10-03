import React, { useEffect, useState } from 'react';
import Header from '../components/Header.js';
import ActivityFeed from '../components/ActivityFeed.js';
import ProjectCard from '../components/ProjectCard.js';
import { activity, projects } from '../utils/api.js';

function HomePage() {
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [projectsList, setProjectsList] = useState([]);
    const [feedType, setFeedType] = useState('local');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchActivities();
        fetchProjects();
    }, [feedType]);

    const fetchActivities = async () => {
        const data = await activity.getFeed(feedType, user?._id);
        setActivities(data);
    };

    const fetchProjects = async () => {
        const data = await projects.getFeatured();
        setProjectsList(data);
    };

    return (
        <div>
            <Header user={user} />
            <ActivityFeed activities={activities} />
            {projectsList.map(p => <ProjectCard key={p._id} project={p} />)}
        </div>
    );
}

export default HomePage;
