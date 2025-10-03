import { ObjectId } from 'mongodb';

class Activity {
    constructor(db) {
        this.collection = db.collection('activities');
    }

    async create(activityData) {
        const activity = {
            userId: activityData.userId,
            username: activityData.username,
            projectId: activityData.projectId,
            projectName: activityData.projectName,
            action: activityData.action,
            message: activityData.message || '',
            createdAt: new Date()
        };
        const result = await this.collection.insertOne(activity);
        return { ...activity, _id: result.insertedId };
    }

    async findByUser(userId) {
        return await this.collection
            .find({ userId })
            .sort({ createdAt: -1 })
            .toArray();
    }

    async findByProject(projectId) {
        return await this.collection
            .find({ projectId })
            .sort({ createdAt: -1 })
            .toArray();
    }

    async findGlobal() {
        return await this.collection
            .find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();
    }

    async findLocal(userIds) {
        return await this.collection
            .find({ userId: { $in: userIds } })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();
    }

    async search(query) {
        return await this.collection
            .find({
                message: { $regex: query, $options: 'i' }
            })
            .sort({ createdAt: -1 })
            .toArray();
    }
}

export default Activity;