import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import { users } from '../utils/api.js';

function FriendsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            fetchFriendsData(parsedUser);
        }
    }, []);

    const fetchFriendsData = async (userData) => {
        try {
            // Get all users
            const allUsersResponse = await fetch('/api/users/all');
            const allUsersData = await allUsersResponse.json();
            const allUsers = allUsersData.users || [];

            // Get current user's full profile
            const profileResponse = await users.getProfile(userData.username);
            const profile = profileResponse.user;

            console.log('=== DEBUG: Friends Page ===');
            console.log('Current user:', userData.username);
            console.log('Profile friends array:', profile.friends);
            console.log('Profile friend requests array:', profile.friendRequests);
            console.log('Total users in DB:', allUsers.length);

            // Match friends
            if (profile.friends && profile.friends.length > 0) {
                const friendsList = [];
                
                for (const friendId of profile.friends) {
                    // Try to match by _id (as string or ObjectId)
                    const friend = allUsers.find(u => 
                        u._id === friendId || 
                        u._id.toString() === friendId ||
                        u._id === friendId.toString()
                    );
                    
                    if (friend) {
                        friendsList.push(friend);
                        console.log('Found friend:', friend.username);
                    } else {
                        console.log('Could not find friend with ID:', friendId);
                    }
                }
                
                setFriends(friendsList);
                console.log('Total friends matched:', friendsList.length);
            } else {
                setFriends([]);
                console.log('No friends in profile');
            }

            // Match friend requests
            if (profile.friendRequests && profile.friendRequests.length > 0) {
                const requestsList = [];
                
                for (const requesterId of profile.friendRequests) {
                    // Try to match by _id (as string or ObjectId)
                    const requester = allUsers.find(u => 
                        u._id === requesterId || 
                        u._id.toString() === requesterId ||
                        u._id === requesterId.toString()
                    );
                    
                    if (requester) {
                        requestsList.push(requester);
                        console.log('Found requester:', requester.username);
                    } else {
                        console.log('Could not find requester with ID:', requesterId);
                    }
                }
                
                setFriendRequests(requestsList);
                console.log('Total friend requests matched:', requestsList.length);
            } else {
                setFriendRequests([]);
                console.log('No friend requests in profile');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requesterId) => {
        try {
            console.log('Accepting friend request from:', requesterId);
            await users.acceptFriend(user._id, requesterId);
            
            // Refresh the page data
            const userData = JSON.parse(localStorage.getItem('user'));
            fetchFriendsData(userData);
            
            alert('Friend request accepted!');
        } catch (error) {
            console.error('Accept friend error:', error);
            alert(error.message || 'Failed to accept friend request');
        }
    };

    const handleDeclineRequest = async (requesterId) => {
        if (!window.confirm('Decline this friend request?')) return;

        try {
            console.log('Declining friend request from:', requesterId);
            
            // Remove the request from the user's friendRequests array
            const response = await fetch(`/api/users/${user._id}/friend-requests/${requesterId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh the page data
                const userData = JSON.parse(localStorage.getItem('user'));
                fetchFriendsData(userData);
                alert('Friend request declined');
            } else {
                throw new Error('Failed to decline request');
            }
        } catch (error) {
            console.error('Decline friend error:', error);
            alert(error.message || 'Failed to decline friend request');
        }
    };

    const handleUnfriend = async (friendId) => {
        if (!window.confirm('Are you sure you want to unfriend this user?')) return;

        try {
            console.log('Unfriending user:', friendId);
            await users.unfriend(user._id, friendId);
            
            // Refresh the page data
            const userData = JSON.parse(localStorage.getItem('user'));
            fetchFriendsData(userData);
            
            alert('Friend removed');
        } catch (error) {
            console.error('Unfriend error:', error);
            alert(error.message || 'Failed to unfriend');
        }
    };

    const handleViewProfile = (username) => {
        navigate(`/profile/${username}`);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Header user={user} />
                <div style={styles.loading}>
                    <i className="fas fa-spinner fa-spin"></i> Loading your crew...
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                <div style={styles.pageHeader}>
                    <h1 style={styles.title}>
                        <i className="fas fa-users"></i> Your Crew
                    </h1>
                    <p style={styles.subtitle}>
                        {friends.length} friends • {friendRequests.length} pending requests
                    </p>
                </div>

                {/* Friend Requests Section */}
                {friendRequests.length > 0 && (
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>
                                <i className="fas fa-user-clock"></i> Pending Friend Requests
                            </h2>
                            <span style={styles.badge}>{friendRequests.length}</span>
                        </div>
                        <div style={styles.grid}>
                            {friendRequests.map(requester => (
                                <div key={requester._id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.avatar}>
                                            <i className="fas fa-user-astronaut"></i>
                                        </div>
                                        <span style={styles.statusBadge}>
                                            <i className="fas fa-clock"></i> Pending
                                        </span>
                                    </div>
                                    <h3 style={styles.cardName}>{requester.name || requester.username}</h3>
                                    <p style={styles.cardUsername}>@{requester.username}</p>
                                    <p style={styles.cardBio}>{requester.bio || 'No bio available'}</p>
                                    <div style={styles.buttonGroup}>
                                        <button
                                            style={styles.acceptBtn}
                                            onClick={() => handleAcceptRequest(requester._id)}
                                        >
                                            <i className="fas fa-check"></i> Accept
                                        </button>
                                        <button
                                            style={styles.declineBtn}
                                            onClick={() => handleDeclineRequest(requester._id)}
                                        >
                                            <i className="fas fa-times"></i> Decline
                                        </button>
                                    </div>
                                    <button
                                        style={styles.viewProfileBtn}
                                        onClick={() => handleViewProfile(requester.username)}
                                    >
                                        <i className="fas fa-eye"></i> View Profile
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Friends List Section */}
                <section style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-user-friends"></i> Your Friends
                        </h2>
                        <span style={styles.badge}>{friends.length}</span>
                    </div>
                    
                    {friends.length === 0 ? (
                        <div style={styles.empty}>
                            <div style={styles.emptyIcon}>
                                <i className="fas fa-users-slash"></i>
                            </div>
                            <h3 style={styles.emptyTitle}>No Friends Yet</h3>
                            <p style={styles.emptyText}>
                                Connect with other developers in the CodeVerse!
                            </p>
                            <button
                                style={styles.searchBtn}
                                onClick={() => navigate('/search')}
                            >
                                <i className="fas fa-search"></i> Find Users
                            </button>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {friends.map(friend => (
                                <div key={friend._id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <div style={styles.avatar}>
                                            <i className="fas fa-user-astronaut"></i>
                                        </div>
                                        <span style={styles.friendBadge}>
                                            <i className="fas fa-check-circle"></i> Friend
                                        </span>
                                    </div>
                                    <h3 style={styles.cardName}>{friend.name || friend.username}</h3>
                                    <p style={styles.cardUsername}>@{friend.username}</p>
                                    <p style={styles.cardBio}>{friend.bio || 'No bio available'}</p>
                                    <div style={styles.buttonGroup}>
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() => handleViewProfile(friend.username)}
                                        >
                                            <i className="fas fa-eye"></i> View Profile
                                        </button>
                                        <button
                                            style={styles.unfriendBtn}
                                            onClick={() => handleUnfriend(friend._id)}
                                        >
                                            <i className="fas fa-user-times"></i> Unfriend
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <section style={styles.quickActions}>
                    <h3 style={styles.quickActionsTitle}>
                        <i className="fas fa-bolt"></i> Quick Actions
                    </h3>
                    <div style={styles.actionButtons}>
                        <button style={styles.actionBtn} onClick={() => navigate('/search?type=users')}>
                            <i className="fas fa-user-plus"></i>
                            <span>Find New Friends</span>
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate('/explore')}>
                            <i className="fas fa-project-diagram"></i>
                            <span>Browse Projects</span>
                        </button>
                        <button style={styles.actionBtn} onClick={() => navigate('/home')}>
                            <i className="fas fa-home"></i>
                            <span>Back to Home</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    loading: { 
        color: '#fff', 
        textAlign: 'center', 
        marginTop: '100px', 
        fontSize: '20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '12px' 
    },
    content: { maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
    pageHeader: { marginBottom: '40px' },
    title: { 
        fontSize: '36px', 
        fontFamily: 'Orbitron, sans-serif', 
        marginBottom: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        margin: '0 0 8px 0'
    },
    subtitle: { 
        fontSize: '16px', 
        opacity: 0.7,
        margin: 0
    },
    section: { marginBottom: '48px' },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
    },
    sectionTitle: { 
        fontSize: '24px', 
        fontFamily: 'Orbitron, sans-serif', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        margin: 0
    },
    badge: {
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 600
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px' 
    },
    card: { 
        background: 'rgba(15, 20, 50, 0.8)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(162, 89, 255, 0.3)', 
        borderRadius: '16px', 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        transition: 'all 0.3s ease',
        position: 'relative'
    },
    cardHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
    },
    avatar: { 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '36px',
        color: 'white',
        flexShrink: 0
    },
    statusBadge: {
        background: 'rgba(255, 154, 60, 0.2)',
        border: '1px solid rgba(255, 154, 60, 0.5)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#FF9A3C',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    friendBadge: {
        background: 'rgba(16, 185, 129, 0.2)',
        border: '1px solid rgba(16, 185, 129, 0.5)',
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        color: '#10b981',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    cardName: { 
        fontSize: '20px', 
        margin: '8px 0', 
        fontFamily: 'Orbitron, sans-serif',
        textAlign: 'center'
    },
    cardUsername: { 
        opacity: 0.7, 
        margin: '0 0 12px 0', 
        fontSize: '14px',
        textAlign: 'center'
    },
    cardBio: { 
        opacity: 0.8, 
        fontSize: '14px', 
        marginBottom: '20px', 
        minHeight: '42px',
        textAlign: 'center',
        lineHeight: '1.5'
    },
    buttonGroup: { 
        display: 'flex', 
        gap: '8px', 
        width: '100%',
        marginBottom: '8px'
    },
    acceptBtn: { 
        flex: 1, 
        background: 'linear-gradient(135deg, #10b981, #34d399)', 
        border: 'none', 
        padding: '12px', 
        borderRadius: '8px', 
        color: 'white', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '6px',
        transition: 'all 0.3s ease'
    },
    declineBtn: {
        flex: 1,
        background: 'transparent',
        border: '2px solid rgba(255, 75, 92, 0.5)',
        padding: '12px',
        borderRadius: '8px',
        color: '#FF4B5C',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        transition: 'all 0.3s ease'
    },
    viewBtn: { 
        flex: 1, 
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', 
        border: 'none', 
        padding: '12px', 
        borderRadius: '8px', 
        color: 'white', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '6px',
        transition: 'all 0.3s ease'
    },
    unfriendBtn: { 
        flex: 1, 
        background: 'transparent', 
        border: '2px solid rgba(255, 75, 92, 0.5)', 
        padding: '12px', 
        borderRadius: '8px', 
        color: '#FF4B5C', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '6px',
        transition: 'all 0.3s ease'
    },
    viewProfileBtn: {
        width: '100%',
        background: 'transparent',
        border: '1px solid rgba(162, 89, 255, 0.5)',
        padding: '10px',
        borderRadius: '8px',
        color: '#A259FF',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '14px',
        transition: 'all 0.3s ease'
    },
    empty: { 
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '80px 40px',
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px' 
    },
    emptyIcon: {
        fontSize: '64px',
        opacity: 0.3
    },
    emptyTitle: {
        fontSize: '24px',
        fontFamily: 'Orbitron, sans-serif',
        margin: 0
    },
    emptyText: {
        fontSize: '16px',
        opacity: 0.7,
        margin: 0,
        maxWidth: '400px'
    },
    searchBtn: { 
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', 
        border: 'none', 
        padding: '14px 28px', 
        borderRadius: '8px', 
        color: 'white', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '16px'
    },
    quickActions: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
    },
    quickActionsTitle: {
        fontSize: '18px',
        fontFamily: 'Orbitron, sans-serif',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        margin: '0 0 16px 0'
    },
    actionButtons: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
    },
    actionBtn: {
        background: 'rgba(162, 89, 255, 0.1)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        padding: '16px',
        borderRadius: '8px',
        color: '#EDEDED',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        fontSize: '14px'
    }
};

export default FriendsPage;