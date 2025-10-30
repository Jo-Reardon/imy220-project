import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import { projects } from '../utils/api.js';

function ProjectDetailPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [project, setProject] = useState(null);
    const [checkIns, setCheckIns] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
        fetchProject();
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
    const canCheckout = project.status === 'checked-in' && isMember;
    const canCheckin = project.status === 'checked-out' && project.checkedOutBy === user?._id;

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
                                        <button style={styles.downloadBtn}>
                                            <i className="fas fa-download"></i>
                                        </button>
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
                </main>

                {/* Right Sidebar - Members & Discussion */}
                <aside style={styles.rightSidebar}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <i className="fas fa-users"></i> Members
                        </h3>
                        <p style={styles.noData}>{project.members?.length || 0} members</p>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            <i className="fas fa-comments"></i> Discussion
                        </h3>
                        <p style={styles.noData}>No discussions yet</p>
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
    downloadBtn: { marginLeft: 'auto', background: 'transparent', border: '1px solid #0FF6FC', color: '#0FF6FC', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
    checkInItem: { background: 'rgba(162, 89, 255, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: '3px solid #A259FF' },
    message: { fontSize: '14px', opacity: 0.8, fontStyle: 'italic', marginTop: '8px' },
    rightSidebar: {},
    cardTitle: { fontSize: '16px', fontFamily: 'Orbitron, sans-serif', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    noData: { opacity: 0.6, fontSize: '14px', textAlign: 'center', padding: '20px' }
};

export default ProjectDetailPage;