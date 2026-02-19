import { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Info } from 'lucide-react';

const Statistics = () => {
    const [loading, setLoading] = useState(true);
    const [ratingData, setRatingData] = useState([]);
    const [topCoursesData, setTopCoursesData] = useState([]);

    const COLORS = ['#007AB8', '#FFB800', '#003E5D', '#10b981', '#f59e0b', '#ef4444'];

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            const response = await courseService.getAllCourses();
            const courses = response.data;

            // 1. Calculate Rating Distribution (1 to 5 stars)
            const distribution = [
                { name: '5', value: 0 },
                { name: '4', value: 0 },
                { name: '3', value: 0 },
                { name: '2', value: 0 },
                { name: '1', value: 0 },
            ];

            courses.forEach(course => {
                if (course.avgRating) {
                    const rounded = Math.round(course.avgRating);
                    const item = distribution.find(d => d.name === rounded.toString());
                    if (item) item.value++;
                }
            });
            setRatingData(distribution);

            // 2. Get Top Courses for Doughnut
            const topCourses = courses
                .filter(c => c.avgRating && c.totalReviews > 0)
                .sort((a, b) => b.avgRating - a.avgRating)
                .slice(0, 5)
                .map(c => ({
                    name: c.name,
                    value: c.avgRating
                }));
            setTopCoursesData(topCourses);

        } catch (error) {
            console.error('Error loading stats:', error);
            toast.error('Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AB8] mb-4"></div>
                <p className="text-slate-500 font-medium">Analyse des données en cours...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Statistiques</h1>
                <p className="text-slate-500 font-medium">Analyse détaillée des retours étudiants</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Distribution des notes */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#007AB8]">
                            <BarChart3 size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Distribution des notes</h2>
                    </div>

                    <div className="h-[350px] w-full min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <BarChart data={ratingData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    fill="#1D3557" 
                                    radius={[8, 8, 0, 0]} 
                                    barSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top cours par satisfaction */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-[#FFB800]">
                            <PieIcon size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Top cours par satisfaction</h2>
                    </div>

                    <div className="h-[350px] w-full min-h-[350px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <PieChart>
                                <Pie
                                    data={topCoursesData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {topCoursesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend 
                                    layout="vertical" 
                                    align="right" 
                                    verticalAlign="middle"
                                    iconType="circle"
                                    formatter={(value, entry, index) => (
                                        <span className="text-slate-600 font-bold text-sm ml-2">
                                            {value} <span className="text-[#FFB800] ml-2">{topCoursesData[index].value.toFixed(1)}</span>
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Info size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-blue-900 mb-1">À propos de l'analyse</h3>
                    <p className="text-blue-700/70 text-sm leading-relaxed">
                        Ces données reflètent la moyenne des notes attribuées par les étudiants pour chaque cours ou service. 
                        Les classements sont mis à jour en temps réel après chaque modération d'avis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
