import api from './api.jsx';

class UserService {
    // Get all users (admin only)
    getAllUsers() {
        return api.get('/users');
    }

    // Update user role (admin only)
    updateUserRole(userId, newRole) {
        return api.patch(`/users/${userId}/role`, { role: newRole });
    }

    // Deactivate user (admin only)
    deactivateUser(userId) {
        return api.patch(`/users/${userId}/deactivate`);
    }

    // Activate user (admin only)
    activateUser(userId) {
        return api.patch(`/users/${userId}/activate`);
    }

    // Search users (admin only)
    searchUsers(query) {
        return api.get('/users/search', { params: { q: query } });
    }
}

export default new UserService();
