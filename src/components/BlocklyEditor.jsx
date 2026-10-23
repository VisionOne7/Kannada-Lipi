import React, { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import * as Kn from 'blockly/msg/kn';
import { Play, Code2, Trash2, ExternalLink } from 'lucide-react';
import { kannadaLipi } from '../lib/js/interpreter/index.js';
import { kn } from '../lib/js/interpreter/errors.js';
import { TURTLE_COLORS } from '../lib/js/interpreter/turtle.js';
import TurtleCanvas from './TurtleCanvas';
import OutputText from './OutputText';
import { encodeText } from '../lib/js/share.js';

/**
 * ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್: drag-and-drop Kannada blocks that generate real KannadaLipi
 * code, so a child can move from blocks to typed code in the same tool.
 */

Blockly.setLocale(Kn);

const WS_KEY = 'kl_blocks_ws';

// Karnataka warm palette for block categories.
const C = {
    move: '#D97706',
    turn: '#C2410C',
    loop: '#D71920',
    pen: '#9D174D',
    out: '#475569',
};

const COLOR_OPTIONS = Object.keys(TURTLE_COLORS).map((k) => [k, k]);

let defined = false;
function defineBlocks() {
    if (defined) return;
    defined = true;
    Blockly.common.defineBlocksWithJsonArray([
        { type: 'kl_forward', message0: 'ಮುಂದೆ ಹೋಗು %1 ಹೆಜ್ಜೆ', args0: [{ type: 'field_number', name: 'N', value: 100, min: -1000, max: 1000 }], previousStatement: null, nextStatement: null, colour: C.move, tooltip: 'ಆಮೆ ಮುಂದೆ ಹೋಗುತ್ತದೆ' },
        { type: 'kl_back', message0: 'ಹಿಂದೆ ಹೋಗು %1 ಹೆಜ್ಜೆ', args0: [{ type: 'field_number', name: 'N', value: 50, min: -1000, max: 1000 }], previousStatement: null, nextStatement: null, colour: C.move, tooltip: 'ಆಮೆ ಹಿಂದೆ ಹೋಗುತ್ತದೆ' },
        { type: 'kl_right', message0: 'ಬಲಕ್ಕೆ ತಿರುಗು %1 °', args0: [{ type: 'field_number', name: 'N', value: 90, min: -360, max: 360 }], previousStatement: null, nextStatement: null, colour: C.turn, tooltip: 'ಗಡಿಯಾರದ ದಿಕ್ಕಿನಲ್ಲಿ ತಿರುಗುತ್ತದೆ' },
        { type: 'kl_left', message0: 'ಎಡಕ್ಕೆ ತಿರುಗು %1 °', args0: [{ type: 'field_number', name: 'N', value: 90, min: -360, max: 360 }], previousStatement: null, nextStatement: null, colour: C.turn, tooltip: 'ಗಡಿಯಾರದ ವಿರುದ್ಧ ದಿಕ್ಕಿನಲ್ಲಿ ತಿರುಗುತ್ತದೆ' },
        { type: 'kl_home', message0: 'ಮಧ್ಯಕ್ಕೆ ಹಿಂತಿರುಗು', previousStatement: null, nextStatement: null, colour: C.move },
        { type: 'kl_repeat', message0: '%1 ಬಾರಿ ಪುನರಾವರ್ತಿಸು', args0: [{ type: 'field_number', name: 'N', value: 4, min: 1, max: 500, precision: 1 }], message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, nextStatement: null, colour: C.loop, tooltip: 'ಒಳಗಿನ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಮಾಡುತ್ತದೆ' },
        { type: 'kl_color', message0: 'ಬಣ್ಣ %1', args0: [{ type: 'field_dropdown', name: 'C', options: COLOR_OPTIONS }], previousStatement: null, nextStatement: null, colour: C.pen },
        { type: 'kl_width', message0: 'ಗೆರೆಯ ದಪ್ಪ %1', args0: [{ type: 'field_number', name: 'N', value: 4, min: 1, max: 40 }], previousStatement: null, nextStatement: null, colour: C.pen },
        { type: 'kl_penup', message0: 'ಪೆನ್ ಮೇಲೆತ್ತು', previousStatement: null, nextStatement: null, colour: C.pen, tooltip: 'ಗೆರೆ ಎಳೆಯದೆ ಚಲಿಸುತ್ತದೆ' },
        { type: 'kl_pendown', message0: 'ಪೆನ್ ಕೆಳಗಿಳಿಸು', previousStatement: null, nextStatement: null, colour: C.pen },
        { type: 'kl_circle', message0: 'ವೃತ್ತ ತ್ರಿಜ್ಯ %1', args0: [{ type: 'field_number', name: 'N', value: 40, min: 1, max: 300 }], previousStatement: null, nextStatement: null, colour: C.pen },
        { type: 'kl_dot', message0: 'ಚುಕ್ಕೆ ಗಾತ್ರ %1', args0: [{ type: 'field_number', name: 'N', value: 12, min: 1, max: 100 }], previousStatement: null, nextStatement: null, colour: C.pen },
        { type: 'kl_bg', message0: 'ಹಿನ್ನೆಲೆ ಬಣ್ಣ %1', args0: [{ type: 'field_dropdown', name: 'C', options: COLOR_OPTIONS }], previousStatement: null, nextStatement: null, colour: C.pen },
        { type: 'kl_print', message0: 'ಮುದ್ರಿಸು %1', args0: [{ type: 'field_input', name: 'T', text: 'ನಮಸ್ಕಾರ!' }], previousStatement: null, nextStatement: null, colour: C.out },
    ]);
}

const TOOLBOX = {
    kind: 'categoryToolbox',
    contents: [
        { kind: 'category', name: 'ಚಲನೆ', colour: C.move, contents: [
            { kind: 'block', type: 'kl_forward' }, { kind: 'block', type: 'kl_back' },
            { kind: 'block', type: 'kl_right' }, { kind: 'block', type: 'kl_left' },
            { kind: 'block', type: 'kl_home' },
        ] },
        { kind: 'category', name: 'ಲೂಪ್', colour: C.loop, contents: [{ kind: 'block', type: 'kl_repeat' }] },
        { kind: 'category', name: 'ಪೆನ್ & ಬಣ್ಣ', colour: C.pen, contents: [
            { kind: 'block', type: 'kl_color' }, { kind: 'block', type: 'kl_width' },
            { kind: 'block', type: 'kl_penup' }, { kind: 'block', type: 'kl_pendown' },
            { kind: 'block', type: 'kl_circle' }, { kind: 'block', type: 'kl_dot' },
            { kind: 'block', type: 'kl_bg' },
        ] },
        { kind: 'category', name: 'ಮುದ್ರಣ', colour: C.out, contents: [{ kind: 'block', type: 'kl_print' }] },
    ],
};

const STARTER = {
    blocks: {
        languageVersion: 0,
        blocks: [{
            type: 'kl_color', x: 30, y: 30, fields: { C: 'ಕೆಂಪು' },
            next: { block: {
                type: 'kl_repeat', fields: { N: 4 },
                inputs: { DO: { block: {
                    type: 'kl_forward', fields: { N: 100 },
                    next: { block: { type: 'kl_right', fields: { N: 90 } } },
                } } },
            } },
        }],
    },
};

const LOOP_VARS = ['ಸಲ', 'ಸಲ೨', 'ಸಲ೩', 'ಸಲ೪', 'ಸಲ೫', 'ಸಲ೬'];

// Walk the blocks and emit KannadaLipi code (with Kannada digits).
function generate(workspace) {
    const lines = [];
    const num = (b, f = 'N') => kn(Number(b.getFieldValue(f)) || 0);
    const emit = (block, depth) => {
        const pad = '    '.repeat(depth);
        for (let b = block; b; b = b.getNextBlock()) {
            if (!b.isEnabled()) continue;
            switch (b.type) {
                case 'kl_forward': lines.push(`${pad}ಮುಂದೆ(${num(b)})`); break;
                case 'kl_back': lines.push(`${pad}ಹಿಂದೆ(${num(b)})`); break;
                case 'kl_right': lines.push(`${pad}ಬಲಕ್ಕೆ(${num(b)})`); break;
                case 'kl_left': lines.push(`${pad}ಎಡಕ್ಕೆ(${num(b)})`); break;
                case 'kl_home': lines.push(`${pad}ಮನೆಗೆ()`); break;
                case 'kl_color': lines.push(`${pad}ಬಣ್ಣ("${b.getFieldValue('C')}")`); break;
                case 'kl_bg': lines.push(`${pad}ಹಿನ್ನೆಲೆ("${b.getFieldValue('C')}")`); break;
                case 'kl_width': lines.push(`${pad}ದಪ್ಪ(${num(b)})`); break;
                case 'kl_penup': lines.push(`${pad}ಪೆನ್_ಮೇಲೆ()`); break;
                case 'kl_pendown': lines.push(`${pad}ಪೆನ್_ಕೆಳಗೆ()`); break;
                case 'kl_circle': lines.push(`${pad}ವೃತ್ತ(${num(b)})`); break;
                case 'kl_dot': lines.push(`${pad}ಚುಕ್ಕೆ(${num(b)})`); break;
                case 'kl_print': {
                    const text = String(b.getFieldValue('T') || '').replace(/["\\]/g, '');
                    lines.push(`${pad}ಮುದ್ರಿಸು("${text}")`);
                    break;
                }
                case 'kl_repeat': {
                    const v = LOOP_VARS[Math.min(depth, LOOP_VARS.length - 1)];
                    lines.push(`${pad}ಪುನರಾವರ್ತನೆ ${v} ೧ ರಿಂದ ${num(b)} ವರೆಗೆ: {`);
                    emit(b.getInputTargetBlock('DO'), depth + 1);
                    lines.push(`${pad}}`);
                    break;
                }
                default: break;
            }
        }
    };
    workspace.getTopBlocks(true).forEach((top) => emit(top, 0));
    return lines.join('\n');
}

const BlocklyEditor = () => {
    const divRef = useRef(null);
    const wsRef = useRef(null);
    const [code, setCode] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        defineBlocks();
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        const theme = Blockly.Theme.defineTheme(dark ? 'kl-dark' : 'kl-light', {
            base: Blockly.Themes.Classic,
            fontStyle: { family: "'Noto Sans Kannada', 'Outfit', sans-serif", size: 13, weight: '600' },
            componentStyles: dark ? {
                workspaceBackgroundColour: '#1b1b2a',
                toolboxBackgroundColour: '#23233a',
                toolboxForegroundColour: '#f2f2f2',
                flyoutBackgroundColour: '#2a2a44',
                flyoutForegroundColour: '#f2f2f2',
                scrollbarColour: '#FFD700',
                insertionMarkerColour: '#FFD700',
            } : {
                workspaceBackgroundColour: '#FFFDF6',
                toolboxBackgroundColour: '#FFF4CC',
                toolboxForegroundColour: '#3b2a00',
                flyoutBackgroundColour: '#FFF8E1',
                flyoutForegroundColour: '#3b2a00',
                scrollbarColour: '#D71920',
                insertionMarkerColour: '#D71920',
            },
        });
        const ws = Blockly.inject(divRef.current, {
            toolbox: TOOLBOX,
            renderer: 'zelos',
            theme,
            trashcan: true,
            sounds: false,
            zoom: { controls: true, wheel: false, startScale: 0.9 },
            move: { scrollbars: true, drag: true, wheel: true },
            grid: { spacing: 24, length: 2, colour: dark ? '#2e2e48' : '#efe6c8', snap: true },
        });
        wsRef.current = ws;

        let saved = null;
        try { saved = JSON.parse(localStorage.getItem(WS_KEY) || 'null'); } catch { saved = null; }
        try {
            Blockly.serialization.workspaces.load(saved || STARTER, ws);
        } catch {
            Blockly.serialization.workspaces.load(STARTER, ws);
        }
        setCode(generate(ws));

        const onChange = (e) => {
            if (e.isUiEvent) return;
            setCode(generate(ws));
            try { localStorage.setItem(WS_KEY, JSON.stringify(Blockly.serialization.workspaces.save(ws))); } catch { /* ignore */ }
        };
        ws.addChangeListener(onChange);

        const onResize = () => Blockly.svgResize(ws);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            ws.dispose();
        };
    }, []);

    const run = () => {
        const c = generate(wsRef.current);
        setCode(c);
        setResult(kannadaLipi.execute(c));
    };

    const clearAll = () => {
        if (!window.confirm('ಎಲ್ಲಾ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಅಳಿಸಬೇಕೇ?')) return;
        wsRef.current.clear();
        setResult(null);
    };

    return (
        <div className="blocks-layout">
            <div className="blocks-main">
                <div className="blocks-toolbar">
                    <button type="button" className="btn btn-primary kids-run" onClick={run}><Play size={18} /> ರನ್ ಮಾಡಿ</button>
                    <button type="button" className="btn btn-secondary" onClick={clearAll}><Trash2 size={16} /> ಎಲ್ಲಾ ಅಳಿಸಿ</button>
                </div>
                <div ref={divRef} className="blocks-workspace" aria-label="ಬ್ಲಾಕ್ ಕೋಡಿಂಗ್ ಕಾರ್ಯಕ್ಷೇತ್ರ" />
            </div>
            <aside className="blocks-side">
                <div className="glass-card blocks-stage">
                    <TurtleCanvas turtle={result?.turtle || null} />
                    {result && result.output && (
                        <div className="kids-output"><OutputText text={result.output} /></div>
                    )}
                </div>
                <div className="glass-card blocks-code">
                    <div className="blocks-code-head">
                        <span><Code2 size={16} /> ಇದೇ ಕನ್ನಡ ಲಿಪಿ ಕೋಡ್</span>
                        <a className="blocks-open" href={`/?code=${encodeText(code)}`} title="ಮುಖ್ಯ ಎಡಿಟರ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ">
                            <ExternalLink size={14} /> ಎಡಿಟರ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ
                        </a>
                    </div>
                    <pre>{code || '# ಬ್ಲಾಕ್‌ಗಳನ್ನು ಎಳೆದು ತನ್ನಿ'}</pre>
                </div>
            </aside>
        </div>
    );
};

export default BlocklyEditor;
