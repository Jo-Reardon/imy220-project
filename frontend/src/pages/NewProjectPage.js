import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '../components/forms/ProjectForm.js';
import { projects } from '../utils/api.js';

export default function NewProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (projectId) {
      projects.getProject(projectId).then(setInitialData).catch(console.error);
    }
  }, [projectId]);

  const handleSave = async project => {
    try {
      if (projectId) await projects.updateProject(projectId, project);
      else await projects.createProject(project);
      navigate('/home'); // redirect after save
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;
    try {
      await projects.deleteProject(projectId);
      navigate('/home'); // redirect after delete
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{projectId ? 'Edit Project' : 'New Project'}</h1>
      {(initialData || !projectId) ? (
        <ProjectForm
          initialData={initialData}
          onSave={handleSave}
          onDelete={projectId ? handleDelete : null}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
