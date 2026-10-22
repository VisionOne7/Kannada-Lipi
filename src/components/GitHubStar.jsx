import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

/**
 * "Star on GitHub" button with the live star count.
 * The count is cached for an hour so visitors stay well inside GitHub's
 * unauthenticated rate limit. If GitHub can't be reached, the button still
 * works without a number.
 */
export const REPO = 'VisionOne7/Kannada-Lipi';
export const REPO_URL = `https://github.com/${REPO}`;
const CACHE_KEY = 'kl_gh_stars';
const ONE_HOUR = 60 * 60 * 1000;

// Official GitHub mark (inline so it needs no extra request).
export const GitHubMark = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
);

const readCache = () => {
    try {
        const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
        return c && typeof c.count === 'number' ? c : null;
    } catch {
        return null;
    }
};

const formatCount = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

const GitHubStar = ({ className = '' }) => {
    const [count, setCount] = useState(() => readCache()?.count ?? null);

    useEffect(() => {
        const cached = readCache();
        if (cached && Date.now() - cached.at < ONE_HOUR) return undefined;
        const ctrl = new AbortController();
        fetch(`https://api.github.com/repos/${REPO}`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (d && typeof d.stargazers_count === 'number') {
                    setCount(d.stargazers_count);
                    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ count: d.stargazers_count, at: Date.now() })); } catch { /* ignore */ }
                }
            })
            .catch(() => { /* offline or rate-limited: keep the cached or empty count */ });
        return () => ctrl.abort();
    }, []);

    return (
        <a
            className={`gh-star ${className}`}
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="K-Lipi is open source. Star it on GitHub."
            aria-label={count !== null ? `Star K-Lipi on GitHub, ${count} stars` : 'Star K-Lipi on GitHub'}
        >
            <span className="gh-star-main"><GitHubMark size={16} /><Star size={13} /> <span className="gh-star-label">Star</span></span>
            {count !== null && <span className="gh-star-count">{formatCount(count)}</span>}
        </a>
    );
};

export default GitHubStar;
