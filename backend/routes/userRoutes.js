import express from 'express';
import { ObjectId } from 'mongodb';
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

    // Search users
    router.get('/search', (req, res) => searchUsers(req, res, userModel));

    // Get user profile
    router.get('/:username', (req, res) => getProfile(req, res, userModel));

    // ✅ Get friends (handles ObjectId or username)
    router.get('/:userId/friends', async (req, res) => {
        try {
            const { userId } = req.params;

            // Attempt to treat as ObjectId
            let user = null;
            if (/^[0-9a-fA-F]{24}$/.test(userId)) {
                user = await userModel.findOne({ _id: new ObjectId(userId) });
            }
            if (!user) {
                // Fallback: treat as username
                user = await userModel.findOne({ username: userId });
            }

            if (!user) return res.status(404).json({ message: 'User not found' });
            if (!user.friends || user.friends.length === 0) return res.json({ friends: [] });

            // Separate friends into ObjectId vs username
            const objectIdFriends = user.friends.filter(f => /^[0-9a-fA-F]{24}$/.test(f));
            const usernameFriends = user.friends.filter(f => !/^[0-9a-fA-F]{24}$/.test(f));

            const query = { $or: [] };
            if (objectIdFriends.length) query.$or.push({ _id: { $in: objectIdFriends.map(id => new ObjectId(id)) } });
            if (usernameFriends.length) query.$or.push({ username: { $in: usernameFriends } });

            const friendsData = await userModel
                .find(query)
                .project({ username: 1, name: 1, avatar: 1 })
                .toArray();

            // Normalize for frontend
            const normalizedFriends = friendsData.map(f => ({
                _id: f._id,
                username: f.username || '',
                name: f.name || '',
                profileImage: f.avatar || null
            }));

            res.json({ friends: normalizedFriends });
        } catch (err) {
            console.error('Error fetching friends:', err);
            res.status(500).json({ message: 'Failed to fetch friends' });
        }
    });

    // Update and delete profile
    router.put('/:userId', (req, res) => updateProfile(req, res, userModel));
    router.delete('/:userId', (req, res) => deleteProfile(req, res, userModel));

    // Friend actions
    router.post('/friend-request', (req, res) => sendFriendRequest(req, res, userModel));
    router.post('/accept-friend', (req, res) => acceptFriendRequest(req, res, userModel));
    router.post('/unfriend', (req, res) => unfriend(req, res, userModel));

    return router;
}