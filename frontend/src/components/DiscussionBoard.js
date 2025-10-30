import React, { useState, useEffect } from 'react';

function DiscussionBoard({ projectId, user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDiscussions();
    }, [projectId]);

    const fetchDiscussions = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/discussions`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.discussions || []);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching discussions:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/discussions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    username: user.username,
                    message: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                fetchDiscussions();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to post message');
            }
        } catch (error) {
            console.error('Error posting message:', error);
            alert('Failed to post message. Please try again.');
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>Loading discussions...</div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>
                <i className="fas fa-comments"></i> Discussion Board
            </h3>

            <form onSubmit={handleSubmit} style={styles.form}>
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    style={styles.textarea}
                    rows={3}
                />
                <button type="submit" style={styles.submitBtn} disabled={!newMessage.trim()}>
                    <i className="fas fa-paper-plane"></i> Post
                </button>
            </form>

            <div style={styles.messageList}>
                {messages.length === 0 ? (
                    <p style={styles.noMessages}>No discussions yet. Be the first to comment!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} style={styles.message}>
                            <div style={styles.messageHeader}>
                                <div style={styles.avatar}>
                                    <i className="fas fa-user"></i>
                                </div>
                                <div style={styles.messageInfo}>
                                    <strong style={styles.username}>{msg.username || 'Unknown User'}</strong>
                                    <span style={styles.timestamp}>
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Just now'}
                                    </span>
                                </div>
                            </div>
                            <p style={styles.messageText}>{msg.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { 
        background: 'rgba(15, 20, 50, 0.8)', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(162, 89, 255, 0.3)', 
        borderRadius: '16px', 
        padding: '24px',
        marginTop: '20px' 
    },
    loading: { 
        textAlign: 'center', 
        opacity: 0.6, 
        padding: '20px' 
    },
    title: { 
        fontSize: '20px', 
        fontFamily: 'Orbitron, sans-serif', 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        margin: '0 0 20px 0'
    },
    form: { 
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    textarea: { 
        width: '100%', 
        background: 'rgba(11, 15, 43, 0.6)', 
        border: '2px solid rgba(162, 89, 255, 0.3)', 
        borderRadius: '8px', 
        padding: '12px', 
        color: '#EDEDED', 
        fontSize: '14px', 
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    submitBtn: { 
        background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', 
        border: 'none', 
        padding: '12px 20px', 
        borderRadius: '8px', 
        color: 'white', 
        fontWeight: 600, 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '8px',
        alignSelf: 'flex-end',
        transition: 'opacity 0.3s ease'
    },
    messageList: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px' 
    },
    noMessages: { 
        textAlign: 'center', 
        opacity: 0.6, 
        padding: '40px', 
        fontSize: '14px' 
    },
    message: { 
        background: 'rgba(162, 89, 255, 0.1)', 
        padding: '16px', 
        borderRadius: '12px', 
        border: '1px solid rgba(162, 89, 255, 0.2)' 
    },
    messageHeader: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '12px' 
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
        flexShrink: 0
    },
    messageInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px'
    },
    username: { 
        fontSize: '14px',
        display: 'block'
    },
    timestamp: { 
        fontSize: '12px', 
        opacity: 0.6
    },
    messageText: { 
        fontSize: '14px', 
        lineHeight: '1.6', 
        margin: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    }
};

export default DiscussionBoard;