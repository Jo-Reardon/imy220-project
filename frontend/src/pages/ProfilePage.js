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
    const [savedProjects, setSavedProjects] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isFriend, setIsFriend] = useState(false);
    const [hasSentRequest, setHasSentRequest] = useState(false);
    const [activeTab, setActiveTab] = useState('created'); // 'created' or 'saved'
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

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
            setAvatarPreview(data.user.avatar || null);
            
            // Fetch user's created projects
            const allProjects = await projects.getFeatured();
            const filtered = allProjects.filter(p => p.ownerId === data.user._id);
            setUserProjects(filtered);

            // Fetch saved projects
            if (data.user.savedProjects && data.user.savedProjects.length > 0) {
                const saved = allProjects.filter(p => data.user.savedProjects.includes(p._id));
                setSavedProjects(saved);
            }

            // Fetch friends list
            if (data.user.friends && data.user.friends.length > 0) {
                const friendsData = await users.getFriends(data.user._id);
                setFriends(friendsData.friends || []);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && profile) {
            setIsFriend(user.friends?.includes(profile._id) || false);
            setHasSentRequest(profile.friendRequests?.includes(user._id) || false);
        }
    }, [user, profile]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            await users.sendFriendRequest(user._id, profile._id);
            setHasSentRequest(true);
            alert('Friend request sent!');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleUnfriend = async () => {
        if (!window.confirm('Are you sure you want to unfriend this user?')) return;
        
        try {
            await users.unfriend(user._id, profile._id);
            setIsFriend(false);
            fetchProfile();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEdit = async () => {
        if (isEditing) {
            try {
                const updateData = { ...editData };
                if (avatarPreview) {
                    updateData.avatar = avatarPreview;
                }
                await users.updateProfile(profile._id, updateData);
                setProfile({ ...profile, ...updateData });
                setIsEditing(false);
                setAvatarFile(null);
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile');
            }
        } else {
            setIsEditing(true);
        }
    };

    if (loading) return <div style={styles.loading}>Loading profile...</div>;
    if (!profile) return <div style={styles.loading}>Profile not found</div>;

    const isOwnProfile = user && user._id === profile._id;
    const canViewFullProfile = isOwnProfile || isFriend;
    const createdDate = new Date(profile.createdAt).toLocaleDateString();

    return (
        <div style={styles.container}>
            <Header user={user} />
            
            <div style={styles.content}>
                <aside style={styles.profileCard}>
                    <div style={styles.avatarContainer}>
                        <div style={styles.avatar}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Profile" style={styles.avatarImage} />
                            ) : (
                                <i className="fas fa-user-astronaut" style={{fontSize: '48px'}}></i>
                            )}
                        </div>
                        {isEditing && (
                            <label style={styles.uploadLabel}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    style={styles.fileInput}
                                />
                                <i className="fas fa-camera"></i> Change Photo
                            </label>
                        )}
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

                    {!isOwnProfile && (
                        <div style={styles.friendActions}>
                            {isFriend ? (
                                <button style={styles.unfriendBtn} onClick={handleUnfriend}>
                                    <i className="fas fa-user-minus"></i> Unfriend
                                </button>
                            ) : hasSentRequest ? (
                                <button style={styles.pendingBtn} disabled>
                                    <i className="fas fa-clock"></i> Request Sent
                                </button>
                            ) : (
                                <button style={styles.addFriendBtn} onClick={handleSendFriendRequest}>
                                    <i className="fas fa-user-plus"></i> Add Friend
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div style={styles.stats}>
                        <h3 style={styles.statsTitle}>
                            <i className="fas fa-chart-bar"></i> STATS
                        </h3>
                        <p style={styles.statItem}>
                            <i className="fas fa-diagram-project"></i> Projects - {userProjects.length}
                        </p>
                        <p style={styles.statItem}>
                            <i className="fas fa-bookmark"></i> Saved - {savedProjects.length}
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
                    {/* Projects Section with Tabs */}
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>
                                <i className="fas fa-folder-open"></i>
                                {isOwnProfile ? ' Your Projects' : ` ${profile.name}'s Projects`}
                            </h2>
                            <div style={styles.tabs}>
                                <button 
                                    style={activeTab === 'created' ? styles.tabActive : styles.tab}
                                    onClick={() => setActiveTab('created')}
                                >
                                    <i className="fas fa-cube"></i> Created ({userProjects.length})
                                </button>
                                <button 
                                    style={activeTab === 'saved' ? styles.tabActive : styles.tab}
                                    onClick={() => setActiveTab('saved')}
                                >
                                    <i className="fas fa-bookmark"></i> Saved ({savedProjects.length})
                                </button>
                            </div>
                        </div>

                        {activeTab === 'created' ? (
                            userProjects.length === 0 ? (
                                <p style={styles.noData}>
                                    <i className="fas fa-inbox"></i> No created projects yet
                                </p>
                            ) : (
                                <div style={styles.projectGrid}>
                                    {userProjects.map(project => (
                                        <ProjectCard key={project._id} project={project} />
                                    ))}
                                </div>
                            )
                        ) : (
                            savedProjects.length === 0 ? (
                                <p style={styles.noData}>
                                    <i className="fas fa-inbox"></i> No saved projects yet
                                </p>
                            ) : (
                                <div style={styles.projectGrid}>
                                    {savedProjects.map(project => (
                                        <ProjectCard key={project._id} project={project} />
                                    ))}
                                </div>
                            )
                        )}
                    </section>

                    {/* Friends List - Only show on own profile */}
                    {isOwnProfile && (
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                <i className="fas fa-user-friends"></i> Your Friends ({friends.length})
                            </h2>
                            {friends.length === 0 ? (
                                <p style={styles.noData}>
                                    <i className="fas fa-inbox"></i> No friends yet
                                </p>
                            ) : (
                                <div style={styles.friendsGrid}>
                                    {friends.map(friend => (
                                        <div key={friend._id} style={styles.friendCard}>
                                            <div style={styles.friendAvatar}>
                                                {friend.avatar ? (
                                                    <img src={friend.avatar} alt={friend.name} style={styles.avatarImage} />
                                                ) : (
                                                    <i className="fas fa-user-astronaut"></i>
                                                )}
                                            </div>
                                            <div style={styles.friendInfo}>
                                                <h4 style={styles.friendName}>{friend.name}</h4>
                                                <p style={styles.friendUsername}>@{friend.username}</p>
                                            </div>
                                            <button 
                                                style={styles.viewProfileBtn}
                                                onClick={() => window.location.href = `/profile/${friend.username}`}
                                            >
                                                View <i className="fas fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Friends List Preview - Show to friends viewing profile */}
                    {!isOwnProfile && canViewFullProfile && (
                        <section style={styles.section}>
                            <h2 style={styles.sectionTitle}>
                                <i className="fas fa-user-friends"></i> {profile.name}'s Friends ({friends.length})
                            </h2>
                            {friends.length === 0 ? (
                                <p style={styles.noData}>
                                    <i className="fas fa-inbox"></i> No friends yet
                                </p>
                            ) : (
                                <div style={styles.friendsGrid}>
                                    {friends.map(friend => (
                                        <div key={friend._id} style={styles.friendCard}>
                                            <div style={styles.friendAvatar}>
                                                {friend.avatar ? (
                                                    <img src={friend.avatar} alt={friend.name} style={styles.avatarImage} />
                                                ) : (
                                                    <i className="fas fa-user-astronaut"></i>
                                                )}
                                            </div>
                                            <div style={styles.friendInfo}>
                                                <h4 style={styles.friendName}>{friend.name}</h4>
                                                <p style={styles.friendUsername}>@{friend.username}</p>
                                            </div>
                                            <button 
                                                style={styles.viewProfileBtn}
                                                onClick={() => window.location.href = `/profile/${friend.username}`}
                                            >
                                                View <i className="fas fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </main>

                <aside style={styles.rightSidebar}>
                    <div style={styles.widget}>
                        <h3 style={styles.widgetTitle}>
                            <i className="fas fa-info-circle"></i> Profile Info
                        </h3>
                        <div style={styles.highlights}>
                            {/* Email only shows to self or friends */}
                            {canViewFullProfile && (
                                <p style={styles.highlight}>
                                    <i className="fas fa-envelope"></i> {profile.email}
                                </p>
                            )}
                            <p style={styles.highlight}>
                                <i className="fas fa-calendar-plus"></i> Joined {createdDate}
                            </p>
                            <p style={styles.highlight}>
                                <i className="fas fa-cubes"></i> {userProjects.length} Created Projects
                            </p>
                            <p style={styles.highlight}>
                                <i className="fas fa-bookmark"></i> {savedProjects.length} Saved Projects
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
    avatar: { width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '4px solid rgba(162, 89, 255, 0.3)', color: 'white', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
    uploadLabel: { display: 'inline-block', marginTop: '12px', padding: '8px 16px', background: 'rgba(15, 246, 252, 0.2)', border: '1px solid #0FF6FC', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#0FF6FC', transition: 'all 0.3s ease' },
    fileInput: { display: 'none' },
    name: { fontSize: '24px', margin: '8px 0', fontFamily: 'Orbitron, sans-serif' },
    username: { opacity: 0.7, marginBottom: '12px' },
    bio: { fontStyle: 'italic', opacity: 0.8, marginBottom: '16px', fontSize: '14px' },
    input: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', marginBottom: '12px' },
    textarea: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', marginBottom: '12px', minHeight: '80px', resize: 'vertical' },
    editBtn: { width: '100%', background: 'linear-gradient(135deg, #FF6B9D, #C084FC)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', marginBottom: '20px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    stats: { borderTop: '1px solid rgba(162, 89, 255, 0.3)', paddingTop: '16px' },
    statsTitle: { fontSize: '14px', marginBottom: '12px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    statItem: { margin: '8px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
    main: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '24px' },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
    sectionTitle: { fontSize: '22px', margin: 0, fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' },
    tabs: { display: 'flex', gap: '8px' },
    tab: { background: 'transparent', border: '1px solid rgba(162, 89, 255, 0.3)', padding: '8px 16px', borderRadius: '8px', color: '#EDEDED', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease' },
    tabActive: { background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', border: '1px solid transparent', padding: '8px 16px', borderRadius: '8px', color: 'white', cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 },
    projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' },
    friendsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' },
    friendCard: { background: 'rgba(11, 15, 43, 0.6)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease' },
    friendAvatar: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', overflow: 'hidden' },
    friendInfo: { textAlign: 'center', flex: 1 },
    friendName: { fontSize: '16px', margin: '0 0 4px 0', fontFamily: 'Orbitron, sans-serif' },
    friendUsername: { fontSize: '12px', opacity: 0.7, margin: 0 },
    viewProfileBtn: { background: 'transparent', border: '1px solid #0FF6FC', padding: '6px 12px', borderRadius: '6px', color: '#0FF6FC', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease' },
    noData: { opacity: 0.6, textAlign: 'center', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    rightSidebar: { height: 'fit-content' },
    widget: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px' },
    widgetTitle: { fontSize: '16px', marginBottom: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' },
    highlights: { display: 'flex', flexDirection: 'column', gap: '12px' },
    highlight: { fontSize: '14px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' },
    friendActions: { marginBottom: '20px' },
    addFriendBtn: { width: '100%', background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    unfriendBtn: { width: '100%', background: 'transparent', border: '2px solid #FF4B5C', padding: '12px', borderRadius: '8px', color: '#FF4B5C', fontWeight: 600, cursor: 'pointer', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    pendingBtn: { width: '100%', background: 'rgba(255, 154, 60, 0.2)', border: '2px solid rgba(255, 154, 60, 0.5)', padding: '12px', borderRadius: '8px', color: '#FF9A3C', fontWeight: 600, cursor: 'not-allowed', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};

export default ProfilePage;