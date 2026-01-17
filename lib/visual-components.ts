// ═══════════════════════════════════════════════════════════════════════════════
// WP OPTIMIZER PRO v30.0 — ENTERPRISE VISUAL COMPONENTS LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
// 
// 20+ BEAUTIFUL, MODERN, ENGAGING VISUAL COMPONENTS
// - Theme-adaptive (works on ANY WordPress theme)
// - Mobile-responsive
// - Accessibility-friendly
// - SEO-optimized with Schema.org markup
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function escapeHtml(str: string): string {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function generateUniqueId(): string {
    return `wpo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 THEME-ADAPTIVE CSS
// ═══════════════════════════════════════════════════════════════════════════════

export const THEME_ADAPTIVE_CSS = `
<style>
.wpo-content {
  --wpo-primary: #6366f1;
  --wpo-primary-dark: #4f46e5;
  --wpo-success: #10b981;
  --wpo-warning: #f59e0b;
  --wpo-danger: #ef4444;
  --wpo-info: #3b82f6;
  --wpo-purple: #8b5cf6;
  --wpo-pink: #ec4899;
  --wpo-bg-subtle: rgba(128, 128, 128, 0.06);
  --wpo-border: rgba(128, 128, 128, 0.15);
  --wpo-text: inherit;
  --wpo-text-muted: rgba(128, 128, 128, 0.7);
  --wpo-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-family: var(--wpo-font);
  line-height: 1.8;
  font-size: clamp(16px, 2.5vw, 18px);
  color: var(--wpo-text);
}

/* Headings */
.wpo-content h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  line-height: 1.3;
  margin: 3rem 0 1.5rem;
  letter-spacing: -0.025em;
}
.wpo-content h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  line-height: 1.4;
  margin: 2.5rem 0 1rem;
}
.wpo-content h4 {
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  font-weight: 600;
  line-height: 1.4;
  margin: 2rem 0 0.75rem;
}

/* Text */
.wpo-content p {
  margin: 0 0 1.25rem;
  line-height: 1.9;
}
.wpo-content ul, .wpo-content ol {
  margin: 1.25rem 0;
  padding-left: 1.75rem;
}
.wpo-content li {
  margin: 0.6rem 0;
  line-height: 1.8;
}

/* Links */
.wpo-content a {
  color: var(--wpo-primary);
  text-decoration: underline;
  text-decoration-color: rgba(99, 102, 241, 0.3);
  text-underline-offset: 3px;
  transition: all 0.2s ease;
}
.wpo-content a:hover {
  text-decoration-color: var(--wpo-primary);
  color: var(--wpo-primary-dark);
}

/* Base Box Styles */
.wpo-box {
  border-radius: 20px;
  padding: 28px;
  margin: 40px 0;
  border: 1px solid var(--wpo-border);
  background: var(--wpo-bg-subtle);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.wpo-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
}

/* Responsive */
@media (max-width: 768px) {
  .wpo-content { font-size: 16px; }
  .wpo-content h2 { font-size: 1.5rem; margin: 2rem 0 1rem; }
  .wpo-content h3 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
  .wpo-box { padding: 20px; margin: 28px 0; border-radius: 16px; }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .wpo-content {
    --wpo-bg-subtle: rgba(255, 255, 255, 0.05);
    --wpo-border: rgba(255, 255, 255, 0.1);
  }
}

