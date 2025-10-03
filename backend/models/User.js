import { ObjectId } from 'mongodb';

class User {
    constructor(db) {
        this.collection = db.collection('users');
    }

    async create(userData) {
        const user = {
            username: userData.username,
            email: userData.email,
            password: userData.password, // In production, hash this!
            name: userData.name || userData.username,
            bio: userData.bio || '',
            avatar: userData.avatar || null,
            friends: [],
            friendRequests: [],
            projects: [],
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
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async update(id, updateData) {
        updateData.updatedAt = new Date();
        const result = await this.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        return result;
    }

    async delete(id) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    async addFriend(userId, friendId) {
        await this.collection.updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { friends: friendId } }
        );
    }

    async removeFriend(userId, friendId) {
        await this.collection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { friends: friendId } }
        );
    }

    async sendFriendRequest(fromUserId, toUserId) {
        await this.collection.updateOne(
            { _id: new ObjectId(toUserId) },
            { $addToSet: { friendRequests: fromUserId } }
        );
    }

    async acceptFriendRequest(userId, requesterId) {
        await this.collection.updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { friendRequests: requesterId } }
        );
        await this.addFriend(userId, requesterId);
        await this.addFriend(requesterId, userId);
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