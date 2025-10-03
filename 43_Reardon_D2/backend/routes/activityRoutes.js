import express from 'express';
import { getActivityFeed, searchActivity } from '../controllers/activityController.js';

export function createActivityRoutes(activityModel, userModel) {
    const router = express.Router();

    router.get('/', (req, res) => getActivityFeed(req, res, activityModel, userModel));
    router.get('/search', (req, res) => searchActivity(req, res, activityModel));

    return router;
}