/* Animation keyframes */
@keyframes wpo-fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.wpo-animate {
  animation: wpo-fadeIn 0.4s ease-out;
}
</style>
`;

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 1: QUICK ANSWER BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createQuickAnswerBox(answer: string, title: string = 'Quick Answer'): string {
    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 24px; padding: 36px; margin: 48px 0; color: white; box-shadow: 0 24px 48px rgba(102,126,234,0.35);">
    <div style="display: flex; align-items: flex-start; gap: 24px;">
        <div style="min-width: 68px; height: 68px; background: rgba(255,255,255,0.2); backdrop-filter: blur(12px); border-radius: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <span style="font-size: 32px;">⚡</span>
        </div>
        <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; opacity: 0.9; margin-bottom: 12px;">${escapeHtml(title)}</div>
            <p style="font-size: 19px; line-height: 1.75; margin: 0; font-weight: 500;">${answer}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 2: PRO TIP BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createProTipBox(tip: string, title: string = 'Pro Tip'): string {
    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border: none; border-radius: 24px; padding: 32px; margin: 44px 0; color: white; box-shadow: 0 20px 44px rgba(17,153,142,0.3);">
    <div style="display: flex; align-items: flex-start; gap: 20px;">
        <div style="min-width: 58px; height: 58px; background: rgba(255,255,255,0.2); backdrop-filter: blur(12px); border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 28px;">💡</span>
        </div>
        <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; opacity: 0.9; margin-bottom: 10px;">${escapeHtml(title)}</div>
            <p style="font-size: 17px; line-height: 1.75; margin: 0; font-weight: 500;">${tip}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 3: WARNING BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createWarningBox(warning: string, title: string = 'Warning'): string {
    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 24px; padding: 32px; margin: 44px 0; color: white; box-shadow: 0 20px 44px rgba(245,87,108,0.3);">
    <div style="display: flex; align-items: flex-start; gap: 20px;">
        <div style="min-width: 58px; height: 58px; background: rgba(255,255,255,0.2); backdrop-filter: blur(12px); border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 28px;">⚠️</span>
        </div>
        <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; opacity: 0.9; margin-bottom: 10px;">${escapeHtml(title)}</div>
            <p style="font-size: 17px; line-height: 1.75; margin: 0; font-weight: 500;">${warning}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 4: EXPERT QUOTE BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createExpertQuoteBox(quote: string, author: string, title?: string): string {
    return `
<blockquote class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%); border: 2px solid rgba(99,102,241,0.15); border-left: 5px solid #6366f1; border-radius: 0 24px 24px 0; padding: 32px 36px; margin: 48px 0; font-style: normal;">
    <div style="font-size: 48px; color: #6366f1; opacity: 0.4; line-height: 1; margin-bottom: 16px; font-family: Georgia, serif;">"</div>
    <p style="font-size: 20px; line-height: 1.85; font-style: italic; margin: 0 0 24px 0; color: inherit;">${quote}</p>
    <footer style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 8px 20px rgba(99,102,241,0.3);">👤</div>
        <div>
            <cite style="font-style: normal; font-weight: 800; font-size: 16px; display: block; color: inherit;">${escapeHtml(author)}</cite>
            ${title ? `<span style="font-size: 14px; opacity: 0.6;">${escapeHtml(title)}</span>` : ''}
        </div>
    </footer>
