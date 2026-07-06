/*
 * ============================================================
 *  Launcher Pane Background Color | 启动栏背景色
 * ============================================================
 *
 *  [ English ]
 *  Customize the background & text color of the launcher pane
 *  (left sidebar / top bar) in the TriliumNext modern layout.
 *
 *  Automatically picks a contrasting text color based on the
 *  background luminance, keeping icons & buttons readable.
 *
 *  Inspired by the VOCALOID idol support color theme, users can
 *  give the launcher pane their own unique accent color.
 *
 *  Color scheme:
 *    Light:  #123f3c  (dark teal)
 *    Dark:   #11214c  (dark navy)
 *
 *  Config labels:
 *    #LauncherPaneLightBackgroundColor=#123f3c
 *    #LauncherPaneDarkBackgroundColor=#11214c
 *
 *  Credits:
 *    This adaptation targets the Trilium Next v0.103.0 modern layout.
 *    Based on Blue theme & VOCALOID Idol Support Color Theme.
 *    VOCALOID Idol Support Color Theme is derived from Blue theme
 *    and a modified version by 云遥 (Yunyao).
 *    Blue theme:  https://github.com/SiriusXT/trilium-theme-blue
 *    Author:      march-7th-mini  (https://github.com/march-7th-mini)
 *
 *
 *  [ 中文 ]
 *  自定义 TriliumNext 现代主题左侧/顶部启动栏的背景色和文字颜色。
 *
 *  自动根据背景亮度调配文字颜色（深色背景 → 浅色文字，浅色背景 → 深色文字），
 *  确保所有图标和按钮始终保持可读性。
 *
 *  灵感来源于 VOCALOID 歌姬应援色主题配色方案，
 *  允许用户为启动栏赋予专属的主题色调。
 *
 *  配色参考:
 *    浅色:  #123f3c  (深青色)
 *    深色:  #11214c  (深蓝色)
 *
 *  配置标签:
 *    #LauncherPaneLightBackgroundColor=#123f3c
 *    #LauncherPaneDarkBackgroundColor=#11214c
 *
 *  致谢:
 *    本次修改适配 Trilium Next v0.103.0 版本的现代主题。
 *    基于 Blue theme 和 VOCALOID歌姬应援色主题。
 *    VOCALOID歌姬应援色主题，是基于 Blue theme 及云遥修改版基础上修改的。
 *    Blue theme:  https://github.com/SiriusXT/trilium-theme-blue
 *    作者: march-7th-mini  (https://github.com/march-7th-mini)
 * ============================================================
 */
