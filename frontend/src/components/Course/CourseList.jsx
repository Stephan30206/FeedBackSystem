import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Settings, X, ChevronDown } from 'lucide-react';
import courseService from '../../services/courseService';
import CourseCard from './CourseCard';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CourseList = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all', 
        department: 'all',
        sortBy: 'name' 
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        loadCourses();
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [courses, searchTerm, filters]);

    const loadCourses = async () => {
        if (!user) return;
        try {
            setLoading(true);
            // We use getCoursesForUser to respect domain visibility rules
            const response = await courseService.getCoursesForUser(user.userId);
            const coursesData = response.data;

            setCourses(coursesData);

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

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(course =>
                course.name.toLowerCase().includes(term) ||
                course.code.toLowerCase().includes(term) ||
                (course.description && course.description.toLowerCase().includes(term)) ||
                (course.teacherName && course.teacherName.toLowerCase().includes(term))
            );
        }

        if (filters.type !== 'all') {
            filtered = filtered.filter(course => course.type === filters.type);
        }

        if (filters.department !== 'all') {
            filtered = filtered.filter(course => course.department === filters.department);
        }

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AB8] mb-4"></div>
                <p className="text-slate-500 font-medium">Chargement du catalogue...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Catalogue des Cours</h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <BookOpen size={18} className="text-[#007AB8]" />
                        Découvrez {courses.length} cours et services disponibles dans votre domaine
                    </p>
                </div>

                <div className="flex items-center gap-3">
                   <div className="px-4 py-2 bg-blue-50 text-[#007AB8] rounded-xl text-sm font-bold border border-blue-100 flex items-center gap-2">
                     <Settings size={16} /> {courses.filter(c => c.type === 'service').length} Services
                   </div>
                   <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200 flex items-center gap-2">
                     <BookOpen size={16} /> {courses.filter(c => c.type === 'course').length} Cours
                   </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un cours, un code ou un enseignant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#007AB8] transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Type Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Type</label>
                        <div className="relative">
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full appearance-none px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50"
                            >
                                <option value="all">Tous les types</option>
                                <option value="course">Cours uniquement</option>
                                <option value="service">Services uniquement</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Department Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Département</label>
                        <div className="relative">
                            <select
                                value={filters.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="w-full appearance-none px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50"
                            >
                                <option value="all">Tous les départements</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>

                    {/* Sort Filter */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Trier par</label>
                        <div className="relative">
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="w-full appearance-none px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-4 focus:ring-blue-50"
                            >
                                <option value="name">Nom (A-Z)</option>
                                <option value="rating">Meilleure note</option>
                                <option value="reviews">Plus d'avis</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.courseId} course={course} />
                    ))}
                </div>
            ) : (
                <div className="py-24 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                        <Filter size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucun cours trouvé</h3>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                        Nous n'avons trouvé aucun cours correspondant à vos critères de recherche dans votre domaine.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseList;
