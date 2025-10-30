import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import { projects } from '../utils/api.js';

function CreateProjectPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Web Application',
        languages: '',
        version: '1.0.0',
        files: []
    });
    const [errors, setErrors] = useState({});
    const [dragActive, setDragActive] = useState(false);

    const projectTypes = [
        'Web Application',
        'Mobile Application',
        'Desktop Application',
        'Library',
        'Framework',
        'Algorithm',
        'API',
        'Tool'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            await handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileInput = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            await handleFiles(e.target.files);
        }
    };

    const handleFiles = async (fileList) => {
        const newFiles = [];
        
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            const content = await file.text();
            newFiles.push({
                name: file.name,
                content: content
            });
        }

        setFormData(prev => ({
            ...prev,
            files: [...prev.files, ...newFiles]
        }));
    };

    const handleFileRemove = (index) => {
        const newFiles = formData.files.filter((_, i) => i !== index);
        setFormData({ ...formData, files: newFiles });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Project name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.type) newErrors.type = 'Project type is required';
        if (!formData.languages.trim()) newErrors.languages = 'At least one language is required';
        if (formData.files.length === 0) newErrors.files = 'At least one file is required';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const languagesArray = formData.languages.split(',').map(lang => lang.trim());

            const projectData = {
                name: formData.name,
                description: formData.description,
                type: formData.type,
                languages: languagesArray,
                version: formData.version,
                files: formData.files,
                ownerId: user._id,
                ownerUsername: user.username
            };

            const result = await projects.create(projectData);
            navigate(`/project/${result.project._id}`);
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    return (
        <div style={styles.container}>
            <Header user={user} />

            <div style={styles.content}>
                <div style={styles.formContainer}>
                    <h1 style={styles.title}>
                        <i className="fas fa-rocket"></i> Create New Project
                    </h1>

                    {errors.submit && (
                        <div style={styles.error}>{errors.submit}</div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-cube"></i> Project Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="My Awesome Project"
                            />
                            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-align-left"></i> Description *
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                style={styles.textarea}
                                placeholder="Describe your project..."
                            />
                            {errors.description && <span style={styles.errorText}>{errors.description}</span>}
                        </div>

                        <div style={styles.twoColumn}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <i className="fas fa-tag"></i> Project Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    style={styles.select}
                                >
                                    {projectTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.type && <span style={styles.errorText}>{errors.type}</span>}
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    <i className="fas fa-code-branch"></i> Version
                                </label>
                                <input
                                    type="text"
                                    name="version"
                                    value={formData.version}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="1.0.0"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-code"></i> Languages (comma-separated) *
                            </label>
                            <input
                                type="text"
                                name="languages"
                                value={formData.languages}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="JavaScript, Python, React"
                            />
                            {errors.languages && <span style={styles.errorText}>{errors.languages}</span>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <i className="fas fa-folder-open"></i> Files *
                            </label>
                            
                            {/* Drag & Drop Zone */}
                            <div
                                style={dragActive ? {...styles.dropZone, ...styles.dropZoneActive} : styles.dropZone}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('fileInput').click()}
                            >
                                <i className="fas fa-cloud-upload-alt" style={styles.uploadIcon}></i>
                                <p style={styles.dropText}>Drag & drop files here or click to browse</p>
                                <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    onChange={handleFileInput}
                                    style={styles.fileInput}
                                />
                            </div>

                            {formData.files.length > 0 && (
                                <div style={styles.fileList}>
                                    {formData.files.map((file, index) => (
                                        <div key={index} style={styles.fileItem}>
                                            <i className="fas fa-file-code"></i>
                                            <span style={styles.fileName}>{file.name}</span>
                                            <span style={styles.fileSize}>
                                                {(file.content.length / 1024).toFixed(2)} KB
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleFileRemove(index)}
                                                style={styles.removeFileBtn}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {errors.files && <span style={styles.errorText}>{errors.files}</span>}
                        </div>

                        <div style={styles.buttonGroup}>
                            <button type="button" onClick={() => navigate(-1)} style={styles.cancelBtn}>
                                <i className="fas fa-times"></i> Cancel
                            </button>
                            <button type="submit" style={styles.submitBtn}>
                                <i className="fas fa-rocket"></i> Launch Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh' },
    content: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
    formContainer: { background: 'rgba(15, 20, 50, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '40px' },
    title: { fontSize: '32px', fontFamily: 'Orbitron, sans-serif', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' },
    error: { background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #FF4B5C', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#FF4B5C' },
    form: { display: 'flex', flexDirection: 'column', gap: '24px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    twoColumn: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    label: { fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
    input: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', fontSize: '14px' },
    textarea: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', fontSize: '14px', minHeight: '120px', resize: 'vertical' },
    select: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', fontSize: '14px' },
    errorText: { color: '#FF4B5C', fontSize: '12px' },
    dropZone: { 
        border: '2px dashed rgba(162, 89, 255, 0.5)', 
        borderRadius: '12px', 
        padding: '40px', 
        textAlign: 'center', 
        cursor: 'pointer',
        background: 'rgba(162, 89, 255, 0.05)',
        transition: 'all 0.3s ease'
    },
    dropZoneActive: { 
        border: '2px dashed #0FF6FC', 
        background: 'rgba(15, 246, 252, 0.1)',
        transform: 'scale(1.02)'
    },
    uploadIcon: { fontSize: '48px', color: '#0FF6FC', marginBottom: '16px' },
    dropText: { fontSize: '14px', opacity: '0.8', margin: '0' },
    fileInput: { display: 'none' },
    fileList: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' },
    fileItem: { background: 'rgba(162, 89, 255, 0.1)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(162, 89, 255, 0.3)' },
    fileName: { flex: 1, fontSize: '14px' },
    fileSize: { fontSize: '12px', opacity: 0.6 },
    removeFileBtn: { background: 'transparent', border: '1px solid #FF4B5C', color: '#FF4B5C', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    buttonGroup: { display: 'flex', gap: '12px', marginTop: '16px' },
    cancelBtn: { flex: 1, background: 'transparent', border: '2px solid rgba(162, 89, 255, 0.5)', padding: '14px', borderRadius: '8px', color: '#EDEDED', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' },
    submitBtn: { flex: 1, background: 'linear-gradient(135deg, #FF9A3C, #FF6B35)', border: 'none', padding: '14px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '16px' }
};

export default CreateProjectPage;