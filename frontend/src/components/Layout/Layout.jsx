import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header stays at the top */}
            <Header />

            {/* Main content area */}
            <main className="flex-1 mt-20 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <Outlet />
                </div>
            </main>
            
            <footer className="py-6 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-slate-400">
                    <p>© 2026 Université Adventiste Zurcher — Système de Feedback Étudiant</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-blue-600 transition-colors">Aide</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
