export async function getProfile(req, res, userModel) {
    try {
        const { username } = req.params;
        const user = await userModel.findByUsername(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete user.password;
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function updateProfile(req, res, userModel) {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Don't allow password or email updates through this endpoint
        delete updateData.password;
        delete updateData.email;

        const user = await userModel.update(userId, updateData);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete user.password;
        res.json({ success: true, user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteProfile(req, res, userModel) {
    try {
        const { userId } = req.params;
        await userModel.delete(userId);
        res.json({ success: true, message: 'Profile deleted' });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function sendFriendRequest(req, res, userModel) {
    try {
        const { fromUserId, toUserId } = req.body;
        await userModel.sendFriendRequest(fromUserId, toUserId);
        res.json({ success: true, message: 'Friend request sent' });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function acceptFriendRequest(req, res, userModel) {
    try {
        const { userId, requesterId } = req.body;
        await userModel.acceptFriendRequest(userId, requesterId);
        res.json({ success: true, message: 'Friend request accepted' });
    } catch (error) {
        console.error('Accept friend request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function unfriend(req, res, userModel) {
    try {
        const { userId, friendId } = req.body;
        await userModel.removeFriend(userId, friendId);
        await userModel.removeFriend(friendId, userId);
        res.json({ success: true, message: 'Friend removed' });
    } catch (error) {
        console.error('Unfriend error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function searchUsers(req, res, userModel) {
    try {
        const { q } = req.query;
        const users = await userModel.search(q);
        
        // Remove passwords
        users.forEach(user => delete user.password);
        
        res.json({ users });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}