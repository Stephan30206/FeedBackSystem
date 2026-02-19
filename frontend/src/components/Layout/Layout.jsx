import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Composant Layout
 * Layout principal de l'application avec Header et Sidebar
 */
const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header fixe en haut */}
            <Header />

            <div className="flex">
                {/* Sidebar à gauche */}
                <Sidebar />

                {/* Contenu principal */}
                <main className="flex-1 p-6 ml-64 mt-16">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;