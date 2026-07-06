/* ============================================================
 *  VOCALOID Blockquote Colors | 引用块应援色
 * ============================================================
 *
 *  [ English ]
 *  Colors blockquote backgrounds with VOCALOID-inspired tints.
 *  Minimal version: only modifies the blockquote background color,
 *  leaving borders, spacing, rounded corners, text, and badges
 *  completely untouched.
 *
 *  Config labels:
 *    #VocaloidQuoteLightBackgroundColor=#e8faf8
 *    #VocaloidQuoteDarkBackgroundColor=#123330
 *
 *
 *  [ 中文 ]
 *  为引用块配上 VOCALOID 风格的背景色调。
 *  最精简版：只修改引用块背景配色，不修改边框、间距、
 *  圆角、文字、角标等任何其他样式。
 *
 *  配置标签:
 *    #VocaloidQuoteLightBackgroundColor=#e8faf8
 *    #VocaloidQuoteDarkBackgroundColor=#123330
 *
 *  Credits / 致谢:
 *    This adaptation targets the Trilium Next v0.103.0 modern layout.
 *    本次修改适配 Trilium Next v0.103.0 版本的现代主题。
 *
 *    Based on Blue theme & VOCALOID Idol Support Color Theme.
 *    基于 Blue theme 和 VOCALOID歌姬应援色主题。
 *
 *    VOCALOID Idol Support Color Theme is derived from Blue theme
 *    and a modified version by 云遥 (Yunyao).
 *    VOCALOID歌姬应援色主题，是基于 Blue theme 及云遥修改版基础上修改的。
 *
 *    Blue theme:  https://github.com/SiriusXT/trilium-theme-blue
 *    Author:      march-7th-mini  (https://github.com/march-7th-mini)
 * ============================================================
 */
(() => {
    if (window.__vocaloidBlockquoteColors) return;
    window.__vocaloidBlockquoteColors = true;

    const STYLE_ID = 'vocaloid-blockquote-colors-style';
    const DEFAULTS = {
        VocaloidQuoteLightBackgroundColor: '#e8faf8',
        VocaloidQuoteDarkBackgroundColor: '#123330'
    };

    function getLabelValue(name, fallback) {
        try {
            const value = api?.currentNote?.getLabelValue?.(name);
            return value === undefined || value === null || value === '' ? fallback : value;
        } catch (e) {
            return fallback;
        }
    }

    function normalizeColor(value, fallback) {
        const color = String(value || '').trim();
        if (/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(color)) return color;
        return fallback;
    }

    function injectStyle() {
        const lightBg = normalizeColor(getLabelValue('VocaloidQuoteLightBackgroundColor', DEFAULTS.VocaloidQuoteLightBackgroundColor), DEFAULTS.VocaloidQuoteLightBackgroundColor);
        const darkBg = normalizeColor(getLabelValue('VocaloidQuoteDarkBackgroundColor', DEFAULTS.VocaloidQuoteDarkBackgroundColor), DEFAULTS.VocaloidQuoteDarkBackgroundColor);

        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        style.textContent = `
body,
body[data-theme-id="next-light"],
body.light-theme {
    --vocaloid-quote-bg: ${lightBg};
}

body.dark-theme,
body[data-theme-id="next-dark"] {
    --vocaloid-quote-bg: ${darkBg};
}

.note-detail blockquote,
.ck-content blockquote {
    background-color: var(--vocaloid-quote-bg) !important;
}
`;
    }

    injectStyle();
})();
