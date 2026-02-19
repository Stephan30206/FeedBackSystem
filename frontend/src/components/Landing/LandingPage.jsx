import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BarChart2, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-container min-h-screen flex flex-col font-sans">
      {/* Hero Section */}
      <section className="hero-section relative h-[600px] flex items-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets%2Ffd83029a96054d8f9a95725f42ef278a%2F5a4a015578914447bb722f8b62f48985?format=webp&width=1600" 
            alt="University Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/80 bg-gradient-to-r from-blue-950/90 to-blue-900/60"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-full border border-white/20">
              <span className="text-xs font-semibold tracking-wider uppercase">Université Adventiste Zurcher</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Votre voix compte. <br />
              <span className="text-yellow-500">Améliorons l'enseignement ensemble.</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
              Évaluez vos cours, partagez vos retours et contribuez à l'excellence académique de l'UAZ.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/login" 
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg"
              >
                Donner mon avis <ArrowRight size={20} />
              </Link>
              <Link 
                to="/register" 
                className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">Comment ça fonctionne</h2>
            <p className="text-slate-600">Un processus simple pour améliorer la qualité académique</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-8">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-4">Évaluez vos cours</h3>
              <p className="text-slate-600 leading-relaxed">
                Donnez votre avis de manière simple et anonyme sur les cours et services du campus.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-8">
                <BarChart2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-4">Statistiques détaillées</h3>
              <p className="text-slate-600 leading-relaxed">
                Visualisez les tendances, notes moyennes et classements pour une amélioration continue.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card bg-white p-10 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-8">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-4">Anonymat garanti</h3>
              <p className="text-slate-600 leading-relaxed">
                Vos avis restent confidentiels. Choisissez librement d'être visible ou anonyme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-container py-10 border-t border-slate-200 mt-auto bg-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
            <p className="text-slate-500 text-sm">
              © 2026 Université Adventiste Zurcher — Système de Feedback Étudiant
            </p>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Aide</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
