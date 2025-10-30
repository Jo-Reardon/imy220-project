import { ObjectId } from 'mongodb';

class Project {
    constructor(db) {
        this.collection = db.collection('projects');
    }

    async create(projectData) {
        const project = {
            name: projectData.name,
            description: projectData.description,
            ownerId: projectData.ownerId,
            members: [projectData.ownerId],
            languages: projectData.languages || [],
            type: projectData.type,
            version: projectData.version || '1.0.0',
            image: projectData.image || null,
            files: projectData.files || [],
            status: 'checked-in',
            checkedOutBy: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await this.collection.insertOne(project);
        return { ...project, _id: result.insertedId };
    }

    async findById(id) {
        return await this.collection.findOne({ _id: new ObjectId(id) });
    }

    async findByOwner(ownerId) {
        return await this.collection.find({ ownerId }).toArray();
    }

    async findAll() {
        return await this.collection.find({}).toArray();
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

    async checkout(projectId, userId) {
        return await this.collection.findOneAndUpdate(
            { _id: new ObjectId(projectId), status: 'checked-in' },
            { 
                $set: { 
                    status: 'checked-out', 
                    checkedOutBy: userId,
                    updatedAt: new Date()
                } 
            },
            { returnDocument: 'after' }
        );
    }

    async checkin(projectId, userId, files, message, version) {
        return await this.collection.findOneAndUpdate(
            { _id: new ObjectId(projectId), checkedOutBy: userId },
            { 
                $set: { 
                    status: 'checked-in',
                    checkedOutBy: null,
                    files: files,
                    version: version,
                    updatedAt: new Date()
                } 
            },
            { returnDocument: 'after' }
        );
    }

    async addMember(projectId, userId) {
        await this.collection.updateOne(
            { _id: new ObjectId(projectId) },
            { $addToSet: { members: userId } }
        );
    }

    async removeMember(projectId, userId) {
        await this.collection.updateOne(
            { _id: new ObjectId(projectId) },
            { $pull: { members: userId } }
        );
    }

    async search(query) {
        return await this.collection.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { languages: { $regex: query, $options: 'i' } },
                { type: { $regex: query, $options: 'i' } }
            ]
        }).toArray();
    }

    async addMember(projectId, userId) {
    try {
        await this.collection.updateOne(
            { _id: new ObjectId(projectId) },
            { $addToSet: { members: userId } }
        );
    } catch (error) {
        await this.collection.updateOne(
            { _id: projectId },
            { $addToSet: { members: userId } }
        );
    }
}

async removeMember(projectId, userId) {
    try {
        await this.collection.updateOne(
            { _id: new ObjectId(projectId) },
            { $pull: { members: userId } }
        );
    } catch (error) {
        await this.collection.updateOne(
            { _id: projectId },
            { $pull: { members: userId } }
        );
    }
}
}

export default Project;