import { useState } from 'react';
import { Save } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        appName: 'UAZ Student Feedback System',
        autoApproveReviews: false,
        enableProfanityFilter: true,
        maxUploadSize: 10,
        defaultPageSize: 20
    });

    const handleChange = (key, value) => {
        setSettings({
            ...settings,
            [key]: value
        });
    };

    const handleSave = () => {
        alert('Paramètres sauvegardés avec succès!');
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Paramètres</h1>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <div className="space-y-6">
                    {/* App Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'application
                        </label>
                        <input
                            type="text"
                            value={settings.appName}
                            onChange={(e) => handleChange('appName', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Auto Approve Reviews */}
                    <div>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={settings.autoApproveReviews}
                                onChange={(e) => handleChange('autoApproveReviews', e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Approbation automatique des avis
                            </span>
                        </label>
                    </div>

                    {/* Profanity Filter */}
                    <div>
                        <label className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={settings.enableProfanityFilter}
                                onChange={(e) => handleChange('enableProfanityFilter', e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Filtrage du langage inapproprié
                            </span>
                        </label>
                    </div>

                    {/* Max Upload Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taille maximale du fichier (MB)
                        </label>
                        <input
                            type="number"
                            value={settings.maxUploadSize}
                            onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Default Page Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre d'éléments par page
                        </label>
                        <input
                            type="number"
                            value={settings.defaultPageSize}
                            onChange={(e) => handleChange('defaultPageSize', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        <span>Sauvegarder</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