</blockquote>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 5: HIGHLIGHT BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createHighlightBox(text: string, icon: string = '✨', bgColor: string = '#6366f1'): string {
    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}cc 100%); border: none; border-radius: 24px; padding: 32px 36px; margin: 48px 0; color: white; box-shadow: 0 20px 48px ${bgColor}40;">
    <div style="display: flex; align-items: center; gap: 20px;">
        <span style="font-size: 42px; flex-shrink: 0; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">${icon}</span>
        <p style="font-size: 19px; line-height: 1.75; margin: 0; font-weight: 600;">${text}</p>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 6: CALLOUT BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createCalloutBox(text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): string {
    const configs = {
        info: { bg: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)', border: '#3b82f6', icon: 'ℹ️', label: 'Info' },
        success: { bg: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.05) 100%)', border: '#10b981', icon: '✅', label: 'Success' },
        warning: { bg: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)', border: '#f59e0b', icon: '⚡', label: 'Note' },
        error: { bg: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(220,38,38,0.05) 100%)', border: '#ef4444', icon: '🔥', label: 'Important' }
    };
    const c = configs[type];
    
    return `
<div class="wpo-box wpo-animate" style="background: ${c.bg}; border: 2px solid ${c.border}25; border-left: 5px solid ${c.border}; border-radius: 0 20px 20px 0; padding: 24px 28px; margin: 40px 0;">
    <div style="display: flex; align-items: flex-start; gap: 16px;">
        <span style="font-size: 26px; flex-shrink: 0; margin-top: 2px;">${c.icon}</span>
        <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: ${c.border}; margin-bottom: 8px;">${c.label}</div>
            <p style="font-size: 16px; line-height: 1.75; margin: 0; color: inherit;">${text}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 7: STATISTICS BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createStatisticsBox(stats: Array<{ value: string; label: string; icon?: string }>): string {
    if (!stats || stats.length === 0) return '';
    
    const statItems = stats.map(stat => `
        <div style="flex: 1; min-width: 150px; text-align: center; padding: 32px 20px; background: rgba(255,255,255,0.7); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); transition: transform 0.2s ease;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 20px; margin-bottom: 12px;">${stat.icon || '📊'}</div>
            <div style="font-size: 42px; font-weight: 900; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; line-height: 1;">${escapeHtml(stat.value)}</div>
            <div style="font-size: 14px; opacity: 0.7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${escapeHtml(stat.label)}</div>
        </div>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%); border: 2px solid rgba(99,102,241,0.12); border-radius: 28px; padding: 32px; margin: 56px 0;">
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
        ${statItems}
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 8: DATA TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export function createDataTable(title: string, headers: string[], rows: string[][], sourceNote?: string): string {
    if (!rows || rows.length === 0) return '';
    
    const headerCells = headers.map(h => `
        <th style="padding: 16px 20px; text-align: left; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%); border-bottom: 2px solid rgba(99,102,241,0.2); color: #6366f1;">${escapeHtml(h)}</th>
    `).join('');
    
    const tableRows = rows.map((row, i) => {
        const cells = row.map((cell, j) => `
            <td style="padding: 16px 20px; font-size: 15px; border-bottom: 1px solid rgba(128,128,128,0.1); ${j === 0 ? 'font-weight: 600;' : ''}">${escapeHtml(cell)}</td>
        `).join('');
        return `<tr style="background: ${i % 2 === 0 ? 'transparent' : 'rgba(128,128,128,0.03)'}; transition: background 0.2s;" onmouseover="this.style.background='rgba(99,102,241,0.05)'" onmouseout="this.style.background='${i % 2 === 0 ? 'transparent' : 'rgba(128,128,128,0.03)'}'">${cells}</tr>`;
    }).join('');

    return `
<div class="wpo-box wpo-animate" style="border: 2px solid rgba(128,128,128,0.12); border-radius: 24px; overflow: hidden; margin: 56px 0; box-shadow: 0 8px 32px rgba(0,0,0,0.06); padding: 0;">
    <div style="padding: 24px 28px; background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%); border-bottom: 1px solid rgba(128,128,128,0.1);">
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(99,102,241,0.3);">
                <span style="font-size: 26px;">📊</span>
            </div>
            <div>
                <h3 style="font-size: 20px; font-weight: 800; margin: 0;">${escapeHtml(title)}</h3>
                ${sourceNote ? `<p style="font-size: 13px; opacity: 0.6; margin: 6px 0 0 0;">Source: ${escapeHtml(sourceNote)}</p>` : ''}
            </div>
        </div>
    </div>
    <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; min-width: 500px;">
            <thead><tr>${headerCells}</tr></thead>
            <tbody>${tableRows}</tbody>
        </table>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 9: CHECKLIST BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createChecklistBox(title: string, items: string[], icon: string = '✅'): string {
    if (!items || items.length === 0) return '';
    
    const checkItems = items.map((item, i) => `
        <li style="display: flex; align-items: flex-start; gap: 16px; padding: 16px 0; ${i < items.length - 1 ? 'border-bottom: 1px solid rgba(16,185,129,0.12);' : ''}">
            <span style="font-size: 22px; flex-shrink: 0; margin-top: 2px;">${icon}</span>
            <span style="font-size: 16px; line-height: 1.7; color: inherit;">${escapeHtml(item)}</span>
        </li>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(34,197,94,0.03) 100%); border: 2px solid rgba(16,185,129,0.18); border-radius: 24px; padding: 32px; margin: 48px 0;">
    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(16,185,129,0.3);">
            <span style="font-size: 26px;">📝</span>
        </div>
        <h3 style="font-size: 22px; font-weight: 800; margin: 0;">${escapeHtml(title)}</h3>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">${checkItems}</ul>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 10: STEP-BY-STEP BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createStepByStepBox(title: string, steps: Array<{ title: string; description: string }>): string {
    if (!steps || steps.length === 0) return '';
    
    const stepItems = steps.map((step, i) => `
        <div style="display: flex; gap: 24px; ${i < steps.length - 1 ? 'padding-bottom: 28px; margin-bottom: 28px; border-bottom: 2px dashed rgba(99,102,241,0.2);' : ''}">
            <div style="flex-shrink: 0;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 900; box-shadow: 0 10px 24px rgba(99,102,241,0.35);">${i + 1}</div>
            </div>
            <div style="flex: 1; padding-top: 8px;">
                <h4 style="font-size: 18px; font-weight: 800; margin: 0 0 10px 0; color: inherit;">${escapeHtml(step.title)}</h4>
                <p style="font-size: 15px; line-height: 1.8; margin: 0; opacity: 0.85;">${escapeHtml(step.description)}</p>
            </div>
        </div>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.03) 100%); border: 2px solid rgba(99,102,241,0.15); border-radius: 28px; padding: 36px; margin: 56px 0;">
    <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 32px;">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 28px rgba(99,102,241,0.3);">
            <span style="font-size: 28px;">📋</span>
        </div>
        <h3 style="font-size: 24px; font-weight: 800; margin: 0;">${escapeHtml(title)}</h3>
    </div>
    ${stepItems}
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 11: COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

export function createComparisonTable(title: string, headers: [string, string], rows: Array<[string, string]>): string {
    if (!rows || rows.length === 0) return '';
    
    const tableRows = rows.map((row) => `
        <tr style="border-bottom: 1px solid rgba(128,128,128,0.1);">
            <td style="padding: 18px 24px; font-weight: 500; background: rgba(239,68,68,0.04); width: 50%; vertical-align: top;">
                <span style="color: #ef4444; margin-right: 10px; font-size: 18px;">✗</span>
                <span style="color: inherit;">${escapeHtml(row[0])}</span>
            </td>
            <td style="padding: 18px 24px; background: rgba(16,185,129,0.04); width: 50%; vertical-align: top;">
                <span style="color: #10b981; margin-right: 10px; font-size: 18px;">✓</span>
                <span style="color: inherit;">${escapeHtml(row[1])}</span>
            </td>
        </tr>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="border: 2px solid rgba(128,128,128,0.12); border-radius: 24px; overflow: hidden; margin: 48px 0; padding: 0;">
    <div style="padding: 24px 28px; background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%); border-bottom: 1px solid rgba(128,128,128,0.1);">
        <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 28px;">⚖️</span>
            <h3 style="font-size: 20px; font-weight: 800; margin: 0;">${escapeHtml(title)}</h3>
        </div>
    </div>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: rgba(128,128,128,0.05);">
                <th style="padding: 16px 24px; text-align: left; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #ef4444;">${escapeHtml(headers[0])}</th>
                <th style="padding: 16px 24px; text-align: left; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #10b981;">${escapeHtml(headers[1])}</th>
            </tr>
        </thead>
        <tbody>${tableRows}</tbody>
    </table>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 12: DEFINITION BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createDefinitionBox(term: string, definition: string): string {
    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(37,99,235,0.03) 100%); border-left: 6px solid #3b82f6; border-radius: 0 20px 20px 0; padding: 28px 32px; margin: 44px 0;">
    <div style="display: flex; align-items: flex-start; gap: 20px;">
        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 20px rgba(59,130,246,0.3);">
            <span style="font-size: 26px;">📖</span>
        </div>
        <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; margin-bottom: 8px;">Definition</div>
            <h4 style="font-size: 20px; font-weight: 800; margin: 0 0 12px 0; color: inherit;">${escapeHtml(term)}</h4>
            <p style="font-size: 16px; line-height: 1.8; margin: 0; opacity: 0.9;">${definition}</p>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 13: KEY TAKEAWAYS
// ═══════════════════════════════════════════════════════════════════════════════

export function createKeyTakeaways(takeaways: string[]): string {
    if (!takeaways || takeaways.length === 0) return '';
    
    const items = takeaways.map((t, i) => `
        <li style="display: flex; align-items: flex-start; gap: 18px; padding: 20px 0; ${i < takeaways.length - 1 ? 'border-bottom: 1px solid rgba(99,102,241,0.12);' : ''}">
            <span style="min-width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 16px; font-weight: 900; flex-shrink: 0; box-shadow: 0 6px 16px rgba(102,126,234,0.35);">${i + 1}</span>
            <span style="font-size: 17px; line-height: 1.7; padding-top: 8px; color: inherit;">${escapeHtml(t)}</span>
        </li>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.05) 100%); border: 2px solid rgba(99,102,241,0.18); border-radius: 28px; padding: 40px; margin: 56px 0;">
    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 2px solid rgba(99,102,241,0.12);">
        <div style="width: 68px; height: 68px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 14px 32px rgba(102,126,234,0.35);">
            <span style="font-size: 32px;">🎯</span>
        </div>
        <div>
            <h3 style="font-size: 26px; font-weight: 900; margin: 0; color: inherit;">Key Takeaways</h3>
            <p style="font-size: 15px; opacity: 0.6; margin: 6px 0 0 0;">The essential points to remember</p>
        </div>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">${items}</ul>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 14: FAQ ACCORDION
// ═══════════════════════════════════════════════════════════════════════════════

export function createFAQAccordion(faqs: Array<{ question: string; answer: string }>): string {
    if (!faqs || faqs.length === 0) return '';
    
    const sectionId = generateUniqueId();
    
    const faqItems = faqs.map((faq, index) => {
        const itemId = `${sectionId}-${index}`;
        return `
        <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question" class="wpo-faq-item" style="border: 2px solid rgba(128,128,128,0.1); border-radius: 16px; margin-bottom: 14px; overflow: hidden; background: white; transition: all 0.3s ease;" onmouseover="this.style.borderColor='rgba(99,102,241,0.3)'" onmouseout="this.style.borderColor='rgba(128,128,128,0.1)'">
            <button 
                onclick="var content = this.nextElementSibling; var arrow = this.querySelector('.wpo-faq-arrow'); var isOpen = content.style.maxHeight && content.style.maxHeight !== '0px'; content.style.maxHeight = isOpen ? '0px' : content.scrollHeight + 'px'; arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)'; this.parentElement.style.background = isOpen ? 'white' : 'rgba(99,102,241,0.02)';"
                style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 22px 28px; cursor: pointer; font-size: 17px; font-weight: 700; gap: 18px; background: none; border: none; text-align: left; font-family: inherit; color: inherit; transition: background 0.2s;"
            >
                <span itemprop="name" style="flex: 1; line-height: 1.5;">${escapeHtml(faq.question)}</span>
                <span class="wpo-faq-arrow" style="font-size: 14px; color: #6366f1; transition: transform 0.3s ease; flex-shrink: 0; width: 32px; height: 32px; background: rgba(99,102,241,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;">▼</span>
            </button>
            <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer" style="max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out; background: linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.02) 100%);">
                <div itemprop="text" style="padding: 24px 28px; font-size: 16px; line-height: 1.9; color: inherit; border-top: 1px solid rgba(128,128,128,0.08);">${faq.answer}</div>
            </div>
        </div>`;
    }).join('');

    return `
<section id="${sectionId}" itemscope itemtype="https://schema.org/FAQPage" class="wpo-animate" style="margin: 64px 0;">
    <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 32px;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 28px rgba(99,102,241,0.3);">
            <span style="font-size: 30px;">❓</span>
        </div>
        <div>
            <h2 style="font-size: 28px; font-weight: 900; margin: 0; color: inherit;">Frequently Asked Questions</h2>
            <p style="font-size: 15px; opacity: 0.6; margin: 6px 0 0 0;">${faqs.length} questions answered by experts</p>
        </div>
    </div>
    <div class="wpo-faq-container">
        ${faqItems}
    </div>
</section>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎬 VISUAL COMPONENT 15: YOUTUBE EMBED
// ═══════════════════════════════════════════════════════════════════════════════

export interface YouTubeVideoData {
    videoId: string;
    title: string;
    channel: string;
    views: number;
    duration?: string;
    thumbnailUrl: string;
    embedUrl: string;
    relevanceScore: number;
}

export function createYouTubeEmbed(video: YouTubeVideoData): string {
    if (!video || !video.videoId) {
        console.error('createYouTubeEmbed: Invalid video data', video);
        return '';
    }
    
    return `
<div class="wpo-box wpo-animate" style="margin: 56px 0; border-radius: 24px; overflow: hidden; box-shadow: 0 24px 56px rgba(0,0,0,0.18); border: none; padding: 0;">
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000;">
        <iframe 
            src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&showinfo=0" 
            title="${escapeHtml(video.title)}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen
            loading="lazy"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        ></iframe>
    </div>
    <div style="padding: 24px 28px; background: linear-gradient(135deg, rgba(255,0,0,0.06) 0%, rgba(255,0,0,0.02) 100%); border-top: 1px solid rgba(128,128,128,0.1);">
        <div style="display: flex; align-items: center; gap: 18px;">
            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #ff0000, #cc0000); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 20px rgba(255,0,0,0.25);">
                <span style="font-size: 26px;">▶️</span>
            </div>
            <div style="flex: 1; min-width: 0;">
                <h4 style="font-size: 17px; font-weight: 800; margin: 0 0 6px 0; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: inherit;">${escapeHtml(video.title)}</h4>
                <div style="display: flex; align-items: center; gap: 16px; font-size: 13px; opacity: 0.6; flex-wrap: wrap;">
                    <span style="display: flex; align-items: center; gap: 4px;">📺 ${escapeHtml(video.channel)}</span>
                    <span style="display: flex; align-items: center; gap: 4px;">👁️ ${video.views?.toLocaleString() || 0} views</span>
                    ${video.duration ? `<span style="display: flex; align-items: center; gap: 4px;">⏱️ ${escapeHtml(video.duration)}</span>` : ''}
                </div>
            </div>
        </div>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 📚 VISUAL COMPONENT 16: REFERENCES SECTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface DiscoveredReference {
    url: string;
    title: string;
    source: string;
    snippet?: string;
    year?: string | number;
    authorityScore: number;
    favicon?: string;
}

export function createReferencesSection(references: DiscoveredReference[]): string {
    if (!references || references.length === 0) return '';
    
    const refItems = references.slice(0, 10).map((ref, i) => {
        const yearDisplay = ref.year ? ` (${ref.year})` : '';
        
        return `
        <li style="display: flex; align-items: flex-start; gap: 16px; padding: 18px 0; ${i < references.length - 1 ? 'border-bottom: 1px solid rgba(128,128,128,0.1);' : ''}">
            <div style="flex-shrink: 0; width: 32px; height: 32px; background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #6366f1;">${i + 1}</div>
            <div style="flex: 1; min-width: 0;">
                <a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer" style="font-size: 16px; font-weight: 700; color: #6366f1; text-decoration: none; line-height: 1.5; display: block; margin-bottom: 6px; transition: color 0.2s;" onmouseover="this.style.color='#4f46e5'" onmouseout="this.style.color='#6366f1'">
                    ${escapeHtml(ref.title)}${yearDisplay}
                </a>
                <div style="display: flex; align-items: center; gap: 10px; font-size: 13px; opacity: 0.6; flex-wrap: wrap;">
                    ${ref.favicon ? `<img src="${escapeHtml(ref.favicon)}" alt="" width="16" height="16" style="border-radius: 4px;" onerror="this.style.display='none'">` : ''}
                    <span>${escapeHtml(ref.source)}</span>
                    ${ref.authorityScore >= 80 ? '<span style="background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15)); color: #059669; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">HIGH AUTHORITY</span>' : ''}
                </div>
                ${ref.snippet ? `<p style="font-size: 14px; line-height: 1.6; margin: 10px 0 0 0; opacity: 0.75; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${escapeHtml(ref.snippet)}</p>` : ''}
            </div>
        </li>`;
    }).join('');

    return `
<section class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.02) 100%); border: 2px solid rgba(99,102,241,0.12); border-radius: 24px; padding: 32px; margin: 56px 0;">
    <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 2px solid rgba(99,102,241,0.1);">
        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 24px rgba(99,102,241,0.3);">
            <span style="font-size: 28px;">📚</span>
        </div>
        <div>
            <h2 style="font-size: 24px; font-weight: 900; margin: 0;">References & Sources</h2>
            <p style="font-size: 14px; opacity: 0.6; margin: 6px 0 0 0;">${references.length} authoritative sources cited</p>
        </div>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">
        ${refItems}
    </ul>
