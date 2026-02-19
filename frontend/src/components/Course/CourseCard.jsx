import { Star, BookOpen, Users, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();

    const rating = course.avgRating || 0;
    const roundedRating = Math.round(rating);

    return (
        <div 
            onClick={() => navigate(`/app/courses/${course.courseId}`)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#007AB8] group-hover:bg-[#007AB8] group-hover:text-white transition-colors">
                    {course.type === 'service' ? <Settings size={22} /> : <BookOpen size={22} />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    course.type === 'service' 
                        ? 'bg-slate-800 text-white' 
                        : 'bg-[#007AB8] text-white'
                }`}>
                    {course.type === 'service' ? 'Service' : 'Cours'}
                </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#007AB8] transition-colors line-clamp-1">
                {course.name}
            </h3>
            <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                {course.teacherName || 'Responsable'} 
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                {course.department || 'Général'}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                            key={s} 
                            size={16} 
                            className={s <= roundedRating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                        />
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Users size={16} />
                    <span className="text-xs font-bold">{course.totalReviews || 0} avis</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
