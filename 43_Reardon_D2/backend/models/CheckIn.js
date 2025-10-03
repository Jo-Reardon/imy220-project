import { ObjectId } from 'mongodb';

class CheckIn {
    constructor(db) {
        this.collection = db.collection('checkins');
    }

    async create(checkInData) {
        const checkIn = {
            projectId: checkInData.projectId,
            userId: checkInData.userId,
            username: checkInData.username,
            message: checkInData.message,
            version: checkInData.version,
            filesChanged: checkInData.filesChanged || [],
            createdAt: new Date()
        };
        const result = await this.collection.insertOne(checkIn);
        return { ...checkIn, _id: result.insertedId };
    }

    async findByProject(projectId) {
        return await this.collection
            .find({ projectId })
            .sort({ createdAt: -1 })
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

export default CheckIn;