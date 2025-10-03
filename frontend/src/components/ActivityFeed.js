import React from 'react';

function ActivityFeed({ activities }) {
    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getActivityIcon = (action) => {
        if (action.includes('checked out')) return 'fa-lock';
        if (action.includes('checked in')) return 'fa-check-circle';
        if (action.includes('created')) return 'fa-plus-circle';
        return 'fa-code-branch';
    };

    return (
        <div style={styles.feed}>
            <div style={styles.header}>
                <h3 style={styles.title}>
                    <i className="fas fa-stream"></i> Activity
                </h3>
            </div>
            
            {!activities || activities.length === 0 ? (
                <p style={styles.empty}>
                    <i className="fas fa-satellite"></i> No activity yet. Start exploring!
                </p>
            ) : (
                activities.map((activity, index) => (
                    <div key={index} style={styles.activityItem}>
                        <div style={styles.activityIcon}>
                            <i className={`fas ${getActivityIcon(activity.action)}`}></i>
                        </div>
                        <div style={styles.activityContent}>
                            <p style={styles.activityText}>
                                <strong>{activity.username}</strong> {activity.action}{' '}
                                {activity.projectName && (
                                    <span style={styles.projectName}>"{activity.projectName}"</span>
                                )}
                            </p>
                            {activity.message && (
                                <p style={styles.message}>
                                    <i className="fas fa-comment"></i> {activity.message}
                                </p>
                            )}
                            <span style={styles.activityTime}>
                                <i className="far fa-clock"></i> {getTimeAgo(activity.createdAt)}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

const styles = {
    feed: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '20px' },
    header: { marginBottom: '16px' },
    title: { fontSize: '18px', fontFamily: 'Orbitron, sans-serif', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' },
    empty: { textAlign: 'center', opacity: 0.6, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    activityItem: { display: 'flex', gap: '12px', padding: '12px', borderBottom: '1px solid rgba(162, 89, 255, 0.2)', marginBottom: '12px' },
    activityIcon: { fontSize: '24px', color: '#0FF6FC' },
    activityContent: { flex: 1 },
    activityText: { margin: 0, marginBottom: '4px' },
    projectName: { color: '#0FF6FC' },
    message: { margin: '4px 0', fontSize: '14px', opacity: 0.8, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' },
    activityTime: { fontSize: '12px', opacity: 0.6, display: 'inline-flex', alignItems: 'center', gap: '4px' }
};

export default ActivityFeed;