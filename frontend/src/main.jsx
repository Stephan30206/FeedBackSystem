import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/**
 * Point d'entrée de l'application React
 *
 * Configuration:
 * - StrictMode activé pour détecter les problèmes potentiels
 * - Importation des styles globaux (index.css avec Tailwind)
 * - Montage du composant App principal
 */
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);