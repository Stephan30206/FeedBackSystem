import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api';

class AuthService {
    // Connexion
    async login(username, password) {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username,
            password
        });

        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    }

    // Déconnexion
    logout() {
        localStorage.removeItem('user');
    }

    // Inscription
    async register(userData) {
        return await axios.post(`${API_URL}/auth/register`, userData);
    }

    // Obtenir l'utilisateur courant
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }

    // Vérifier si connecté
    isAuthenticated() {
        const user = this.getCurrentUser();
        if (!user || !user.token) return false;

        try {
            const decoded = jwtDecode(user.token);
            return decoded.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    }

    // Obtenir le token
    getToken() {
        const user = this.getCurrentUser();
        return user?.token;
    }

    // Obtenir le rôle
    getUserRole() {
        const user = this.getCurrentUser();
        return user?.role;
    }
}

export default new AuthService();