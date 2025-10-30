import express from 'express';
import {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    checkoutProject,
    checkinProject,
    getFeaturedProjects,
    searchProjects,
    getProjectCheckIns
} from '../controllers/projectController.js';

export function createProjectRoutes(projectModel, activityModel, checkInModel) {
    const router = express.Router();

    router.get('/featured', (req, res) => getFeaturedProjects(req, res, projectModel));
    router.get('/search', (req, res) => searchProjects(req, res, projectModel));
    router.get('/:projectId', (req, res) => getProject(req, res, projectModel));
    router.get('/:projectId/checkins', (req, res) => getProjectCheckIns(req, res, checkInModel));
    router.post('/', (req, res) => createProject(req, res, projectModel, activityModel));
    router.put('/:projectId', (req, res) => updateProject(req, res, projectModel));
    router.delete('/:projectId', (req, res) => deleteProject(req, res, projectModel));
    
    router.post('/:projectId/checkout', (req, res) => checkoutProject(req, res, projectModel, activityModel));
    router.post('/:projectId/checkin', (req, res) => checkinProject(req, res, projectModel, activityModel, checkInModel));

    return router;
}