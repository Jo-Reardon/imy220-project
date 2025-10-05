import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FriendsList({ userId }) {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) fetchFriends();
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const res = await fetch(`/api/users/${userId}/friends`);
            const data = await res.json();
            setFriends(data.friends || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setFriends([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = (username) => {
        if (username) navigate(`/profile/${username}`);
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div style={styles.widget}>
                <h3 style={styles.widgetTitle}><i className="fas fa-users"></i> Your Crew</h3>
                <p style={styles.loading}>Loading friends...</p>
            </div>
        );
    }

    return (
        <div style={styles.widget}>
            <h3 style={styles.widgetTitle}>
                <i className="fas fa-users"></i> Your Crew
                <span style={styles.count}>{friends.length}</span>
            </h3>

            {friends.length === 0 ? (
                <div style={styles.emptyState}>
                    <i className="fas fa-user-friends" style={styles.emptyIcon}></i>
                    <p style={styles.emptyText}>No friends yet</p>
                    <p style={styles.emptySubtext}>Connect with other developers!</p>
                </div>
            ) : (
                <div style={styles.friendsList}>
                    {friends.map(friend => (
                        <div key={friend._id} style={styles.friendItem} onClick={() => handleProfileClick(friend.username)}>
                            <div style={styles.friendAvatar}>
                                {friend.profileImage ? (
                                    <img src={friend.profileImage} alt={friend.name} style={styles.avatarImage} />
                                ) : (
                                    <span style={styles.initials}>{getInitials(friend.name)}</span>
                                )}
                            </div>
                            <div style={styles.friendInfo}>
                                <div style={styles.friendName}>{friend.name || 'Unknown'}</div>
                                <div style={styles.friendUsername}>@{friend.username || 'unknown'}</div>
                            </div>
                            <i className="fas fa-chevron-right" style={styles.chevron}></i>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = { 
    widget: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px' },
    widgetTitle: { fontSize: '16px', marginBottom: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', color: '#EDEDED' },
    count: { background: 'rgba(162, 89, 255, 0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, marginLeft: 'auto', border: '1px solid rgba(162, 89, 255, 0.4)' },
    loading: { opacity: 0.6, fontSize: '14px', textAlign: 'center', padding: '20px', color: '#EDEDED' },
    emptyState: { textAlign: 'center', padding: '30px 20px', color: '#EDEDED' },
    emptyIcon: { fontSize: '48px', opacity: 0.3, marginBottom: '12px', color: '#A259FF' },
    emptyText: { fontSize: '14px', opacity: 0.7, margin: '8px 0' },
    emptySubtext: { fontSize: '12px', opacity: 0.5, margin: 0 },
    friendsList: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' },
    friendItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(162, 89, 255, 0.1)', border: '1px solid rgba(162, 89, 255, 0.2)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s ease' },
    friendAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(162, 89, 255, 0.3)', flexShrink: 0, overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
    initials: { color: 'white', fontSize: '14px', fontWeight: 700, fontFamily: 'Orbitron, sans-serif' },
    friendInfo: { flex: 1, minWidth: 0 },
    friendName: { fontSize: '14px', fontWeight: 600, color: '#EDEDED', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    friendUsername: { fontSize: '12px', opacity: 0.6, color: '#EDEDED', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    chevron: { fontSize: '12px', opacity: 0.4, color: '#EDEDED', transition: 'opacity 0.3s ease' }
};

export default FriendsList;
