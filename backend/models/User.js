import { ObjectId } from 'mongodb';

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    async create(userData) {
        const user = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            name: userData.name || userData.username,
            bio: userData.bio || '',
            avatar: userData.avatar || null,
            friends: [],
            friendRequests: [],
            projects: [],
            savedProjects: [],  // ADDED: For saving/bookmarking projects
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await this.collection.insertOne(user);
        return { ...user, _id: result.insertedId };
    }

    async findByEmail(email) {
        return await this.collection.findOne({ email });
    }

    async findByUsername(username) {
        return await this.collection.findOne({ username });
    }

    async findById(id) {
        try {
            return await this.collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            return await this.collection.findOne({ _id: id });
        }
    }

    async findOne(query) {
        return await this.collection.findOne(query);
    }

    async find(query) {
        return this.collection.find(query);
    }

    async getAllUsers() {
        return await this.collection.find({}).toArray();
    }

    async update(id, updateData) {
        updateData.updatedAt = new Date();
        try {
            const result = await this.collection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            return result;
        } catch (error) {
            const result = await this.collection.findOneAndUpdate(
                { _id: id },
                { $set: updateData },
                { returnDocument: 'after' }
            );
            return result;
        }
    }

    async delete(id) {
        try {
            return await this.collection.deleteOne({ _id: new ObjectId(id) });
        } catch (error) {
            return await this.collection.deleteOne({ _id: id });
        }
    }

    async addFriend(userId, friendId) {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { friends: friendId }, $set: { updatedAt: new Date() } }
            );
        } catch (error) {
            await this.collection.updateOne(
                { _id: userId },
                { $addToSet: { friends: friendId }, $set: { updatedAt: new Date() } }
            );
        }
    }

    async removeFriend(userId, friendId) {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { friends: friendId }, $set: { updatedAt: new Date() } }
            );
        } catch (error) {
            await this.collection.updateOne(
                { _id: userId },
                { $pull: { friends: friendId }, $set: { updatedAt: new Date() } }
            );
        }
    }

    async sendFriendRequest(fromUserId, toUserId) {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(toUserId) },
                { $addToSet: { friendRequests: fromUserId }, $set: { updatedAt: new Date() } }
            );
        } catch (error) {
            await this.collection.updateOne(
                { _id: toUserId },
                { $addToSet: { friendRequests: fromUserId }, $set: { updatedAt: new Date() } }
            );
        }
    }

    async acceptFriendRequest(userId, requesterId) {
        try {
            // Remove from requests
            await this.collection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { friendRequests: requesterId }, $set: { updatedAt: new Date() } }
            );
            // Add to friends for both users
            await this.addFriend(userId, requesterId);
            await this.addFriend(requesterId, userId);
        } catch (error) {
            await this.collection.updateOne(
                { _id: userId },
                { $pull: { friendRequests: requesterId }, $set: { updatedAt: new Date() } }
            );
            await this.addFriend(userId, requesterId);
            await this.addFriend(requesterId, userId);
        }
    }

    // ADDED: Save/bookmark a project
    async saveProject(userId, projectId) {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(userId) },
                { $addToSet: { savedProjects: projectId }, $set: { updatedAt: new Date() } }
            );
        } catch (error) {
            await this.collection.updateOne(
                { _id: userId },
                { $addToSet: { savedProjects: projectId }, $set: { updatedAt: new Date() } }
            );
        }
    }

    // ADDED: Unsave/unbookmark a project
    async unsaveProject(userId, projectId) {
        try {
            await this.collection.updateOne(
                { _id: new ObjectId(userId) },
                { $pull: { savedProjects: projectId }, $set: { updatedAt: new Date() } }
            );
        } catch (error) {
            await this.collection.updateOne(
                { _id: userId },
                { $pull: { savedProjects: projectId }, $set: { updatedAt: new Date() } }
            );
        }
    }

    async search(query) {
        return await this.collection.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
    }
}

export default User;