import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import OfflineNotice from './components/OfflineNotice';
import ErrorBoundary from './components/ErrorBoundary';

// Pages load on demand, so the first visit downloads only what it needs.
// Home stays in the main bundle because most visits start there.
const Karnataka = lazy(() => import('./pages/Karnataka'));
const KarnatakaLinks = lazy(() => import('./pages/KarnatakaLinks'));
const Learn = lazy(() => import('./pages/Learn'));
const Examples = lazy(() => import('./pages/Examples'));
const Help = lazy(() => import('./pages/Help'));
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


// Shown for a moment while a page's code downloads.
function PageLoader() {
    return (
        <div className="page-loader" role="status" aria-live="polite">
            <span className="page-loader-spinner" aria-hidden="true" />
            <span>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</span>
        </div>
    );
}

function AppShell() {
    // The /embed route renders bare (no header/footer) so it sits cleanly
    // inside a host site's <iframe>.
    const location = useLocation();
    const isEmbed = location.pathname === '/embed';

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
            <Header />
            <main className="main-content">
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/karnataka" element={<Karnataka />} />
                        <Route path="/links" element={<KarnatakaLinks />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/examples" element={<Examples />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="/challenge" element={<DailyChallenge />} />
                        <Route path="/certificate" element={<Certificate />} />
                        <Route path="/kids" element={<Kids />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/help" element={<Help />} />
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
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AppShell />
            </Router>
        </ErrorBoundary>
    );
}

export default App;