</section>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 17: NUMBERED BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createNumberedBox(number: string, title: string, description: string, color: string = '#6366f1'): string {
    return `
<div class="wpo-box wpo-animate" style="display: flex; gap: 24px; align-items: flex-start; background: linear-gradient(135deg, ${color}08 0%, ${color}03 100%); border: 2px solid ${color}20; border-radius: 24px; padding: 32px; margin: 44px 0;">
    <div style="min-width: 72px; height: 72px; background: linear-gradient(135deg, ${color}, ${color}cc); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 900; box-shadow: 0 12px 28px ${color}40; flex-shrink: 0;">${escapeHtml(number)}</div>
    <div style="flex: 1;">
        <h4 style="font-size: 20px; font-weight: 800; margin: 0 0 12px 0; color: inherit;">${escapeHtml(title)}</h4>
        <p style="font-size: 16px; line-height: 1.8; margin: 0; opacity: 0.85;">${description}</p>
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 18: ICON GRID BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createIconGridBox(title: string, items: Array<{ icon: string; title: string; description: string }>): string {
    if (!items || items.length === 0) return '';
    
    const gridItems = items.map(item => `
        <div style="text-align: center; padding: 28px 20px; background: rgba(255,255,255,0.6); backdrop-filter: blur(10px); border-radius: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.04); transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 12px 32px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.04)'">
            <div style="font-size: 40px; margin-bottom: 16px;">${item.icon}</div>
            <h4 style="font-size: 17px; font-weight: 800; margin: 0 0 10px 0; color: inherit;">${escapeHtml(item.title)}</h4>
            <p style="font-size: 14px; line-height: 1.6; margin: 0; opacity: 0.7;">${escapeHtml(item.description)}</p>
        </div>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%); border: 2px solid rgba(99,102,241,0.12); border-radius: 28px; padding: 36px; margin: 56px 0;">
    <h3 style="font-size: 24px; font-weight: 900; margin: 0 0 28px 0; text-align: center; color: inherit;">${escapeHtml(title)}</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        ${gridItems}
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 19: TIMELINE BOX
// ═══════════════════════════════════════════════════════════════════════════════

