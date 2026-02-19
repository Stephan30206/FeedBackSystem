import { Star, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant CourseCard
 * Carte affichant les informations d'un cours
 */
const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`w-4 h-4 ${
                        i < fullStars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                />
            );
        }

        return stars;
    };

    return (
        <div
            onClick={() => navigate(`/courses/${course.courseId}`)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
            {/* En-tête */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    course.type === 'course'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                }`}>
          {course.type === 'course' ? 'Cours' : 'Service'}
        </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {course.description}
            </p>

            {/* Évaluation et statistiques */}
            <div className="flex items-center justify-between text-sm">
                {/* Étoiles */}
                <div className="flex items-center space-x-1">
                    {renderStars(course.avgRating || 0)}
                    <span className="ml-1 text-gray-600">
            {course.avgRating ? course.avgRating.toFixed(1) : 'N/A'}
          </span>
                </div>

                {/* Statistiques */}
                <div className="flex items-center space-x-3 text-gray-500">
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.totalReviews || 0}</span>
                    </div>
                    {course.type === 'course' && course.credits && (
                        <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span>{course.credits} crédits</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Enseignant */}
            {course.teacherName && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Enseignant: <span className="font-medium">{course.teacherName}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default CourseCard;