import { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

const locales = { en, fr, ar };
const DEFAULT = 'en';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem('lang') || DEFAULT; } catch { return DEFAULT; }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');
    try { localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  const setLang = (newLang) => {
    setLangState(newLang);
  };

  const t = (key, params = {}) => {
    const dict = locales[lang] || locales[DEFAULT];
    const path = key.split('.');
    let val = path.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), dict);
    if (val === undefined) val = key;
    return val.replace(/\{\{(\w+)\}\}/g, (_, p) => params[p] !== undefined ? params[p] : `{{${p}}}`);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { lang: 'en', setLang: () => {}, t: (key) => key };
  }
  return context;
}

export default LanguageContext;