(() => {
    if (window.__launcherPaneBackgroundColor) return;
    window.__launcherPaneBackgroundColor = true;

    const STYLE_ID = 'launcher-pane-background-color-style';
    const DEFAULT_LIGHT_COLOR = '#123f3c';
    const DEFAULT_DARK_COLOR = '#11214c';
    const COLOR_LABEL_DEFAULTS = {
        LauncherPaneLightBackgroundColor: DEFAULT_LIGHT_COLOR,
        LauncherPaneDarkBackgroundColor: DEFAULT_DARK_COLOR
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

    function parseHex(color) {
        const match = String(color || '').trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (!match) return null;
        const raw = match[1].length === 3
            ? match[1].split('').map((ch) => ch + ch).join('')
            : match[1];
        return {
            r: parseInt(raw.slice(0, 2), 16),
            g: parseInt(raw.slice(2, 4), 16),
            b: parseInt(raw.slice(4, 6), 16)
        };
    }

    function luminance(rgb) {
        const toLinear = (value) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
    }

    function getAutoTextColor(background) {
        const rgb = parseHex(background);
        if (!rgb) return '#f3fffd';
        return luminance(rgb) > 0.42 ? '#062f2c' : '#f3fffd';
    }

    function getThemeConfig(lightBg, darkBg) {
        const lightText = getAutoTextColor(lightBg);
        const darkText = getAutoTextColor(darkBg);

        return {
            lightBg,
            darkBg,
            lightText,
            darkText,
            lightHoverText: lightText === '#062f2c' ? '#031f1d' : '#ffffff',
            darkHoverText: darkText === '#062f2c' ? '#031f1d' : '#ffffff',
            lightHoverBg: lightText === '#062f2c' ? 'rgba(255, 255, 255, .42)' : 'rgba(255, 255, 255, .18)',
            darkHoverBg: darkText === '#062f2c' ? 'rgba(255, 255, 255, .42)' : 'rgba(255, 255, 255, .18)'
        };
    }

    function injectStyle() {
        const lightBg = normalizeColor(getLabelValue('LauncherPaneLightBackgroundColor', DEFAULT_LIGHT_COLOR), DEFAULT_LIGHT_COLOR);
        const darkBg = normalizeColor(getLabelValue('LauncherPaneDarkBackgroundColor', DEFAULT_DARK_COLOR), DEFAULT_DARK_COLOR);
        const cfg = getThemeConfig(lightBg, darkBg);

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
    --launcher-pane-custom-background-color: ${cfg.lightBg};
    --launcher-pane-custom-text-color: ${cfg.lightText};
    --launcher-pane-custom-hover-color: ${cfg.lightHoverText};
    --launcher-pane-custom-hover-background: ${cfg.lightHoverBg};
}

body.dark-theme,
body[data-theme-id="next-dark"] {
    --launcher-pane-custom-background-color: ${cfg.darkBg};
    --launcher-pane-custom-text-color: ${cfg.darkText};
    --launcher-pane-custom-hover-color: ${cfg.darkHoverText};
    --launcher-pane-custom-hover-background: ${cfg.darkHoverBg};
}

body #launcher-pane.vertical,
body #launcher-pane.horizontal {
    --launcher-pane-vert-background-color: var(--launcher-pane-custom-background-color) !important;
    --launcher-pane-horiz-background-color: var(--launcher-pane-custom-background-color) !important;
    --launcher-pane-background-color: var(--launcher-pane-custom-background-color) !important;
    --launcher-pane-vert-text-color: var(--launcher-pane-custom-text-color) !important;
    --launcher-pane-horiz-text-color: var(--launcher-pane-custom-text-color) !important;
    --launcher-pane-text-color: var(--launcher-pane-custom-text-color) !important;
    --launcher-pane-vert-button-hover-color: var(--launcher-pane-custom-hover-color) !important;
    --launcher-pane-horiz-button-hover-color: var(--launcher-pane-custom-hover-color) !important;
    --launcher-pane-button-hover-color: var(--launcher-pane-custom-hover-color) !important;
    --launcher-pane-vert-button-hover-background: var(--launcher-pane-custom-hover-background) !important;
    --launcher-pane-horiz-button-hover-background: var(--launcher-pane-custom-hover-background) !important;
    --launcher-pane-button-hover-background: var(--launcher-pane-custom-hover-background) !important;
}

body #launcher-pane {
    background-color: var(--launcher-pane-custom-background-color) !important;
    color: var(--launcher-pane-custom-text-color) !important;
}

body #launcher-pane .launcher-button,
body #launcher-pane .icon-action,
body #launcher-pane .button-widget,
body #launcher-pane .right-dropdown-button {
    color: var(--launcher-pane-custom-text-color) !important;
}

body #launcher-pane .launcher-button:hover,
body #launcher-pane .icon-action:hover,
body #launcher-pane .button-widget:hover,
body #launcher-pane .right-dropdown-button:hover {
    color: var(--launcher-pane-custom-hover-color) !important;
    background: var(--launcher-pane-custom-hover-background) !important;
}
`;
    }

    function fixPromotedColorDefaults(root = document) {
        const textInputs = root.querySelectorAll?.('.promoted-attribute-cell input[type="text"], .promoted-attribute-cell input[type="hidden"]');
        textInputs?.forEach((input) => {
            const name = input.getAttribute('data-attribute-name') || input.getAttribute('name') || input.id || '';
            const matched = Object.keys(COLOR_LABEL_DEFAULTS).find((label) => name.includes(label));
            if (!matched || input.value) return;

            const colorInput = input.parentElement?.querySelector('input[type="color"]')
                || input.closest('.promoted-attribute-cell')?.querySelector('input[type="color"]');
            if (colorInput && colorInput.value.toLowerCase() === '#ffffff') {
                colorInput.value = COLOR_LABEL_DEFAULTS[matched];
                colorInput.title = `默认颜色 ${COLOR_LABEL_DEFAULTS[matched]}`;
            }
        });
    }

    function scheduleFixPromotedColorDefaults() {
        if (window.__launcherPaneColorPickerRaf) return;
        window.__launcherPaneColorPickerRaf = requestAnimationFrame(() => {
            window.__launcherPaneColorPickerRaf = null;
            fixPromotedColorDefaults();
        });
    }

    injectStyle();
    fixPromotedColorDefaults();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof Element && (node.matches?.('.promoted-attribute-cell') || node.querySelector?.('.promoted-attribute-cell'))) {
                    scheduleFixPromotedColorDefaults();
                    return;
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
