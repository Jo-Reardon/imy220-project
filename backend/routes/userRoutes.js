import express from 'express';
import {
    getProfile,
    updateProfile,
    deleteProfile,
    sendFriendRequest,
    acceptFriendRequest,
    unfriend,
    searchUsers
} from '../controllers/userController.js';

export function createUserRoutes(userModel) {
    const router = express.Router();

    router.get('/search', (req, res) => searchUsers(req, res, userModel));
    router.get('/:username', (req, res) => getProfile(req, res, userModel));
    router.put('/:userId', (req, res) => updateProfile(req, res, userModel));
    router.delete('/:userId', (req, res) => deleteProfile(req, res, userModel));
    
    router.post('/friend-request', (req, res) => sendFriendRequest(req, res, userModel));
    router.post('/accept-friend', (req, res) => acceptFriendRequest(req, res, userModel));
    router.post('/unfriend', (req, res) => unfriend(req, res, userModel));

    return router;
}