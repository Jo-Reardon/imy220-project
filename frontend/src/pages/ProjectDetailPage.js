import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import DiscussionBoard from '../components/DiscussionBoard.js';
import { projects } from '../utils/api.js';

function ProjectDetailPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [project, setProject] = useState(null);
    const [checkIns, setCheckIns] = useState([]);
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchProject();
        fetchAllUsers();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const data = await projects.get(projectId);
            setProject(data.project);
            setEditData({
                name: data.project.name,
                description: data.project.description,
                type: data.project.type
            });
            
            // Fetch members details
            if (data.project.members && data.project.members.length > 0) {
                const memberPromises = data.project.members.map(async (memberId) => {
                    try {
                        const response = await fetch(`/api/users/all`);
                        const usersData = await response.json();
                        return usersData.users.find(u => u._id === memberId);
                    } catch (err) {
                        return null;
                    }
                });
                const memberData = await Promise.all(memberPromises);
                setMembers(memberData.filter(m => m !== null));
            }
            
            // Fetch check-ins
            try {
                const checkInsResponse = await fetch(`/api/projects/${projectId}/checkins`);
                const checkInsData = await checkInsResponse.json();
                setCheckIns(checkInsData.checkIns || []);
            } catch (error) {
                console.error('Error fetching check-ins:', error);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching project:', error);
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('/api/users/all');
            const data = await response.json();
            setAllUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAddMember = async (userId) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/members`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            if (response.ok) {
                setShowAddMember(false);
                fetchProject();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Remove this member from the project?')) return;

        try {
            const response = await fetch(`/api/projects/${projectId}/members/${userId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchProject();
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckout = async () => {
        try {
            await projects.checkout(projectId, user._id, user.username);
            fetchProject();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCheckin = async () => {
        const message = prompt('Enter check-in message:');
        if (!message) return;

        try {
            await projects.checkin(
                projectId,
                user._id,
                user.username,
                project.files,
                message,
                project.version
            );
            fetchProject();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleEdit = async () => {
        if (isEditing) {
            try {
                await projects.update(projectId, editData);
                setProject({ ...project, ...editData });
                setIsEditing(false);
            } catch (error) {
                alert(error.message);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await projects.delete(projectId);
            navigate('/home');
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div style={styles.loading}>Loading project...</div>;
    if (!project) return <div style={styles.loading}>Project not found</div>;

    const isOwner = user && project.ownerId === user._id;
    const isMember = user && project.members?.includes(user._id);
    const canCheckout = project.status === 'checked-in' && (isMember || isOwner);
    const canCheckin = project.status === 'checked-out' && project.checkedOutBy === user?._id;

    // Filter out users who are already members or owner
    const availableUsers = allUsers.filter(u => 
        u._id !== project.ownerId && 
        !project.members?.includes(u._id)
    );

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                {/* Left Sidebar - Project Info */}
                <aside style={styles.sidebar}>
                    <div style={styles.card}>
                        {isEditing ? (
                            <>
                                <input
                                    style={styles.input}
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                                <textarea
                                    style={styles.textarea}
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                />
                            </>
                        ) : (
                            <>
                                <h1 style={styles.projectTitle}>
                                    <i className="fas fa-cube"></i> {project.name}
                                </h1>
                                <p style={styles.description}>{project.description}</p>
                            </>
                        )}

                        <div style={styles.tags}>
                            {project.languages?.map((lang, i) => (
                                <span key={i} style={styles.tag}>
                                    <i className="fas fa-hashtag"></i>{lang}
                                </span>
                            ))}
                        </div>

                        <div style={styles.info}>
                            <p><i className="fas fa-code-branch"></i> Version: {project.version}</p>
                            <p><i className="fas fa-tag"></i> Type: {project.type}</p>
                            <p>
                                <i className={`fas fa-${project.status === 'checked-out' ? 'lock' : 'lock-open'}`}></i>
                                Status: {project.status}
                            </p>
                        </div>

                        {isOwner && (
                            <div style={styles.buttonGroup}>
                                <button style={styles.editBtn} onClick={handleEdit}>
                                    <i className={`fas fa-${isEditing ? 'save' : 'edit'}`}></i>
                                    {isEditing ? ' Save' : ' Edit'}
                                </button>
                                <button style={styles.deleteBtn} onClick={handleDelete}>
                                    <i className="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        )}

                        {canCheckout && (
                            <button style={styles.checkoutBtn} onClick={handleCheckout}>
                                <i className="fas fa-lock"></i> Check Out
                            </button>
                        )}

                        {canCheckin && (
                            <button style={styles.checkinBtn} onClick={handleCheckin}>
                                <i className="fas fa-check-circle"></i> Check In
                            </button>
                        )}
                    </div>
                </aside>

                {/* Main Content - Files & Activity */}
                <main style={styles.main}>
                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-folder-open"></i> Files
                        </h2>
                        {project.files?.length === 0 ? (
                            <p style={styles.noData}>No files yet</p>
                        ) : (
                            <div style={styles.fileList}>
                                {project.files?.map((file, i) => (
                                    <div key={i} style={styles.fileItem}>
                                        <i className="fas fa-file-code"></i>
                                        <span>{file.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <i className="fas fa-history"></i> Version History
                        </h2>
                        {checkIns.length === 0 ? (
                            <p style={styles.noData}>No check-ins yet</p>
                        ) : (
                            checkIns.map((checkIn, i) => (
                                <div key={i} style={styles.checkInItem}>
                                    <p><strong>{checkIn.username}</strong> checked in v{checkIn.version}</p>
                                    <p style={styles.message}>{checkIn.message}</p>
                                </div>
                            ))
                        )}
                    </section>

                    <DiscussionBoard projectId={projectId} user={user} />
                </main>

                {/* Right Sidebar - Members */}
                <aside style={styles.rightSidebar}>
                    <div style={styles.card}>
                        <div style={styles.membersHeader}>
                            <h3 style={styles.cardTitle}>
                                <i className="fas fa-users"></i> Members
                            </h3>
                            {isOwner && (
                                <button 
                                    style={styles.addMemberBtn}
                                    onClick={() => setShowAddMember(!showAddMember)}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            )}
                        </div>

                        {showAddMember && isOwner && (
                            <div style={styles.addMemberSection}>
                                <p style={styles.addMemberTitle}>Add Member:</p>
                                <div style={styles.userList}>
                                    {availableUsers.length === 0 ? (
                                        <p style={styles.noUsers}>No users available</p>
                                    ) : (
                                        availableUsers.map(u => (
                                            <div key={u._id} style={styles.userItem}>
                                                <span>{u.name} (@{u.username})</span>
                                                <button
                                                    style={styles.addBtn}
                                                    onClick={() => handleAddMember(u._id)}
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        <div style={styles.membersList}>
                            {members.length === 0 ? (
                                <p style={styles.noData}>No members yet</p>
                            ) : (
                                members.map(member => (
                                    <div key={member._id} style={styles.memberItem}>
                                        <div style={styles.memberAvatar}>
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div style={styles.memberInfo}>
                                            <p style={styles.memberName}>{member.name}</p>
                                            <p style={styles.memberUsername}>@{member.username}</p>
                                        </div>
                                        {isOwner && (
                                            <button
                                                style={styles.removeMemberBtn}
                                                onClick={() => handleRemoveMember(member._id)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
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
    content: { display: 'grid', gridTemplateColumns: '350px 1fr 300px', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' },
    sidebar: {},
    card: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '24px', marginBottom: '20px' },
    projectTitle: { fontSize: '28px', fontFamily: 'Orbitron, sans-serif', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' },
    description: { opacity: 0.8, marginBottom: '16px', lineHeight: '1.6' },
    tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
    tag: { background: 'rgba(255, 154, 60, 0.2)', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', border: '1px solid rgba(255, 154, 60, 0.4)', display: 'flex', alignItems: 'center', gap: '4px' },
    info: { borderTop: '1px solid rgba(162, 89, 255, 0.3)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' },
    buttonGroup: { display: 'flex', gap: '8px', marginTop: '16px' },
    editBtn: { flex: 1, background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    deleteBtn: { flex: 1, background: 'linear-gradient(135deg, #FF4B5C, #FF6B35)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' },
    checkoutBtn: { width: '100%', background: 'linear-gradient(135deg, #FF9A3C, #FF6B35)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    checkinBtn: { width: '100%', background: 'linear-gradient(135deg, #10b981, #34d399)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
    input: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', marginBottom: '12px', fontSize: '16px' },
    textarea: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', marginBottom: '12px', minHeight: '100px', fontSize: '14px' },
    main: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '24px' },
    sectionTitle: { fontSize: '20px', fontFamily: 'Orbitron, sans-serif', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
    fileList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    fileItem: { background: 'rgba(162, 89, 255, 0.1)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' },
    checkInItem: { background: 'rgba(162, 89, 255, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: '3px solid #A259FF' },
    message: { fontSize: '14px', opacity: 0.8, fontStyle: 'italic', marginTop: '8px' },
    rightSidebar: {},
    cardTitle: { fontSize: '16px', fontFamily: 'Orbitron, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 },
    membersHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    addMemberBtn: { background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    addMemberSection: { marginBottom: '16px', padding: '12px', background: 'rgba(162, 89, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(162, 89, 255, 0.3)' },
    addMemberTitle: { fontSize: '14px', fontWeight: 600, marginBottom: '8px' },
    userList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    userItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(11, 15, 43, 0.6)', borderRadius: '6px', fontSize: '12px' },
    addBtn: { background: 'transparent', border: '1px solid #0FF6FC', color: '#0FF6FC', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' },
    noUsers: { fontSize: '12px', opacity: 0.6, textAlign: 'center', padding: '8px' },
    membersList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    memberItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(162, 89, 255, 0.1)', borderRadius: '8px', border: '1px solid rgba(162, 89, 255, 0.2)' },
    memberAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0FF6FC, #A259FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
    memberInfo: { flex: 1 },
    memberName: { fontSize: '14px', fontWeight: 600, margin: 0 },
    memberUsername: { fontSize: '12px', opacity: 0.7, margin: '2px 0 0 0' },
    removeMemberBtn: { background: 'transparent', border: '1px solid #FF4B5C', color: '#FF4B5C', width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' },
    noData: { opacity: 0.6, fontSize: '14px', textAlign: 'center', padding: '20px' }
};

export default ProjectDetailPage;