export async function createProject(req, res, projectModel, activityModel) {
    try {
        const projectData = req.body;
        const project = await projectModel.create(projectData);

        // Create activity
        await activityModel.create({
            userId: projectData.ownerId,
            username: projectData.ownerUsername,
            projectId: project._id.toString(),
            projectName: project.name,
            action: 'created project'
        });

        res.status(201).json({ success: true, project });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getProject(req, res, projectModel) {
    try {
        const { projectId } = req.params;
        const project = await projectModel.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function updateProject(req, res, projectModel) {
    try {
        const { projectId } = req.params;
        const updateData = req.body;

        const project = await projectModel.update(projectId, updateData);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ success: true, project });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteProject(req, res, projectModel) {
    try {
        const { projectId } = req.params;
        await projectModel.delete(projectId);
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function checkoutProject(req, res, projectModel, activityModel) {
    try {
        const { projectId } = req.params;
        const { userId, username } = req.body;

        const project = await projectModel.checkout(projectId, userId);

        if (!project) {
            return res.status(400).json({ message: 'Project already checked out or not found' });
        }

        // Create activity
        await activityModel.create({
            userId,
            username,
            projectId,
            projectName: project.name,
            action: 'checked out'
        });

        res.json({ success: true, project });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function checkinProject(req, res, projectModel, activityModel, checkInModel) {
    try {
        const { projectId } = req.params;
        const { userId, username, files, message, version } = req.body;

        const project = await projectModel.checkin(projectId, userId, files, message, version);

        if (!project) {
            return res.status(400).json({ message: 'Project not checked out by you or not found' });
        }

        // Create check-in record
        await checkInModel.create({
            projectId,
            userId,
            username,
            message,
            version,
            filesChanged: files
        });

        // Create activity
        await activityModel.create({
            userId,
            username,
            projectId,
            projectName: project.name,
            action: 'checked in',
            message
        });

        res.json({ success: true, project });
    } catch (error) {
        console.error('Checkin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getFeaturedProjects(req, res, projectModel) {
    try {
        const projects = await projectModel.findAll();
        res.json(projects);
    } catch (error) {
        console.error('Get featured projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function searchProjects(req, res, projectModel) {
    try {
        const { q } = req.query;
        const projects = await projectModel.search(q);
        res.json({ projects });
    } catch (error) {
        console.error('Search projects error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getProjectCheckIns(req, res, checkInModel) {
    try {
        const { projectId } = req.params;
        const checkIns = await checkInModel.findByProject(projectId);
        res.json({ checkIns });
    } catch (error) {
        console.error('Get check-ins error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}