export function createTimelineBox(title: string, events: Array<{ time: string; title: string; description: string }>): string {
    if (!events || events.length === 0) return '';
    
    const timelineItems = events.map((event, i) => `
        <div style="display: flex; gap: 20px; ${i < events.length - 1 ? 'padding-bottom: 32px;' : ''}">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="width: 20px; height: 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 50%; flex-shrink: 0; box-shadow: 0 4px 12px rgba(99,102,241,0.4);"></div>
                ${i < events.length - 1 ? '<div style="width: 3px; flex: 1; background: linear-gradient(180deg, #6366f1 0%, rgba(99,102,241,0.2) 100%); margin: 8px 0;"></div>' : ''}
            </div>
            <div style="flex: 1; padding-bottom: 8px;">
                <div style="font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">${escapeHtml(event.time)}</div>
                <h4 style="font-size: 18px; font-weight: 800; margin: 0 0 8px 0; color: inherit;">${escapeHtml(event.title)}</h4>
                <p style="font-size: 15px; line-height: 1.7; margin: 0; opacity: 0.8;">${escapeHtml(event.description)}</p>
            </div>
        </div>
    `).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.02) 100%); border: 2px solid rgba(99,102,241,0.12); border-radius: 24px; padding: 36px; margin: 56px 0;">
    <h3 style="font-size: 24px; font-weight: 900; margin: 0 0 32px 0; color: inherit;">${escapeHtml(title)}</h3>
    ${timelineItems}
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL COMPONENT 20: PROGRESS TRACKER
// ═══════════════════════════════════════════════════════════════════════════════

