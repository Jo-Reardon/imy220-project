const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth
export const auth = {
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' })
};

// Users
export const users = {
    getProfile: (username) => apiRequest(`/users/${username}`),
    updateProfile: (userId, data) => apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteProfile: (userId) => apiRequest(`/users/${userId}`, {
        method: 'DELETE'
    }),
    search: (query) => apiRequest(`/users/search?q=${query}`),
    sendFriendRequest: (fromUserId, toUserId) => apiRequest('/users/friend-request', {
        method: 'POST',
        body: JSON.stringify({ fromUserId, toUserId })
    }),
    acceptFriend: (userId, requesterId) => apiRequest('/users/accept-friend', {
        method: 'POST',
        body: JSON.stringify({ userId, requesterId })
    }),
    unfriend: (userId, friendId) => apiRequest('/users/unfriend', {
        method: 'POST',
        body: JSON.stringify({ userId, friendId })
    }),
    getFriends: (userId) => apiRequest(`/users/${userId}/friends`)
};

// Projects
export const projects = {
    create: (projectData) => apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
    }),
    get: (projectId) => apiRequest(`/projects/${projectId}`),
    update: (projectId, data) => apiRequest(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (projectId) => apiRequest(`/projects/${projectId}`, {
        method: 'DELETE'
    }),
    getFeatured: () => apiRequest('/projects/featured'),
    search: (query) => apiRequest(`/projects/search?q=${query}`),
    checkout: (projectId, userId, username) => apiRequest(`/projects/${projectId}/checkout`, {
        method: 'POST',
        body: JSON.stringify({ userId, username })
    }),
    checkin: (projectId, userId, username, files, message, version) => apiRequest(`/projects/${projectId}/checkin`, {
        method: 'POST',
        body: JSON.stringify({ userId, username, files, message, version })
    })
};

// Activity
export const activity = {
    getFeed: (type, userId) => apiRequest(`/activity?type=${type}&userId=${userId || ''}`),
    search: (query) => apiRequest(`/activity/search?q=${query}`)
};