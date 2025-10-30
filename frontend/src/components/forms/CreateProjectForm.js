import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../../utils/api.js';

function CreateProjectForm({ user, onClose }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'Web Application',
        languages: '',
        version: '1.0.0',
        files: []
    });
    const [errors, setErrors] = useState({});

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

    const handleFileAdd = () => {
        const fileName = prompt('Enter file name (e.g., index.js):');
        if (!fileName) return;

        const fileContent = prompt('Enter file content:');
        if (fileContent === null) return;

        setFormData({
            ...formData,
            files: [...formData.files, { name: fileName, content: fileContent }]
        });
    };

    const handleFileRemove = (index) => {
        const newFiles = formData.files.filter((_, i) => i !== index);
        setFormData({ ...formData, files: newFiles });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Project name is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.type) newErrors.type = 'Project type is required';
        if (!formData.languages) newErrors.languages = 'At least one language is required';
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
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>
                        <i className="fas fa-plus-circle"></i> Create New Project
                    </h2>
                    <button style={styles.closeBtn} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

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

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <i className="fas fa-folder-open"></i> Files *
                        </label>
                        <button type="button" onClick={handleFileAdd} style={styles.addFileBtn}>
                            <i className="fas fa-plus"></i> Add File
                        </button>
                        {formData.files.length === 0 ? (
                            <p style={styles.noFiles}>No files added yet</p>
                        ) : (
                            <div style={styles.fileList}>
                                {formData.files.map((file, index) => (
                                    <div key={index} style={styles.fileItem}>
                                        <i className="fas fa-file-code"></i>
                                        <span>{file.name}</span>
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
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" style={styles.submitBtn}>
                            <i className="fas fa-rocket"></i> Launch Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: 'rgba(15, 20, 50, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(162, 89, 255, 0.3)', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontFamily: 'Orbitron, sans-serif', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' },
    closeBtn: { background: 'transparent', border: 'none', color: '#FF4B5C', fontSize: '24px', cursor: 'pointer' },
    error: { background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #FF4B5C', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#FF4B5C' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' },
    input: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', fontSize: '14px' },
    textarea: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', fontSize: '14px', minHeight: '100px' },
    select: { width: '100%', background: 'rgba(11, 15, 43, 0.6)', border: '2px solid rgba(162, 89, 255, 0.3)', borderRadius: '8px', padding: '12px', color: '#EDEDED', fontSize: '14px' },
    errorText: { color: '#FF4B5C', fontSize: '12px' },
    addFileBtn: { background: 'linear-gradient(135deg, #0FF6FC, #4F9FFF)', border: 'none', padding: '10px 16px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start' },
    noFiles: { opacity: 0.6, fontSize: '14px', textAlign: 'center', padding: '20px' },
    fileList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    fileItem: { background: 'rgba(162, 89, 255, 0.1)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
    removeFileBtn: { marginLeft: 'auto', background: 'transparent', border: '1px solid #FF4B5C', color: '#FF4B5C', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' },
    buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
    cancelBtn: { flex: 1, background: 'transparent', border: '2px solid rgba(162, 89, 255, 0.5)', padding: '12px', borderRadius: '8px', color: '#EDEDED', fontWeight: 600, cursor: 'pointer' },
    submitBtn: { flex: 1, background: 'linear-gradient(135deg, #FF9A3C, #FF6B35)', border: 'none', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};

export default CreateProjectForm;