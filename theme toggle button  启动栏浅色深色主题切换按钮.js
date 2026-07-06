/* ============================================================
 *  Theme Toggle Button | 启动栏浅色/深色主题切换按钮
 * ============================================================
 *
 *  [ English ]
 *  Adds a theme toggle button (sun/moon icon) to the launcher
 *  pane for quickly switching between TriliumNext's built-in
 *  modern themes:  next-light / next-dark.
 *
 *  Features:
 *    - One-click light/dark toggle
 *    - Persists the selected theme via Trilium's options API
 *    - Keyboard shortcut configurable via #ThemeToggleShortcut
 *
 *
 *  [ 中文 ]
 *  在启动栏添加一个主题切换按钮（日/月图标），
 *  用于在 TriliumNext 内置的现代主题之间快速切换：
 *  next-light（浅色）/ next-dark（深色）。
 *
 *  功能:
 *    - 一键浅色/深色切换
 *    - 通过 Trilium options API 持久化主题设置
 *    - 可通过 #ThemeToggleShortcut 配置快捷键
 *
 *  Credits / 致谢:
 *    适配: Trilium Next v0.103.0 现代主题
 *    Adopted for Trilium Next v0.103.0 modern layout.
 *    Author: march-7th-mini  (https://github.com/march-7th-mini)
 * ============================================================
 */
