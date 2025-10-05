import React, { useState } from 'react';

export default function ProjectForm({ initialData = {}, onSave, onDelete }) {
  const [project, setProject] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    languages: initialData.languages || [],
    type: initialData.type || '',
    image: null,
  });

  const handleChange = e => setProject({ ...project, [e.target.name]: e.target.value });

  const handleFileChange = e => setProject({ ...project, image: e.target.files[0] });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(project);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Project Name
        <input type="text" name="name" value={project.name} onChange={handleChange} required />
      </label>

      <label>Description
        <textarea name="description" value={project.description} onChange={handleChange} required />
      </label>

      <label>Languages (comma separated)
        <input type="text" value={project.languages.join(',')} onChange={e => setProject({ ...project, languages: e.target.value.split(',') })} />
      </label>

      <label>Type
        <select name="type" value={project.type} onChange={handleChange} required>
          <option value="">Select type</option>
          <option value="web">Web App</option>
          <option value="desktop">Desktop App</option>
          <option value="mobile">Mobile App</option>
          <option value="library">Library</option>
        </select>
      </label>

      <label>Project Image
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </label>

      <button type="submit">Save Project</button>
      {onDelete && <button type="button" onClick={onDelete} style={{ backgroundColor: 'red' }}>Delete Project</button>}
    </form>
  );
}
