import { ObjectId } from 'mongodb';

class Discussion {
    constructor(db) {
        this.collection = db.collection('discussions');
    }

    async create(discussionData) {
        const discussion = {
            projectId: discussionData.projectId,
            userId: discussionData.userId,
            username: discussionData.username,
            message: discussionData.message,
            createdAt: new Date()
        };
        const result = await this.collection.insertOne(discussion);
        return { ...discussion, _id: result.insertedId };
    }

    async findByProject(projectId) {
        return await this.collection
            .find({ projectId })
            .sort({ createdAt: -1 })
            .toArray();
    }

    async deleteByProject(projectId) {
        return await this.collection.deleteMany({ projectId });
    }
}

export default Discussion;