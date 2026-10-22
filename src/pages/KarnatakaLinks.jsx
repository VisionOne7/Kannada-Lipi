import React, { useState, useMemo } from 'react';
import { Link as LinkIcon, ClipboardList, Search } from 'lucide-react';
import linksData from '../data/karnatakaLinks.json';
import './KarnatakaLinks.css';
import DataIcon from '../components/DataIcon';
import PageHeader from '../components/PageHeader';

const KarnatakaLinks = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { categories, links } = linksData;

    const filteredLinks = useMemo(() => {
        return links.filter(link => {
            const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
            const matchesSearch = searchQuery === '' ||
                link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                link.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (link.desc && link.desc.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, links]);

    const getCategoryById = (id) => {
        return categories.find(cat => cat.id === id);
    };

    const getCategoryName = (categoryId) => {
        const cat = getCategoryById(categoryId);
        return cat ? cat.name : categoryId;
    };

    const getCategoryIcon = (categoryId) => {
        const cat = getCategoryById(categoryId);
        return cat ? cat.icon : '';
    };

    return (
        <>
        <PageHeader
                icon={LinkIcon}
                title="ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು"
                subtitle="ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಜಾಲತಾಣಗಳು, ಸೇವೆಗಳು ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳ ಪಟ್ಟಿ. Official Karnataka government websites and services in one place."
            />
        <div className="links-page">


            {/* Search and Filter Section */}
            <div className="links-controls panel animate-in">
                <div className="links-search">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search links... (e.g., KPSC, BESCOM, Metro)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="links-categories">
                    <button
                        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        <span className="category-icon"><ClipboardList size={16} /></span>
                        <span className="category-label">All</span>
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span className="category-icon"><DataIcon value={category.icon} size={18} /></span>
                            <span className="category-label">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Count */}
            <div className="links-count">
                <span>{filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''} found</span>
                {selectedCategory !== 'all' && (
                    <span className="filter-badge">
                        in {getCategoryName(selectedCategory)}
                    </span>
                )}
            </div>

            {/* Links Grid */}
            <div className="links-grid">
                {filteredLinks.length > 0 ? (
                    filteredLinks.map((link, index) => (
                        <div
                            key={index}
                            className="link-card animate-in"
                            style={{ animationDelay: `${index * 0.03}s` }}
                        >
                            <div className="link-card-header">
                                <span className="link-icon"><DataIcon value={link.icon} size={22} /></span>
                                <div className="link-titles">
                                    <h3 className="link-name">{link.name}</h3>
                                    <p className="link-english">{link.english}</p>
                                </div>
                            </div>
                            <p className="link-desc">{link.desc}</p>
                            <div className="link-card-footer">
                                <span className="link-category-badge">
                                    <DataIcon value={getCategoryIcon(link.category)} size={13} className="data-icon data-icon-inline" /> {getCategoryName(link.category)}
                                </span>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-visit-btn"
                                >
                                    Visit
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-links animate-in">
                        <span className="no-links-icon"><Search size={48} /></span>
                        <h3>No links found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                        <button
                            className="reset-btn"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="links-stats animate-in">
                <h3>Directory Statistics</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">{links.length}</span>
                        <span className="stat-label">Total Links</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{categories.length}</span>
                        <span className="stat-label">Categories</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {links.filter(l => l.category === 'government').length}
                        </span>
                        <span className="stat-label">Government Portals</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {links.filter(l => l.category === 'exams').length}
                        </span>
                        <span className="stat-label">Exam/Recruitment</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default KarnatakaLinks;
