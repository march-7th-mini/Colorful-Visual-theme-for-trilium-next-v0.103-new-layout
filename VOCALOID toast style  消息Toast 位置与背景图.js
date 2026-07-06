/* ============================================================
 *  VOCALOID Toast Style | 消息通知 Toast 位置与背景图
 * ============================================================
 *
 *  [ English ]
 *  Styles Trilium's notification (toast) messages with a
 *  VOCALOID-themed look. Customize position, background image,
 *  and light/dark theme colors.
 *
 *  Features:
 *    - Configurable position (top-right / bottom-right / ...)
 *    - Optional background image
 *    - Accent-colored left border & gradient overlay
 *    - Auto-adapting text color
 *
 *  Config labels:
 *    #VocaloidToastPosition=bottom-right
 *    #VocaloidToastBackgroundImageUrl=https://www.aiphm.cn/img/yunyunRight50.png
 *    #VocaloidToastLightBackgroundColor=#f2fbfa
 *    #VocaloidToastDarkBackgroundColor=#11214c
 *    #VocaloidToastAccentColor=#39C5BB
 *
 *
 *  [ 中文 ]
 *  为 Trilium 的通知消息（Toast）配上 VOCALOID 风格主题。
 *  可自定义位置、背景图、亮/暗主题配色。
 *
 *  功能:
 *    - 可配置位置（右上/右下/左下/左上）
 *    - 可选背景图片
 *    - 强调色左边框 & 渐变叠加
 *    - 文字颜色自动适配
 *
 *  配置标签:
 *    #VocaloidToastPosition=bottom-right
 *    #VocaloidToastBackgroundImageUrl=https://www.aiphm.cn/img/yunyunRight50.png
 *    #VocaloidToastLightBackgroundColor=#f2fbfa
 *    #VocaloidToastDarkBackgroundColor=#11214c
 *    #VocaloidToastAccentColor=#39C5BB
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
    if (window.__vocaloidToastStyle) return;
    window.__vocaloidToastStyle = true;

    const STYLE_ID = 'vocaloid-toast-style';
    const DEFAULTS = {
        VocaloidToastPosition: 'bottom-right',
        VocaloidToastBackgroundImageUrl: '',
        VocaloidToastLightBackgroundColor: '#f2fbfa',
        VocaloidToastDarkBackgroundColor: '#11214c',
        VocaloidToastAccentColor: '#39C5BB'
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
        if (/^(rgb|hsl)a?\(/i.test(color)) return color;
        return fallback;
    }

    function normalizePosition(value) {
        const position = String(value || '').trim().toLowerCase();
        return ['top-right', 'bottom-right', 'bottom-left', 'top-left'].includes(position)
            ? position
            : DEFAULTS.VocaloidToastPosition;
    }

    function normalizeUrl(value) {
        const url = String(value || '').trim();
        if (!url) return '';
        if (/^(https?:|data:image\/|\/|\.\/|\.\.\/)/i.test(url)) return url.replace(/["\\]/g, '');
        return '';
    }

    function getPositionCss(position) {
        const vertical = position.startsWith('top') ? 'top: 52px; bottom: auto;' : 'bottom: 52px; top: auto;';
        const horizontal = position.endsWith('left') ? 'left: 15px; right: auto;' : 'right: 0px; left: auto;';
        return `${vertical}\n    ${horizontal}`;
    }

    function injectStyle() {
        const position = normalizePosition(getLabelValue('VocaloidToastPosition', DEFAULTS.VocaloidToastPosition));
        const imageUrl = normalizeUrl(getLabelValue('VocaloidToastBackgroundImageUrl', DEFAULTS.VocaloidToastBackgroundImageUrl));
        const lightBg = normalizeColor(getLabelValue('VocaloidToastLightBackgroundColor', DEFAULTS.VocaloidToastLightBackgroundColor), DEFAULTS.VocaloidToastLightBackgroundColor);
        const darkBg = normalizeColor(getLabelValue('VocaloidToastDarkBackgroundColor', DEFAULTS.VocaloidToastDarkBackgroundColor), DEFAULTS.VocaloidToastDarkBackgroundColor);
        const accent = normalizeColor(getLabelValue('VocaloidToastAccentColor', DEFAULTS.VocaloidToastAccentColor), DEFAULTS.VocaloidToastAccentColor);
        const bgImageCss = imageUrl ? `, url("${imageUrl}")` : '';

        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        style.textContent = `
body,
body.light-theme,
body[data-theme-id="next-light"] {
    --vocaloid-toast-bg: ${lightBg};
    --vocaloid-toast-text: #102826;
}

body.dark-theme,
body[data-theme-id="next-dark"] {
    --vocaloid-toast-bg: ${darkBg};
    --vocaloid-toast-text: #f4fffd;
}

#toast-container {
    ${getPositionCss(position)}
    width: min(420px, calc(100vw - 24px)) !important;
    z-index: 12000 !important;
}

#toast-container,
#toast-container .toast,
#toast-container .toast-header,
#toast-container .toast-body,
#toast-container .toast-message,
#toast-container .toast-container,
#toast-container > div,
#toast-container :is(div, span, p, strong, small, a, button, .icon-action) {
    color: var(--vocaloid-toast-text) !important;
}

#toast-container .toast,
#toast-container > .toast,
#toast-container .toast-message,
#toast-container > div {
    --bs-toast-color: var(--vocaloid-toast-text) !important;
    --toast-text-color: var(--vocaloid-toast-text) !important;
    --modal-control-button-color: var(--vocaloid-toast-text) !important;
    border-left: 4px solid ${accent} !important;
    border-radius: 8px !important;
    background-color: var(--vocaloid-toast-bg) !important;
    background-image: linear-gradient(90deg, color-mix(in srgb, ${accent} 14%, transparent), color-mix(in srgb, var(--vocaloid-toast-bg) 88%, transparent))${bgImageCss} !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, .18) !important;
    overflow: hidden !important;
}

#toast-container .toast .toast-header,
#toast-container .toast .toast-header strong,
#toast-container .toast .toast-header strong *,
#toast-container .toast .toast-title,
#toast-container .toast [class*="title"],
#toast-container .toast.no-title .toast-body {
    color: var(--vocaloid-toast-text) !important;
}

#toast-container .btn-close,
#toast-container [data-bs-dismiss],
#toast-container .close {
    filter: none !important;
    color: var(--vocaloid-toast-text) !important;
    opacity: .82 !important;
}

#toast-container .btn-close:hover,
#toast-container [data-bs-dismiss]:hover,
#toast-container .close:hover {
    opacity: 1 !important;
}
`;
    }

    injectStyle();
})();
