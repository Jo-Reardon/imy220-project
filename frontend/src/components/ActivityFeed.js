import React from 'react';
import { Link } from 'react-router-dom';

function ActivityFeed({ activities, currentUserId }) {
    if (!activities || activities.length === 0) {
        return (
            <div style={styles.emptyState}>
                <i className="fas fa-satellite" style={styles.emptyIcon}></i>
                <h3 style={styles.emptyTitle}>No Activity Yet</h3>
                <p style={styles.emptyText}>
                    {currentUserId ? 
                        'Start by creating a project or connecting with friends!' :
                        'Loading activity feed...'
                    }
                </p>
            </div>
        );
    }

    const getActivityIcon = (action) => {
        switch (action) {
            case 'created project':
                return 'fa-plus-circle';
            case 'checked out':
                return 'fa-download';
            case 'checked in':
                return 'fa-upload';
            case 'joined project':
                return 'fa-user-plus';
            default:
                return 'fa-code';
        }
    };

    const getActivityColor = (action) => {
        switch (action) {
            case 'created project':
                return '#0FF6FC'; // cyan
            case 'checked out':
                return '#FF9A3C'; // orange
            case 'checked in':
                return '#A259FF'; // purple
            case 'joined project':
                return '#4F9FFF'; // blue
            default:
                return '#EDEDED';
        }
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const seconds = Math.floor((now - activityDate) / 1000);

        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks}w ago`;
        return activityDate.toLocaleDateString();
    };

    return (
        <div style={styles.container}>
            <div style={styles.feed}>
                {activities.map((activity, index) => (
                    <div 
                        key={activity._id || index} 
                        style={styles.activityCard}
                    >
                        {/* Left: Icon and Timeline */}
                        <div style={styles.timeline}>
                            <div 
                                style={{
                                    ...styles.icon,
                                    background: getActivityColor(activity.action)
                                }}
                            >
                                <i className={`fas ${getActivityIcon(activity.action)}`}></i>
                            </div>
                            {index < activities.length - 1 && (
                                <div style={styles.timelineLine}></div>
                            )}
                        </div>

                        {/* Center: Activity Content */}
                        <div style={styles.content}>
                            {/* Header with User Info */}
                            <div style={styles.header}>
                                <Link 
                                    to={`/profile/${activity.username}`} 
                                    style={styles.userLink}
                                >
                                    <div style={styles.avatar}>
                                        <i className="fas fa-user-astronaut"></i>
                                    </div>
                                    <div style={styles.userInfo}>
                                        <span style={styles.username}>
                                            {activity.username}
                                        </span>
                                        <span style={styles.action}>
                                            {activity.action}
                                        </span>
                                    </div>
                                </Link>
                                <span style={styles.timestamp}>
                                    <i className="fas fa-clock"></i> {getTimeAgo(activity.createdAt)}
                                </span>
                            </div>

                            {/* Project Info */}
                            <Link 
                                to={`/project/${activity.projectId}`}
                                style={styles.projectLink}
                            >
                                <div style={styles.projectInfo}>
                                    <div style={styles.projectIcon}>
                                        <i className="fas fa-folder"></i>
                                    </div>
                                    <div style={styles.projectDetails}>
                                        <h4 style={styles.projectName}>
                                            {activity.projectName}
                                        </h4>
                                        {activity.message && (
                                            <p style={styles.message}>
                                                <i className="fas fa-comment-dots"></i> "{activity.message}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            {/* Activity Stats (if available) */}
                            {(activity.downloads || activity.comments) && (
                                <div style={styles.stats}>
                                    {activity.downloads > 0 && (
                                        <span style={styles.stat}>
                                            <i className="fas fa-download"></i> {activity.downloads} downloads
                                        </span>
                                    )}
                                    {activity.comments > 0 && (
                                        <span style={styles.stat}>
                                            <i className="fas fa-comments"></i> {activity.comments} comments
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        background: 'rgba(15, 20, 50, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
    },
    feed: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0' // No gap, cards connect via timeline
    },
    activityCard: {
        display: 'flex',
        gap: '16px',
        position: 'relative',
        paddingBottom: '20px'
    },
    
    // TIMELINE STYLES
    timeline: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: '40px'
    },
    icon: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 2,
        flexShrink: 0
    },
    timelineLine: {
        width: '2px',
        flex: 1,
        background: 'linear-gradient(180deg, rgba(162, 89, 255, 0.5) 0%, rgba(162, 89, 255, 0.1) 100%)',
        marginTop: '8px',
        minHeight: '20px'
    },
    
    // CONTENT STYLES
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(11, 15, 43, 0.6)',
        border: '1px solid rgba(162, 89, 255, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        transition: 'all 0.3s ease'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        flexWrap: 'wrap'
    },
    userLink: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
        minWidth: 0
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0FF6FC, #A259FF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        color: 'white',
        flexShrink: 0
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: 0
    },
    username: {
        color: '#0FF6FC',
        fontWeight: 600,
        fontSize: '15px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    action: {
        color: '#EDEDED',
        fontSize: '13px',
        opacity: 0.8
    },
    timestamp: {
        color: '#EDEDED',
        fontSize: '12px',
        opacity: 0.6,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap'
    },
    
    // PROJECT STYLES
    projectLink: {
        textDecoration: 'none',
        color: 'inherit'
    },
    projectInfo: {
        display: 'flex',
        gap: '12px',
        padding: '12px',
        background: 'rgba(162, 89, 255, 0.1)',
        border: '1px solid rgba(162, 89, 255, 0.2)',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },
    projectIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #A259FF, #0FF6FC)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: 'white',
        flexShrink: 0
    },
    projectDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        minWidth: 0
    },
    projectName: {
        margin: 0,
        fontSize: '16px',
        fontWeight: 600,
        color: '#EDEDED',
        fontFamily: 'Orbitron, sans-serif',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    message: {
        margin: 0,
        fontSize: '13px',
        color: '#EDEDED',
        opacity: 0.8,
        fontStyle: 'italic',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '6px',
        lineHeight: 1.4
    },
    
    // STATS STYLES
    stats: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },
    stat: {
        fontSize: '12px',
        color: '#EDEDED',
        opacity: 0.7,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    
    // EMPTY STATE
    emptyState: {
        textAlign: 'center',
        padding: '80px 20px',
        background: 'rgba(15, 20, 50, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px'
    },
    emptyIcon: {
        fontSize: '64px',
        color: 'rgba(162, 89, 255, 0.3)',
        marginBottom: '20px'
    },
    emptyTitle: {
        fontSize: '24px',
        fontFamily: 'Orbitron, sans-serif',
        margin: '0 0 12px 0',
        color: '#EDEDED'
    },
    emptyText: {
        fontSize: '14px',
        opacity: 0.7,
        margin: 0
    }
};

export default ActivityFeed;