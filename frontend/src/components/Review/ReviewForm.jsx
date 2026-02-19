import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import { ArrowLeft, Star, Send, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ReviewForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        ratingOverall: 0,
        ratingClarity: 0,
        ratingMaterial: 0,
        ratingPedagogy: 0,
        comment: '',
        anonymous: false
    });

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const response = await courseService.getCourseById(id);
            setCourse(response.data);
        } catch (error) {
            console.error('Error loading course:', error);
            toast.error('Erreur lors du chargement du cours');
            navigate('/app/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (formData.ratingOverall === 0) {
            toast.error('Veuillez donner une note globale');
            return false;
        }
        if (formData.comment.trim().length < 10) {
            toast.error('Le commentaire doit contenir au moins 10 caractères');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const reviewData = {
                courseId: parseInt(id),
                ratingOverall: formData.ratingOverall,
                ratingClarity: formData.ratingClarity || null,
                ratingMaterial: formData.ratingMaterial || null,
                ratingPedagogy: formData.ratingPedagogy || null,
                comment: formData.comment.trim(),
                anonymous: formData.anonymous
            };
            await reviewService.createReview(reviewData);
            toast.success('Avis envoyé avec succès! Il sera visible après modération.');
            navigate(`/app/courses/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ label, value, onChange, required = false }) => {
        const [hover, setHover] = useState(0);
        return (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
                <div>
                    <label className="text-sm font-bold text-slate-700 block mb-1">
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Note de 1 à 5</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => onChange(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="focus:outline-none transition-transform hover:scale-125 p-1"
                            >
                                <Star
                                    size={24}
                                    className={`${
                                        star <= (hover || value)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-slate-200'
                                    } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                    {value > 0 && <span className="text-sm font-black text-slate-900 w-8 text-center">{value}</span>}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AB8] mb-4"></div>
                <p className="text-slate-500 font-medium">Chargement du formulaire...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate(`/app/courses/${id}`)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all group"
            >
                <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Annuler et retourner au cours
            </button>

            {/* Header Card */}
            <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-xl shadow-blue-900/10">
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex justify-center md:justify-start">
                         <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#007AB8] text-white">
                            {course.type === 'service' ? 'Service' : 'Cours'}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{course.name}</h1>
                    <p className="text-white/60 font-medium">{course.code} • {course.teacherName || 'Responsable'}</p>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white/40 flex-shrink-0">
                    <Star size={40} className="fill-white/10" />
                </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
                
                {/* Left Column: Ratings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Évaluation</h2>
                            <p className="text-slate-400 font-medium">Attribuez des notes selon les critères suivants</p>
                        </div>

                        <div className="space-y-2">
                            <StarRating
                                label="Note globale"
                                value={formData.ratingOverall}
                                onChange={(value) => handleRatingChange('ratingOverall', value)}
                                required
                            />
                            <StarRating
                                label="Clarté des explications"
                                value={formData.ratingClarity}
                                onChange={(value) => handleRatingChange('ratingClarity', value)}
                            />
                            <StarRating
                                label="Matériel pédagogique"
                                value={formData.ratingMaterial}
                                onChange={(value) => handleRatingChange('ratingMaterial', value)}
                            />
                            <StarRating
                                label="Approche pédagogique"
                                value={formData.ratingPedagogy}
                                onChange={(value) => handleRatingChange('ratingPedagogy', value)}
                            />
                        </div>

                        <div className="space-y-4 pt-6">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-bold text-slate-700 block">Votre commentaire <span className="text-red-500">*</span></label>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                    formData.comment.length >= 10 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    {formData.comment.length} / 10 min
                                </span>
                            </div>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                rows={6}
                                placeholder="Partagez votre expérience détaillée avec ce cours..."
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#007AB8] transition-all resize-none italic"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Options & Submit */}
                <div className="space-y-8">
                    {/* Settings Card */}
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                             Paramètres
                        </h3>
                        
                        <label className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-50 cursor-pointer group hover:bg-slate-50 transition-colors">
                            <div className="relative pt-1">
                                <input
                                    type="checkbox"
                                    checked={formData.anonymous}
                                    onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                                    className="peer sr-only"
                                />
                                <div className="w-10 h-6 bg-slate-200 rounded-full peer-checked:bg-[#007AB8] transition-colors"></div>
                                <div className="absolute top-2 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-900 block mb-1">Anonymat</span>
                                <p className="text-xs text-slate-400">Masquer votre identité publiquement</p>
                            </div>
                        </label>

                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                            <AlertCircle size={18} className="text-[#007AB8] flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                                Votre avis sera modéré avant d'être publié. Assurez-vous d'être constructif.
                            </p>
                        </div>
                    </div>

                    {/* Submit Card */}
                    <div className="bg-[#007AB8] p-8 rounded-[32px] text-white space-y-6 shadow-xl shadow-blue-900/10">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Send size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Prêt à soumettre ?</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Une fois envoyé, votre avis contribuera à l'excellence académique de l'UAZ.
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || formData.ratingOverall === 0 || formData.comment.length < 10}
                            className="w-full py-4 bg-white text-[#007AB8] rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Envoi..." : "Soumettre mon avis"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
