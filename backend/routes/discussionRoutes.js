import express from 'express';

export function createDiscussionRoutes(discussionModel) {
    const router = express.Router();

    // Get discussions for a project
    router.get('/:projectId/discussions', async (req, res) => {
        try {
            const { projectId } = req.params;
            const discussions = await discussionModel.findByProject(projectId);
            res.json({ discussions });
        } catch (error) {
            console.error('Error fetching discussions:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Post a discussion message
    router.post('/:projectId/discussions', async (req, res) => {
        try {
            const { projectId } = req.params;
            const { userId, username, message } = req.body;

            if (!message || !message.trim()) {
                return res.status(400).json({ message: 'Message is required' });
            }

            const discussion = await discussionModel.create({
                projectId,
                userId,
                username,
                message: message.trim()
            });

            res.json({ success: true, discussion });
        } catch (error) {
            console.error('Error posting discussion:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
}