export function createProgressTracker(title: string, steps: string[], currentStep: number = 1): string {
    if (!steps || steps.length === 0) return '';
    
    const stepItems = steps.map((step, i) => {
        const isCompleted = i < currentStep - 1;
        const isCurrent = i === currentStep - 1;
        const bgColor = isCompleted ? '#10b981' : isCurrent ? '#6366f1' : 'rgba(128,128,128,0.2)';
        const textColor = isCompleted || isCurrent ? 'white' : 'inherit';
        
        return `
            <div style="flex: 1; text-align: center;">
                <div style="width: 48px; height: 48px; margin: 0 auto 12px; background: ${bgColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: ${textColor}; font-size: 18px; font-weight: 800; box-shadow: ${isCompleted || isCurrent ? '0 6px 16px ' + bgColor + '50' : 'none'}; transition: all 0.3s ease;">
                    ${isCompleted ? '✓' : i + 1}
                </div>
                <div style="font-size: 14px; font-weight: 600; opacity: ${isCompleted || isCurrent ? 1 : 0.5};">${escapeHtml(step)}</div>
            </div>
            ${i < steps.length - 1 ? `<div style="flex: 0.5; height: 4px; background: ${isCompleted ? '#10b981' : 'rgba(128,128,128,0.15)'}; margin-top: 24px; border-radius: 2px;"></div>` : ''}
        `;
    }).join('');

    return `
<div class="wpo-box wpo-animate" style="background: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.02) 100%); border: 2px solid rgba(99,102,241,0.12); border-radius: 24px; padding: 36px; margin: 56px 0;">
    <h3 style="font-size: 22px; font-weight: 900; margin: 0 0 32px 0; text-align: center; color: inherit;">${escapeHtml(title)}</h3>
    <div style="display: flex; align-items: flex-start; justify-content: center;">
        ${stepItems}
    </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 VISUAL ROTATION SYSTEM FOR DYNAMIC INJECTION
// ═══════════════════════════════════════════════════════════════════════════════

export type VisualType = 
    | 'proTip' 
    | 'highlight' 
    | 'expertQuote' 
    | 'statBox' 
    | 'checklist' 
    | 'warning' 
    | 'stepByStep' 
    | 'dataTable' 
    | 'callout' 
    | 'comparison'
    | 'definition'
    | 'numbered'
    | 'iconGrid'
    | 'timeline';

export const VISUAL_ROTATION: VisualType[] = [
    'callout',
    'highlight',
    'proTip',
    'statBox',
    'expertQuote',
    'checklist',
    'warning',
    'dataTable',
    'stepByStep',
    'comparison',
    'definition',
    'numbered',
    'highlight',
    'proTip'
];

// ═══════════════════════════════════════════════════════════════════════════════
// 📤 EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════════

export default {
    THEME_ADAPTIVE_CSS,
    createQuickAnswerBox,
    createProTipBox,
    createWarningBox,
    createExpertQuoteBox,
    createHighlightBox,
    createCalloutBox,
    createStatisticsBox,
    createDataTable,
    createChecklistBox,
    createStepByStepBox,
    createComparisonTable,
    createDefinitionBox,
    createKeyTakeaways,
    createFAQAccordion,
    createYouTubeEmbed,
    createReferencesSection,
    createNumberedBox,
    createIconGridBox,
    createTimelineBox,
    createProgressTracker,
    VISUAL_ROTATION
};
