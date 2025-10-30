export async function getProfile(req, res, userModel) {
    try {
        const { username } = req.params;
        
        const user = await userModel.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password from response
        delete user.password;

        res.json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function updateProfile(req, res, userModel) {
    try {
        const { userId } = req.params;
        const { name, bio, avatar } = req.body;  // CHANGED: profileImage -> avatar

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar !== undefined) updateData.avatar = avatar;  // CHANGED: Use 'avatar' field

        const updatedUser = await userModel.update(userId, updateData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete updatedUser.password;

        res.json({ 
            success: true, 
            user: updatedUser,
            message: 'Profile updated successfully' 
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteProfile(req, res, userModel) {
    try {
        const { userId } = req.params;

        const deleted = await userModel.delete(userId);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            success: true, 
            message: 'Profile deleted successfully' 
        });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function searchUsers(req, res, userModel) {
    try {
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query required' });
        }

        const users = await userModel.search(q);
        
        // Remove passwords from all results
        const sanitizedUsers = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.json({ 
            success: true, 
            users: sanitizedUsers 
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function sendFriendRequest(req, res, userModel) {
    try {
        const { fromUserId, toUserId } = req.body;

        if (!fromUserId || !toUserId) {
            return res.status(400).json({ message: 'Both user IDs required' });
        }

        if (fromUserId === toUserId) {
            return res.status(400).json({ message: 'Cannot send friend request to yourself' });
        }

        const toUser = await userModel.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already friends
        if (toUser.friends && toUser.friends.includes(fromUserId)) {
            return res.status(400).json({ message: 'Already friends' });
        }

        // Check if request already sent
        if (toUser.friendRequests && toUser.friendRequests.includes(fromUserId)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        // Use the model's method instead of manual update
        await userModel.sendFriendRequest(fromUserId, toUserId);

        res.json({ 
            success: true, 
            message: 'Friend request sent' 
        });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function acceptFriend(req, res, userModel) {
    try {
        const { userId, requesterId } = req.body;

        if (!userId || !requesterId) {
            return res.status(400).json({ message: 'Both user IDs required' });
        }

        const user = await userModel.findById(userId);
        const requester = await userModel.findById(requesterId);

        if (!user || !requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use the model's method
        await userModel.acceptFriendRequest(userId, requesterId);

        res.json({ 
            success: true, 
            message: 'Friend request accepted' 
        });
    } catch (error) {
        console.error('Accept friend error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function unfriend(req, res, userModel) {
    try {
        const { userId, friendId } = req.body;

        if (!userId || !friendId) {
            return res.status(400).json({ message: 'Both user IDs required' });
        }

        const user = await userModel.findById(userId);
        const friend = await userModel.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Use the model's method
        await userModel.removeFriend(userId, friendId);
        await userModel.removeFriend(friendId, userId);

        res.json({ 
            success: true, 
            message: 'Unfriended successfully' 
        });
    } catch (error) {
        console.error('Unfriend error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getFriends(req, res, userModel) {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.friends || user.friends.length === 0) {
            return res.json({ success: true, friends: [] });
        }

        // Fetch all friend details
        const friendsPromises = user.friends.map(friendId => userModel.findById(friendId));
        const friends = await Promise.all(friendsPromises);

        // Remove passwords and filter out null results
        const sanitizedFriends = friends
            .filter(friend => friend !== null)
            .map(friend => {
                const { password, ...friendWithoutPassword } = friend;
                return friendWithoutPassword;
            });

        res.json({ 
            success: true, 
            friends: sanitizedFriends 
        });
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}