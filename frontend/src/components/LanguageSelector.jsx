import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = React.useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'kn', name: 'ಕನ್ನಡ' }
    ];

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-selector-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageSelect = (code) => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative language-selector-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all"
            >
                <Globe size={18} className="text-slate-600" />
                <div className="flex-1 text-left">
                    <p className="text-xs text-slate-500 font-medium">Language</p>
                    <p className="text-sm font-semibold text-slate-900">
                        {languages.find(l => l.code === language)?.name}
                    </p>
                </div>
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageSelect(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 transition-colors ${language === lang.code ? 'bg-sky-50 border-l-4 border-sky-500' : ''
                                }`}
                        >
                            <span className={`text-sm font-medium ${language === lang.code ? 'text-sky-700' : 'text-slate-700'
                                }`}>
                                {lang.name}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

