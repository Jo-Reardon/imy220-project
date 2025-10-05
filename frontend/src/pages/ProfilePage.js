import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.js';
import ProjectCard from '../components/ProjectCard.js';
import { users, projects } from '../utils/api.js';

function ProfilePage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchProfile();
    }, [username]);

    const fetchProfile = async () => {
        try {
            const data = await users.getProfile(username);
            setProfile(data.user);
            setEditData({
                name: data.user.name,
                bio: data.user.bio,
            });
            
            const allProjects = await projects.getFeatured();
            const filtered = allProjects.filter(p => p.ownerId === data.user._id);
            setUserProjects(filtered);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (isEditing) {
            try {
                await users.updateProfile(profile._id, editData);
                setProfile({ ...profile, ...editData });
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        } else {
            setIsEditing(true);
        }
    };

    if (loading) return <div style={styles.loading}>Loading profile...</div>;
    if (!profile) return <div style={styles.loading}>Profile not found</div>;

    const isOwnProfile = user && user._id === profile._id;
    const createdDate = new Date(profile.createdAt).toLocaleDateString();

    return (
        <div style={styles.container}>
            <Header user={user} />
            
            <div style={styles.content}>
                <aside style={styles.profileCard}>
                    <div style={styles.avatarContainer}>
                        <div style={styles.avatar}>
                            <i className="fas fa-user-astronaut" style={{fontSize: '48px'}}></i>
                        </div>
                    </div>
                    
                    {isEditing ? (
                        <>
                            <input
                                style={styles.input}
                                value={editData.name}
                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                                placeholder="Name"
                            />
                            <textarea
                                style={styles.textarea}
                                value={editData.bio}
                                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                placeholder="Bio"
                            />
                        </>
                    ) : (
                        <>
                            <h2 style={styles.name}>{profile.name}</h2>
                            <p style={styles.username}>@{profile.username}</p>
                            <p style={styles.bio}>"{profile.bio || 'No bio yet'}"</p>
                        </>
                    )}
                    
                    {isOwnProfile && (
                        <button style={styles.editBtn} onClick={handleEdit}>
                            <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'}`}></i>
                            {isEditing ? ' Save Profile' : ' Edit Profile'}
                        </button>
                    )}
                    
                    <div style={styles.stats}>
                        <h3 style={styles.statsTitle}>
                            <i className="fas fa-chart-bar"></i> STATS
                        </h3>
                        <p style={styles.statItem}>
                            <i className="fas fa-diagram-project"></i> Projects - {userProjects.length}
                        </p>
                        <p style={styles.statItem}>
                            <i className="fas fa-user-friends"></i> Friends - {profile.friends?.length || 0}
                        </p>
                        <p style={styles.statItem}>
                            <i className="fas fa-calendar-alt"></i> Member since - {createdDate}
                        </p>
                    </div>
                </aside>

                <main style={styles.main}>
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-folder-open"></i>
                            {isOwnProfile ? ' Your Projects' : ` ${profile.name}'s Projects`}
                        </h2>
                        {userProjects.length === 0 ? (
                            <p style={styles.noData}>
                                <i className="fas fa-inbox"></i> No projects yet
                            </p>
                        ) : (
                            <div style={styles.projectGrid}>
                                {userProjects.map(project => (
                                    <ProjectCard key={project._id} project={project} />
                                ))}
                            </div>
                        )}
                    </section>
                </main>

                <aside style={styles.rightSidebar}>
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-info-circle"></i> Profile Info
                        </h3>
                        <div style={styles.highlights}>
                            <p style={styles.highlight}>
                                <i className="fas fa-envelope"></i> {profile.email}
                            </p>
                            <p style={styles.highlight}>
                                <i className="fas fa-calendar-plus"></i> Joined {createdDate}
                            </p>
                            <p style={styles.highlight}>
                                <i className="fas fa-cubes"></i> {userProjects.length} Projects
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    loading: { color: '#fff', textAlign: 'center', marginTop: '100px', fontSize: '20px' },
    content: { display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto' },
    profileCard: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '24px', textAlign: 'center', height: 'fit-content' },
    avatarContainer: { marginBottom: '16px' },
    avatar: { width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '4px solid rgba(162, 89, 255, 0.3)', color: 'white' },
    name: { fontSize: '24px', margin: '8px 0', fontFamily: 'Orbitron, sans-serif' },
    username: { opacity: 0.7, marginBottom: '12px' },
    bio: { fontStyle: 'italic', opacity: 0.8, marginBottom: '16px', fontSize: '14px' },
    input: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', marginBottom: '12px' },
    textarea: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', marginBottom: '12px', minHeight: '80px' },
    editBtn: { width: '100%', background: 'linear-gradient(135deg, #FF6B9D, #C084FC)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', marginBottom: '20px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    stats: { borderTop: '1px solid rgba(162, 89, 255, 0.3)', paddingTop: '16px' },
    statsTitle: { fontSize: '14px', marginBottom: '12px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    statItem: { margin: '8px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
    main: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '24px' },
    sectionTitle: { fontSize: '22px', marginBottom: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' },
    projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' },
    noData: { opacity: 0.6, textAlign: 'center', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    rightSidebar: { height: 'fit-content' },
    widget: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px' },
    widgetTitle: { fontSize: '16px', marginBottom: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' },
    highlights: { display: 'flex', flexDirection: 'column', gap: '12px' },
    highlight: { fontSize: '14px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }
};

export default ProfilePage;