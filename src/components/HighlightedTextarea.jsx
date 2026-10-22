import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { highlight } from '../lib/js/highlight.js';
import './HighlightedTextarea.css';

/**
 * A normal <textarea> with a syntax-coloured copy of its text drawn behind it.
 * Typing, selection, the on-screen keyboard and transliteration all keep using
 * the real textarea; only the colours come from the layer underneath.
 *
 * Props are passed straight to the textarea. `theme` is 'auto' (follows the
 * site theme) or 'dark' (for editors that always have a dark background).
 */
const COPY_STYLES = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'tabSize',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderLeftWidth',
    'borderRightWidth', 'borderBottomWidth', 'textIndent', 'wordSpacing'];

const HighlightedTextarea = forwardRef(({ value, theme = 'auto', className = '', onScroll, wrapperClassName = '', ...rest }, ref) => {
    const taRef = useRef(null);
    const layerRef = useRef(null);
    useImperativeHandle(ref, () => taRef.current);

    const html = useMemo(() => highlight(value || ''), [value]);

    // Mirror the textarea's font, padding and inner width onto the layer.
    useEffect(() => {
        const ta = taRef.current;
        const layer = layerRef.current;
        if (!ta || !layer) return undefined;
        const sync = () => {
            const cs = window.getComputedStyle(ta);
            COPY_STYLES.forEach((k) => { layer.style[k] = cs[k]; });
            layer.style.borderStyle = 'solid';
            layer.style.borderColor = 'transparent';
            layer.style.width = `${ta.clientWidth + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)}px`;
            layer.style.height = `${ta.offsetHeight}px`;
            layer.scrollTop = ta.scrollTop;
            layer.scrollLeft = ta.scrollLeft;
        };
        sync();
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
        ro && ro.observe(ta);
        window.addEventListener('resize', sync);
        return () => { ro && ro.disconnect(); window.removeEventListener('resize', sync); };
    }, []);

    // Keep the layer scrolled with the textarea after every change.
    useEffect(() => {
        const ta = taRef.current;
        const layer = layerRef.current;
        if (ta && layer) { layer.scrollTop = ta.scrollTop; layer.scrollLeft = ta.scrollLeft; }
    }, [html]);

    const handleScroll = (e) => {
        if (layerRef.current) {
            layerRef.current.scrollTop = e.target.scrollTop;
            layerRef.current.scrollLeft = e.target.scrollLeft;
        }
        onScroll && onScroll(e);
    };

    return (
        <div className={`hl-wrap hl-theme-${theme} ${wrapperClassName}`.trim()}>
            <pre ref={layerRef} className="hl-layer" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
            <textarea
                ref={taRef}
                value={value}
                className={`${className} hl-input`.trim()}
                onScroll={handleScroll}
                {...rest}
            />
        </div>
    );
});

HighlightedTextarea.displayName = 'HighlightedTextarea';
export default HighlightedTextarea;
