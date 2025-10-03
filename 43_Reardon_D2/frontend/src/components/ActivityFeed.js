import React from 'react';

function ActivityFeed({ activities }) {
    return (
        <div style={styles.feed}>
            <div style={styles.header}>
                <h3 style={styles.title}>Activity</h3>
                <button style={styles.collapseBtn}>—</button>
            </div>
            
            {activities.length === 0 ? (
                <p style={styles.empty}>No activity yet. Start exploring!</p>
            ) : (
                activities.map((activity, index) => (
                    <div key={index} style={styles.activityItem}>
                        <div style={styles.activityIcon}>🛠️</div>
                        <div style={styles.activityContent}>
                            <p style={styles.activityText}>
                                <strong>{activity.user}</strong> {activity.action} in{' '}
                                <span style={styles.projectName}>"{activity.project}"</span>
                            </p>
                            <span style={styles.activityTime}>{activity.time}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

const styles = {
    feed: {
        background: 'rgba(15, 20, 50, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(162, 89, 255, 0.3)',
        borderRadius: '16px',
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    title: {
        fontSize: '18px',
        fontFamily: 'Orbitron, sans-serif'
    },
    collapseBtn: {
        background: 'transparent',
        border: 'none',
        color: '#EDEDED',
        fontSize: '20px',
        cursor: 'pointer'
    },
    empty: {
        textAlign: 'center',
        opacity: 0.6,
        padding: '20px'
    },
    activityItem: {
        display: 'flex',
        gap: '12px',
        padding: '12px',
        borderBottom: '1px solid rgba(162, 89, 255, 0.2)',
        marginBottom: '12px'
    },
    activityIcon: {
        fontSize: '24px'
    },
    activityContent: {
        flex: 1
    },
    activityText: {
        margin: 0,
        marginBottom: '4px'
    },
    projectName: {
        color: '#0FF6FC'
    },
    activityTime: {
        fontSize: '12px',
        opacity: 0.6
    }
};

export default ActivityFeed;