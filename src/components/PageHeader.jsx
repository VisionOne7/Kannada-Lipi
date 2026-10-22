import React from 'react';

/**
 * Standard page header used across the site: flag stripe, icon badge,
 * title and an optional subtitle. Keeps every page visually consistent.
 */
const PageHeader = ({ icon: Icon, title, subtitle, className = '', children }) => (
    <header className={`page-header ${className}`.trim()}>
        <h1 className="page-header-title">
            {Icon && <span className="page-header-icon"><Icon size={26} aria-hidden="true" /></span>}
            {title}
        </h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        {children}
    </header>
);

export default PageHeader;
