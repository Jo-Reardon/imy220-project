import express from 'express';
import {
    getProfile,
    updateProfile,
    deleteProfile,
    searchUsers,
    sendFriendRequest,
    acceptFriend,
    unfriend,
    getFriends
} from '../controllers/userController.js';

export function createUserRoutes(userModel) {
    const router = express.Router();

    // IMPORTANT: Specific routes MUST come before parameterized routes
    // Otherwise /:username will catch "search" and try to find a user named "search"
    
    // Search route - MUST be first
    router.get('/search', (req, res) => searchUsers(req, res, userModel));

    // Friend management routes
    router.post('/friend-request', (req, res) => sendFriendRequest(req, res, userModel));
    router.post('/accept-friend', (req, res) => acceptFriend(req, res, userModel));
    router.post('/unfriend', (req, res) => unfriend(req, res, userModel));
    
    // Friends list - specific route before :username
    router.get('/:userId/friends', (req, res) => getFriends(req, res, userModel));

    // Profile routes - parameterized routes come LAST
    router.get('/:username', (req, res) => getProfile(req, res, userModel));
    router.put('/:userId', (req, res) => updateProfile(req, res, userModel));
    router.delete('/:userId', (req, res) => deleteProfile(req, res, userModel));

    return router;
}