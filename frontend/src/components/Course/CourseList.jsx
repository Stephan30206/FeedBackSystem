import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Briefcase, X } from 'lucide-react';
import courseService from '../../services/courseService';
import CourseCard from './CourseCard';
import toast from 'react-hot-toast';

/**
 * Composant CourseList
 * Liste de tous les cours avec recherche et filtres
 */
const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all', // all, course, service
        department: 'all',
        sortBy: 'name' // name, rating, reviews
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [courses, searchTerm, filters]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getAllCourses();
            const coursesData = response.data;

            setCourses(coursesData);

            // Extraire les départements uniques
            const uniqueDepartments = [...new Set(
                coursesData
                    .filter(c => c.department)
                    .map(c => c.department)
            )].sort();

            setDepartments(uniqueDepartments);
        } catch (error) {
            console.error('Erreur lors du chargement des cours:', error);
            toast.error('Erreur lors du chargement des cours');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...courses];

        // Filtrer par recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(term) ||
                course.code.toLowerCase().includes(term) ||
                (course.description && course.description.toLowerCase().includes(term)) ||
                (course.teacherName && course.teacherName.toLowerCase().includes(term))
            );
        }

        // Filtrer par type
        if (filters.type !== 'all') {
            filtered = filtered.filter(course => course.type === filters.type);
        }

        // Filtrer par département
        if (filters.department !== 'all') {
            filtered = filtered.filter(course => course.department === filters.department);
        }

        // Trier
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'rating':
                    return (b.avgRating || 0) - (a.avgRating || 0);
                case 'reviews':
                    return (b.totalReviews || 0) - (a.totalReviews || 0);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredCourses(filtered);
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            type: 'all',
            department: 'all',
            sortBy: 'name'
        });
    };

    const hasActiveFilters = searchTerm || filters.type !== 'all' || filters.department !== 'all';

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue des Cours</h1>
                <p className="text-gray-600">
                    Découvrez {courses.length} cours et services disponibles
                </p>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Recherche */}
                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher un cours, code, enseignant..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtres */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tous</option>
                            <option value="course">Cours uniquement</option>
                            <option value="service">Services uniquement</option>
                        </select>
                    </div>

                    {/* Département */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Département
                        </label>
                        <select
                            value={filters.department}
                            onChange={(e) => handleFilterChange('department', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tous les départements</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tri */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trier par
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="name">Nom (A-Z)</option>
                            <option value="rating">Meilleure note</option>
                            <option value="reviews">Plus d'avis</option>
                        </select>
                    </div>

                    {/* Bouton reset */}
                    <div className="flex items-end">
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>

                {/* Statistiques de filtrage */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
                {filteredCourses.filter(c => c.type === 'course').length} cours
            </span>
                        <span className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
                            {filteredCourses.filter(c => c.type === 'service').length} services
            </span>
                    </div>
                    <span className="font-medium">
            {filteredCourses.length} résultat{filteredCourses.length > 1 ? 's' : ''}
          </span>
                </div>
            </div>

            {/* Liste des cours */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.courseId} course={course} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Filter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Aucun cours trouvé
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {hasActiveFilters
                            ? "Essayez de modifier vos critères de recherche"
                            : "Il n'y a pas encore de cours disponibles"
                        }
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Réinitialiser les filtres
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseList;