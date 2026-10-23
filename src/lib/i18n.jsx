/**
 * Interface language: Kannada (default) or English.
 * Text is written inline as t('ಕನ್ನಡ', 'English') so both versions sit together.
 * Only the interface changes; K-Lipi code, lessons and examples stay in Kannada.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'kl_lang';

const LangContext = createContext({ lang: 'kn', setLang: () => {}, t: (kn) => kn });

const initialLang = () => {
    try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'kn'; } catch { return 'kn'; }
};

export function LangProvider({ children }) {
    const [lang, setLang] = useState(initialLang);

    useEffect(() => {
        document.documentElement.lang = lang;
        try { localStorage.setItem(KEY, lang); } catch { /* storage blocked */ }
    }, [lang]);

    const value = useMemo(() => ({
        lang,
        setLang,
        t: (kn, en) => (lang === 'en' && en ? en : kn),
    }), [lang]);

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
