import { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { assets } from '../assets/admin_assets/assets';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: assets.usa_flag },
  { code: 'fr', label: 'French', flag: assets.frensh_flag },
  { code: 'ar', label: 'Arabic', flag: assets.ma_flag },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();
  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <div className="relative inline-block text-sm" dir="ltr">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 border rounded-full hover:bg-gray-50 transition focus:outline-none"
        aria-label={t('admin.changeLanguage', {}) || 'Change language'}
        aria-expanded={open}
      >
        <img src={currentLang ? currentLang.flag : assets.usa_flag} alt="" className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded shadow-lg z-50">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm ${l.code === lang ? 'bg-gray-100 font-bold text-black' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <img src={l.flag} alt="" className="w-4 h-4 mr-2" /> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
