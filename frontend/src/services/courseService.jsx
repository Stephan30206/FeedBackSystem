import api from './api.jsx';

class CourseService {
    // Obtenir tous les cours
    getAllCourses() {
        return api.get('/courses');
    }

    // Obtenir les cours filtrés pour l'utilisateur
    getCoursesForUser(userId) {
        return api.get(`/courses/user/${userId}`);
    }

    // Obtenir un cours par ID
    getCourseById(id) {
        return api.get(`/courses/${id}`);
    }

    // Rechercher des cours
    searchCourses(searchTerm) {
        return api.get('/courses/search', {
            params: { q: searchTerm }
        });
    }

    // Obtenir les cours par département
    getCoursesByDepartment(department) {
        return api.get('/courses/department', {
            params: { department }
        });
    }

    // Créer un cours (admin)
    createCourse(courseData) {
        return api.post('/courses', courseData);
    }

    // Mettre à jour un cours (admin)
    updateCourse(id, courseData) {
        return api.put(`/courses/${id}`, courseData);
    }

    // Supprimer un cours (admin)
    deleteCourse(id) {
        return api.delete(`/courses/${id}`);
    }

    // Obtenir les statistiques d'un cours
    getCourseStatistics(id) {
        return api.get(`/courses/${id}/statistics`);
    }
}

export default new CourseService();
