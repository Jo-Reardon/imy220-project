export async function getActivityFeed(req, res, activityModel, userModel) {
    try {
        const { type, userId } = req.query;

        let activities;
        if (type === 'local' && userId) {
            const user = await userModel.findById(userId);
            const friendIds = user.friends;
            friendIds.push(userId); // Include own activity
            activities = await activityModel.findLocal(friendIds);
        } else {
            activities = await activityModel.findGlobal();
        }

        res.json(activities);
    } catch (error) {
        console.error('Get activity feed error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function searchActivity(req, res, activityModel) {
    try {
        const { q } = req.query;
        const activities = await activityModel.search(q);
        res.json({ activities });
    } catch (error) {
        console.error('Search activity error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}