(() => {
    if (window.__themeToggleButtonWidget) return;
    window.__themeToggleButtonWidget = true;

    function getLabelValue(name, fallback) {
        try {
            const value = api?.currentNote?.getLabelValue?.(name);
            return value === undefined || value === null || value === '' ? fallback : value;
        } catch (e) {
            return fallback;
        }
    }

    const shortcut = getLabelValue('ThemeToggleShortcut', '');
    const BTN_ID = 'theme-toggle-tab-btn';
    const STYLE_ID = 'theme-toggle-tab-style';
    const THEME_STYLESHEET_ATTR = 'data-theme-stylesheet';
    const THEME_BASE_ATTR = 'data-theme-base';
    const LIGHT_THEME = 'next-light';
    const DARK_THEME = 'next-dark';

    let currentTheme = window.glob?.theme || document.body.getAttribute('data-theme-id') || '';
    let switching = false;

    function injectStyle() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
/* 标题栏按钮颜色跟随主题 */
:root {
    color-scheme: light;
}
body.dark-theme,
body[data-theme-id="next-dark"] {
    color-scheme: dark !important;
}

#${BTN_ID} {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
    padding: 0 !important;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--launcher-pane-text-color, var(--muted-text-color, inherit));
    opacity: .78;
    border-radius: 8px;
    transition: opacity .18s ease, color .18s ease, background .18s ease, transform .18s ease;
}
#${BTN_ID}:hover {
    opacity: 1;
    color: var(--accented-text-color, #3b82f6) !important;
    background: color-mix(in srgb, currentColor 12%, transparent);
    transform: translateY(-1px);
}
body.dark-theme #${BTN_ID}:hover,
body[data-theme-id="next-dark"] #${BTN_ID}:hover {
    color: #fff !important;
}
#${BTN_ID} i {
    font-size: 19px;
    line-height: 1;
}
#${BTN_ID}._theme-toggle-saving {
    pointer-events: none;
    opacity: .45;
}
`;
        document.head.appendChild(style);
    }

    function getThemeStyle() {
        if (currentTheme === DARK_THEME || currentTheme === 'dark') return 'dark';
        if (currentTheme === LIGHT_THEME || currentTheme === 'light') return 'light';

        const cssTheme = getComputedStyle(document.body).getPropertyValue('--theme-style').trim();
        if (cssTheme === 'dark' || document.body.classList.contains('dark-theme')) return 'dark';
        return 'light';
    }

    function getStylesheets(theme) {
        const stylesheetsPath = `${window.glob?.assetPath || 'assets'}/stylesheets`;
        return [{ href: `${stylesheetsPath}/${theme === DARK_THEME ? 'theme-next-dark.css' : 'theme-next-light.css'}` }];
    }

    function waitForStylesheets(links) {
        if (!links.length) return Promise.resolve(true);
        return new Promise((resolve) => {
            let remaining = links.length;
            let allLoaded = true;
            const done = (event) => {
                if (event.type === 'error') allLoaded = false;
                remaining -= 1;
                if (remaining <= 0) resolve(allLoaded);
            };
            links.forEach((link) => {
                link.addEventListener('load', done, { once: true });
                link.addEventListener('error', done, { once: true });
            });
        });
    }

    async function saveThemeOption(theme) {
        // [Desktop/Web 兼容]
        // 优先使用 Trilium 内置的 options.save：
        //   - 桌面客户端（Electron）：走 IPC 通道，无需 HTTP 认证
        //   - 网页端：由 Trilium 内部处理，自动携带认证信息
        // 降级方案：直接调用 REST API（某些环境可能不可用）
        if (typeof options !== 'undefined' && options.save) {
            await options.save('theme', theme);
        } else {
            // 降级：通过 fetch API 直接保存（网页端可用，桌面端可能 401）
            const baseApiUrl = window.glob?.baseApiUrl || 'api/';
            await fetch(`${baseApiUrl}options`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    'x-csrf-token': window.glob?.csrfToken || '',
                    'trilium-component-id': window.glob?.componentId || ''
                },
                credentials: 'include',
                body: JSON.stringify({ theme })
            });
        }
    }

    async function applyTheme(theme) {
        const refs = getStylesheets(theme);
        const oldLinks = Array.from(document.head.querySelectorAll(`link[${THEME_STYLESHEET_ATTR}]`));
        const anchor = oldLinks.at(-1) || document.head.querySelector(`link[${THEME_BASE_ATTR}]`);
        let insertAfter = anchor;

        const newLinks = refs.map((ref) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = ref.href;
            link.setAttribute(THEME_STYLESHEET_ATTR, 'true');

            if (insertAfter) insertAfter.after(link);
            else document.head.appendChild(link);
            insertAfter = link;
            return link;
        });

        const loaded = await waitForStylesheets(newLinks);
        if (!loaded) {
            newLinks.forEach((link) => link.remove());
            throw new Error('主题样式表加载失败');
        }

        oldLinks.forEach((link) => link.remove());
        currentTheme = theme;
        if (window.glob) window.glob.theme = theme;
        document.body.setAttribute('data-theme-id', theme);

        requestAnimationFrame(() => {
            const isDark = theme === DARK_THEME;
            document.body.classList.toggle('dark-theme', isDark);
            document.body.classList.toggle('light-theme', !isDark);
            window.glob?.appContext?.triggerEvent?.('themeChanged', { themeStyle: isDark ? 'dark' : 'light' });
            // [桌面客户端 Electron 专用]
            // 通知 Electron 原生主题变化，影响：
            //   - 窗口标题栏按钮颜色（最小化/最大化/关闭）
            //   - 系统级原生 UI 控件配色
            // setNativeThemeSource 通过 preload 脚本暴露到渲染进程
            if (window.electronApi?.setNativeThemeSource) {
                window.electronApi.setNativeThemeSource(isDark ? 'dark' : 'light');
            }
            updateButtonState();
        });
    }

    function updateButtonState() {
        const btn = document.getElementById(BTN_ID);
        if (!btn) return;

        const isDark = getThemeStyle() === 'dark';
        btn.innerHTML = `<i class="bx ${isDark ? 'bx-sun' : 'bx-moon'}"></i>`;
        btn.title = isDark ? '切换到浅色主题' : '切换到深色主题';
        btn.setAttribute('aria-label', btn.title);
    }

    async function toggleTheme() {
        if (switching) return;
        switching = true;

        const btn = document.getElementById(BTN_ID);
        const nextTheme = getThemeStyle() === 'dark' ? LIGHT_THEME : DARK_THEME;
        btn?.classList.add('_theme-toggle-saving');

        try {
            await saveThemeOption(nextTheme);
            await applyTheme(nextTheme);
        } catch (error) {
            console.error('[theme-toggle-button]', error);
            alert(error?.message || '切换主题失败');
        } finally {
            btn?.classList.remove('_theme-toggle-saving');
            switching = false;
            updateButtonState();
        }
    }

    function createButton() {
        const btn = document.createElement('button');
        btn.id = BTN_ID;
        btn.className = 'launcher-button icon-action bx';
        btn.type = 'button';
        btn.addEventListener('click', () => void toggleTheme());
        return btn;
    }

    function findLauncherTarget() {
        const launcher = document.querySelector('#launcher-container');
        if (launcher) {
            const before = launcher.querySelector('.left-pane-toggle-button, [data-trigger-command="toggleLeftPane"], [data-trigger-command="setLeftPaneVisibility"]');
            return {
                parent: launcher,
                before: before?.parentNode === launcher ? before : null
            };
        }

        const ref = document.querySelector('.left-pane-toggle-button, [data-trigger-command="toggleLeftPane"], [data-trigger-command="setLeftPaneVisibility"], [data-trigger-command="scrollToActiveNote"], [data-trigger-command="collapseTree"]');
        if (ref?.parentNode) return { parent: ref.parentNode, before: ref };

        return null;
    }

    function insertButton() {
        injectStyle();

        const target = findLauncherTarget();
        if (!target?.parent) return false;

        const existing = document.getElementById(BTN_ID);
        if (existing) {
            if (existing.parentNode !== target.parent || existing.nextSibling !== target.before) {
                target.parent.insertBefore(existing, target.before);
            }
            updateButtonState();
            return true;
        }

        const btn = createButton();
        target.parent.insertBefore(btn, target.before);
        updateButtonState();
        return true;
    }

    function scheduleInsert() {
        if (window.__themeToggleInsertRaf) return;
        window.__themeToggleInsertRaf = requestAnimationFrame(() => {
            window.__themeToggleInsertRaf = null;
            insertButton();
        });
    }

    if (shortcut.trim()) {
        api?.bindGlobalShortcut?.(shortcut.trim(), () => void toggleTheme());
    }

    let attempts = 0;
    const tryInsert = () => {
        if (insertButton() || attempts >= 8) return;
        attempts += 1;
        setTimeout(tryInsert, 500);
    };
    tryInsert();

    const observer = new MutationObserver((mutations) => {
        const relevant = mutations.some((mutation) => {
            return Array.from(mutation.addedNodes).some((node) => node instanceof Element && (
                node.matches?.('#launcher-container, .left-pane-toggle-button, #theme-toggle-tab-btn')
                || node.querySelector?.('#launcher-container, .left-pane-toggle-button, #theme-toggle-tab-btn')
            ));
        });
        if (relevant) scheduleInsert();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
