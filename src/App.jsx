import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OfflineNotice from './components/OfflineNotice';
import ErrorBoundary from './components/ErrorBoundary';
import { LangProvider, useLang } from './lib/i18n';
import BottomNav from './components/BottomNav';
import { usePref, applyTextSize } from './lib/prefs';
import { UI_EVENTS } from './lib/ui';
import { pageFor } from './data/pages';
import KarnatakaNav from './components/KarnatakaNav';
import { KARNATAKA_PATHS } from './data/karnatakaSections';

// Pages load on demand, so the first visit downloads only what it needs.
// Home stays in the main bundle because most visits start there.
const KarnatakaHub = lazy(() => import('./pages/KarnatakaHub'));
const Karnataka = lazy(() => import('./pages/Karnataka'));
const KarnatakaLinks = lazy(() => import('./pages/KarnatakaLinks'));
const Learn = lazy(() => import('./pages/Learn'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Games = lazy(() => import('./pages/Games'));
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'));
const Certificate = lazy(() => import('./pages/Certificate'));
const Kids = lazy(() => import('./pages/Kids'));
const Teachers = lazy(() => import('./pages/Teachers'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Schemes = lazy(() => import('./pages/Schemes'));
const Wonders = lazy(() => import('./pages/Wonders'));
const DistrictStats = lazy(() => import('./pages/DistrictStats'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Economy = lazy(() => import('./pages/Economy'));
const StudentResources = lazy(() => import('./pages/StudentResources'));
const EServices = lazy(() => import('./pages/EServices'));
const Embed = lazy(() => import('./pages/Embed'));
const Assignment = lazy(() => import('./pages/Assignment'));
const Progress = lazy(() => import('./pages/Progress'));
const ClassResults = lazy(() => import('./pages/ClassResults'));
// The search palette loads on first use only
const CommandPalette = lazy(() => import('./components/CommandPalette'));


// Shown for a moment while a page's code downloads: the page's shape, shimmering.
function PageLoader() {
    return (
        <div className="skeleton-page" role="status" aria-live="polite" aria-label="ಲೋಡ್ ಆಗುತ್ತಿದೆ">
            <div className="skeleton skeleton-title" />
            <div className="skeleton-row">
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
                <div className="skeleton skeleton-card" />
            </div>
        </div>
    );
}

// Browser tab title follows the page and the interface language.
function usePageTitle(pathname) {
    const { t } = useLang();
    useEffect(() => {
        const page = pageFor(pathname);
        const name = page ? t(page.kn, page.en) : t('ಪುಟ ಸಿಗಲಿಲ್ಲ', 'Page not found');
        document.title = pathname === '/' ? t('ಕನ್ನಡ ಲಿಪಿ — ಕನ್ನಡದಲ್ಲಿ ಕೋಡ್ ಮಾಡಿ', 'K-Lipi — code in Kannada') : `${name} · ಕನ್ನಡ ಲಿಪಿ`;
    }, [pathname, t]);
}

// Ctrl+K / ⌘K (or the header search button) opens the site-wide search.
function useCommandPalette() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        const onOpen = () => setOpen(true);
        window.addEventListener('keydown', onKey);
        window.addEventListener(UI_EVENTS.openPalette, onOpen);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener(UI_EVENTS.openPalette, onOpen);
        };
    }, []);
    return [open, () => setOpen(false)];
}

function AppShell() {
    // The /embed route renders bare (no header/footer) so it sits cleanly
    // inside a host site's <iframe>.
    const location = useLocation();
    const isEmbed = location.pathname === '/embed';
    const [textSize] = usePref('textSize');
    const [paletteOpen, closePalette] = useCommandPalette();
    usePageTitle(location.pathname);
    useEffect(() => { applyTextSize(textSize); }, [textSize]);

    if (isEmbed) {
        return (
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/embed" element={<Embed />} />
                </Routes>
            </Suspense>
        );
    }

    return (
        <div className="app-container">
            {/* Ambient flag-tinted glows behind everything — powers the frosted glass */}
            <div className="orb orb-1" aria-hidden="true"></div>
            <div className="orb orb-2" aria-hidden="true"></div>
            <div className="orb orb-3" aria-hidden="true"></div>
            <a href="#main" className="skip-link">ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ</a>
            <Header />
            <main className="main-content" id="main" tabIndex={-1}>
                {KARNATAKA_PATHS.includes(location.pathname) && <KarnatakaNav />}
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/karnataka" element={<KarnatakaHub />} />
                        <Route path="/karnataka/culture" element={<Karnataka />} />
                        <Route path="/links" element={<KarnatakaLinks />} />
                        <Route path="/learn" element={<Learn />} />
                        {/* Examples and Help now live inside the learning hub */}
                        <Route path="/examples" element={<Navigate to="/learn?tab=examples" replace />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/challenge" element={<DailyChallenge />} />
                        <Route path="/certificate" element={<Certificate />} />
                        <Route path="/kids" element={<Kids />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/assignment" element={<Assignment />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="/class" element={<ClassResults />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/help" element={<Navigate to="/learn?tab=reference" replace />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/schemes" element={<Schemes />} />
                        <Route path="/wonders" element={<Wonders />} />
                        <Route path="/districts" element={<DistrictStats />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/economy" element={<Economy />} />
                        <Route path="/student-resources" element={<StudentResources />} />
                        <Route path="/services" element={<EServices />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
            <OfflineNotice />
            <BottomNav />
            {paletteOpen && (
                <Suspense fallback={null}>
                    <CommandPalette onClose={closePalette} />
                </Suspense>
            )}
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <LangProvider>
                <Router>
                    <AppShell />
                </Router>
            </LangProvider>
        </ErrorBoundary>
    );
}

export default App;
