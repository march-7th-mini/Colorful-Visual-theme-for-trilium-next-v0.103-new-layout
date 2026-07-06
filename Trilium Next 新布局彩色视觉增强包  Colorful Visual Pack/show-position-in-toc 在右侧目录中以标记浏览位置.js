/* ============================================================
 *  Show Position in TOC | 在右侧目录中标记浏览位置
 * ============================================================
 *
 *  [ English ]
 *  Highlights the current reading position in the right-side TOC
 *  as you scroll through the note content.
 *
 *  Features:
 *    - Scroll syncing: TOC item highlights as you scroll
 *    - Click to jump: click a TOC item to navigate to that heading
 *    - Auto-expand: expands collapsed parent items of the active heading
 *    - Smart collapse: manually folded ancestors keep their state
 *      until the next scroll
 *    - Auto-scroll TOC: keeps the active item visible
 *
 *  Supports both layout:
 *    - New (modern):  #toc React TOC
 *    - Old (classic): .toc-widget classic TOC
 *
 *  Highlight style:
 *    - Background: Gumi green  #ccff00
 *    - Text color: black
 *    - Connection lines: VOCALOID character colors
 *      (Miku teal / Len yellow / Luka pink / LuoTianyi blue / MEIKO red)
 *
 *  
 *  Fault tolerance:
 *    - Retries up to 20s until TOC and headings are ready
 *    - MutationObserver watches DOM changes, auto-restores after content loads
 *    - No manual refresh needed after network recovery
 *
 *  Known issues fixed:
 *    - Click-jump: highlight first, then scroll body, recalibrate after 1.2s
 *    - Auto-scroll TOC to keep active item visible (instant jump)
 *    - TOC scroll container auto-detection for both old/new layouts
 *    - Auto-scroll TOC only on body scroll, manual TOC scroll doesn't interfere
 *    - TOC scroll and body scroll are independent
 *
 *
 *  [ 中文 ]
 *  滚动正文时，右侧目录高亮显示当前阅读位置对应的标题。
 *
 *  功能:
 *    - 滚动同步：随正文滚动自动高亮对应目录项
 *    - 点击跳转：点击目录项跳转到对应标题
 *    - 自动展开：自动展开被折叠的父级目录项
 *    - 智能折叠：手动折叠的高亮项上级保持折叠，滚动后自动恢复
 *    - 目录自动滚动：让高亮项始终可见
 *
 *  适配两种布局：
 *    - 新布局（现代）：#toc React TOC
 *    - 旧布局（经典）：.toc-widget 经典 TOC
 *
 *  高亮样式:
 *    - 背景色：Gumi 绿 #ccff00
 *    - 文字色：黑色
 *    - 目录竖线：VOCALOID 应援色
 *      （初音绿/镜音黄/巡音粉/洛天依蓝/MEIKO红）
 *
 * 
 *  容错机制:
 *    - 页面加载时持续重试（最长 20 秒）直到 TOC 和标题就绪
 *    - MutationObserver 监听 DOM 变化，内容加载后自动恢复
 *    - 网络恢复后无需手动刷新
 *
 *  已知问题修复:
 *    - 点击 TOC 跳转时先高亮再滚动正文，1.2 秒后重新校准
 *    - 高亮项不在 TOC 可见区域时手动滚动居中显示
 *    - 新/旧布局的 TOC 滚动容器自动识别
 *    - 仅在正文滚动时自动滚动 TOC，手动滚动不干扰
 *    - TOC 滚动与正文滚动分离，互不冲突
 *
 *  Credits / 致谢:
 *    This adaptation targets the Trilium Next v0.103.0 modern layout.
 *    本次修改适配 Trilium Next v0.103.0 版本的现代主题。
 *
 *    Based on Blue theme & VOCALOID Idol Support Color Theme.
 *    基于 Blue theme 和 VOCALOID歌姬应援色主题。
 *
 *    Original project: https://github.com/SiriusXT/trilium-show-position-in-toc
 *
 *    VOCALOID Idol Support Color Theme is derived from Blue theme
 *    and a modified version by yunyao (Yunyao).
 *    VOCALOID歌姬应援色主题，是基于 Blue theme 及云遥修改版基础上修改的。
 *
 *    Blue theme:  https://github.com/SiriusXT/trilium-theme-blue
 *    Author:      march-7th-mini  (https://github.com/march-7th-mini)
 * ============================================================ */


const config = {
    highlightBg: '#ccff00',
    highlightColor: '#000000',
    activeTopOffset: 6,
    refreshDelay: 250,
    tocScrollPadding: 20,
    navigationLockMs: 700,
    topResetThreshold: 4,
};

let _currentIndex = -1;
let _retryCount = 0;
let _scrollContainer = null;
let _scrollHandler = null;
let _mutationObserver = null;
let _rafPending = false;
let _lastStateKey = '';
let _navigationLockUntil = 0;
let _manualCollapsedLi = null;
let _manualCollapseScrollMarker = null;
let _programmaticTocToggle = false;
let _contentScrolled = false;  // 标记是否由于正文滚动触发的同步
let _tocScrollBox = null;
let _tocScrollHandler = null;
let _contextRefreshTimers = [];
let _watchingRootsKey = '';
const MAX_RETRY = 40;

function normalizeText(text) {
    return (text || '')
        .replace(/\s+/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
}

function now() {
    return Date.now();
}

function isNavigationLocked() {
    return now() < _navigationLockUntil;
}

function lockNavigation() {
    _navigationLockUntil = now() + config.navigationLockMs;
}

function getTocRoot() {
    return document.querySelector('#toc .toc') || document.querySelector('.toc-widget .toc');
}

function getTocScrollBox() {
    const candidates = [
        document.querySelector('#toc .body-wrapper'),
        document.querySelector('#toc .card-body'),
        document.querySelector('#toc'),
        document.querySelector('.toc-widget'),
        document.querySelector('.toc-widget')?.parentElement,
        document.querySelector('.toc-widget')?.closest('.card-body'),
        document.querySelector('.toc-widget')?.closest('.body-wrapper')
    ].filter(Boolean);

    for (const el of candidates) {
        const style = window.getComputedStyle(el);
        const overflow = `${style.overflowY} ${style.overflow}`;
        // 只要有 overflow auto/scroll 属性就返回，不管当前是否有滚动内容
        if (/(auto|scroll)/.test(overflow)) {
            return el;
        }
    }

    // 兜底：返回第一个能找到的候选
    return candidates[0] || null;
}

function getTocItems() {
    const tocRoot = getTocRoot();
    if (!tocRoot) return [];
    return Array.from(tocRoot.querySelectorAll('li')).filter(li => li.querySelector('.item-content'));
}

function getRawHeaders() {
    const selector = '.note-detail h1, .note-detail h2, .note-detail h3, .note-detail h4, .note-detail h5, .note-detail h6, .note-detail-pane h1, .note-detail-pane h2, .note-detail-pane h3, .note-detail-pane h4, .note-detail-pane h5, .note-detail-pane h6';

    return Array.from(document.querySelectorAll(selector)).filter(el => {
        if (!el || !el.textContent) return false;
        if (el.closest('#toc')) return false;
        if (el.closest('section.include-note')) return false;
        if (!normalizeText(el.textContent)) return false;
        return el.getClientRects().length > 0;
    });
}

function getHeaders() {
    const rawHeaders = getRawHeaders();
    const tocItems = getTocItems();
    if (!rawHeaders.length || !tocItems.length) return rawHeaders;

    const tocTexts = tocItems.map(item => normalizeText(item.querySelector('.item-content')?.textContent));
    const matched = [];
    let headerIndex = 0;

    for (const tocText of tocTexts) {
        if (!tocText) continue;

        while (headerIndex < rawHeaders.length) {
            const header = rawHeaders[headerIndex++];
            const headerText = normalizeText(header.textContent);
            if (headerText === tocText) {
                matched.push(header);
                break;
            }
        }
    }

    return matched.length ? matched : rawHeaders;
}

function getStateKey() {
    const headers = getHeaders();
    const tocItems = getTocItems();
    const headerKey = headers.map(h => `${h.tagName}:${normalizeText(h.textContent)}`).join('|');
    return `${headerKey}__${tocItems.length}`;
}

function findScrollContainer(element) {
    let current = element?.parentElement;

    while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const overflowY = `${style.overflowY} ${style.overflow}`;
        if (/(auto|scroll|overlay)/.test(overflowY) && current.scrollHeight > current.clientHeight + 4) {
            return current;
        }
        current = current.parentElement;
    }

    return window;
}

function getScrollMarker() {
    if (_scrollContainer && _scrollContainer !== window) {
        return Math.round(_scrollContainer.scrollTop || 0);
    }
    return Math.round(window.scrollY || window.pageYOffset || 0);
}

function isAtTop() {
    return getScrollMarker() <= config.topResetThreshold;
}

function isCollapsed(li) {
    return li?.classList?.contains('collapsed');
}

function getChildOlForLi(li) {
    let next = li?.nextElementSibling;
    while (next && next.tagName !== 'OL') {
        next = next.nextElementSibling;
    }
    return next && next.tagName === 'OL' ? next : null;
}

function isAncestorLi(ancestorLi, childLi) {
    if (!ancestorLi || !childLi || ancestorLi === childLi) return false;

    const directChildOl = getChildOlForLi(ancestorLi);
    if (!directChildOl) return false;
    if (directChildOl.contains(childLi)) return true;

    let parentOl = childLi.parentElement;
    while (parentOl && parentOl.tagName === 'OL') {
        let previousLi = parentOl.previousElementSibling;
        while (previousLi && previousLi.tagName !== 'LI') {
            previousLi = previousLi.previousElementSibling;
        }

        if (previousLi === ancestorLi) return true;
        parentOl = previousLi ? previousLi.parentElement : null;
    }

    return false;
}

function shouldKeepManualCollapse(li) {
    if (!_manualCollapsedLi || !li) return false;
    if (!_manualCollapsedLi.isConnected) {
        _manualCollapsedLi = null;
        _manualCollapseScrollMarker = null;
        return false;
    }

    const currentMarker = getScrollMarker();
    if (_manualCollapseScrollMarker !== null && currentMarker !== _manualCollapseScrollMarker) {
        _manualCollapsedLi = null;
        _manualCollapseScrollMarker = null;
        return false;
    }

    return _manualCollapsedLi === li || isAncestorLi(_manualCollapsedLi, li);
}

function expandParentChain(li) {
    if (!li) return;

    let parentOl = li.parentElement;
    while (parentOl && parentOl.tagName === 'OL') {
        let previousLi = parentOl.previousElementSibling;
        while (previousLi && previousLi.tagName !== 'LI') {
            previousLi = previousLi.previousElementSibling;
        }

        if (previousLi && isCollapsed(previousLi) && !shouldKeepManualCollapse(previousLi)) {
            const button = previousLi.querySelector('.collapse-button');
            if (button) {
                _programmaticTocToggle = true;
                button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                setTimeout(() => { _programmaticTocToggle = false; }, 0);
            }
        }

        parentOl = previousLi ? previousLi.parentElement : null;
    }
}

function clearHighlight(items) {
    items.forEach(item => {
        item.style.backgroundColor = '';
        item.style.color = '';
        item.style.borderRadius = '';
        item.classList.remove('toc-current-item');
    });
}

function ensureItemVisible(item) {
    if (!item) return;
    // 浏览器自动找到最近的滚动容器并滚动到可视区域
    item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// 点击 TOC 跳转时强制滚动容器到目标项（处理 scrollIntoView 找不到正确容器的情况）
function forceScrollTocToItem(item) {
    if (!item) return;
    const tocBox = getTocScrollBox();
    if (!tocBox) return;
    
    const itemRect = item.getBoundingClientRect();
    const boxRect = tocBox.getBoundingClientRect();
    
    if (itemRect.top < boxRect.top + 4 || itemRect.bottom > boxRect.bottom - 4) {
        const relativeTop = itemRect.top - boxRect.top;
        const targetScroll = tocBox.scrollTop + relativeTop - tocBox.clientHeight / 2 + itemRect.height / 2;
        tocBox.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: 'auto'
        });
    }
}

function highlightByIndex(index, options = {}) {
    const { keepVisible = true } = options;
    const items = getTocItems();
    if (!items.length) return;

    if (index < 0) index = 0;
    if (index >= items.length) index = items.length - 1;
    if (_currentIndex === index) {
        if (keepVisible) {
            ensureItemVisible(items[index]);
        }
        return;
    }

    clearHighlight(items);

    const item = items[index];
    if (!item) return;

    expandParentChain(item);
    item.style.backgroundColor = config.highlightBg;
    item.style.color = config.highlightColor;
    item.style.borderRadius = '3px';
    item.classList.add('toc-current-item');

    if (keepVisible) {
        requestAnimationFrame(() => ensureItemVisible(item));
    }

    _currentIndex = index;
}

function getContainerTop() {
    if (_scrollContainer && _scrollContainer !== window) {
        return _scrollContainer.getBoundingClientRect().top;
    }
    return 0;
}

function getActiveHeadingIndex(headers) {
    if (!headers.length) return -1;
    if (isAtTop()) return 0;

    const containerTop = getContainerTop();
    const probeY = containerTop + config.activeTopOffset;
    const firstTop = headers[0].getBoundingClientRect().top;
    if (firstTop >= containerTop - 1) return 0;

    for (let i = 0; i < headers.length; i++) {
        const currentTop = headers[i].getBoundingClientRect().top;
        const nextTop = i + 1 < headers.length ? headers[i + 1].getBoundingClientRect().top : Number.POSITIVE_INFINITY;

        if (currentTop > probeY) {
            return i === 0 ? 0 : i - 1;
        }

        if (currentTop <= probeY && nextTop > probeY) {
            return i;
        }
    }

    return headers.length - 1;
}

function syncActiveHeading() {
    if (isNavigationLocked()) return;

    const headers = getHeaders();
    const tocItems = getTocItems();
    if (!headers.length || !tocItems.length) return;

    const limit = Math.min(headers.length, tocItems.length);
    const activeIndex = getActiveHeadingIndex(headers.slice(0, limit));
    if (activeIndex >= 0) {
        // keepVisible 仅在正文滚动时启用，手动滚动 TOC 时不自动滚回
        highlightByIndex(activeIndex, { keepVisible: _contentScrolled });
    }
    _contentScrolled = false;
}

function scheduleSync() {
    if (_rafPending) return;
    _rafPending = true;

    requestAnimationFrame(() => {
        _rafPending = false;
        syncActiveHeading();
    });
}

function bindScroll() {
    const headers = getHeaders();
    if (!headers.length) return;

    const nextContainer = findScrollContainer(headers[0]);
    if (_scrollContainer === nextContainer && _scrollHandler) {
        return;
    }

    if (_scrollContainer && _scrollHandler) {
        _scrollContainer.removeEventListener('scroll', _scrollHandler, { passive: true });
    }

    _scrollContainer = nextContainer;
    _scrollHandler = () => {
        _contentScrolled = true;
        scheduleSync();
    };
    _scrollContainer.addEventListener('scroll', _scrollHandler, { passive: true });
}

function refreshState(force = false) {
    const stateKey = getStateKey();
    if (!force && stateKey === _lastStateKey) {
        bindScroll();
        scheduleSync();
        return;
    }

    _lastStateKey = stateKey;
    _currentIndex = -1;
    bindScroll();
    scheduleSync();
}

function getMutationRoots() {
    return [
        document.querySelector('#toc'),
        document.querySelector('.toc-widget'),
        document.querySelector('.note-detail'),
        document.querySelector('.note-detail-pane')
    ].filter(Boolean);
}

function bindTocManualScroll() {
    const tocBox = getTocScrollBox();
    if (!tocBox || tocBox === _tocScrollBox) return;

    if (_tocScrollBox && _tocScrollHandler) {
        _tocScrollBox.removeEventListener('scroll', _tocScrollHandler);
    }

    _tocScrollBox = tocBox;
    _tocScrollHandler = () => lockNavigation();
    _tocScrollBox.addEventListener('scroll', _tocScrollHandler, { passive: true });
}

function watchChanges(force = false) {
    const roots = getMutationRoots();
    const rootsKey = roots.map(root => root.id || root.className || root.tagName).join('|');
    if (!force && _mutationObserver && rootsKey && rootsKey === _watchingRootsKey) {
        bindTocManualScroll();
        return;
    }

    if (_mutationObserver) _mutationObserver.disconnect();
    _watchingRootsKey = rootsKey;

    let initAttempted = false;
    let mutationTimer = null;
    _mutationObserver = new MutationObserver(() => {
        if (isNavigationLocked()) return;

        clearTimeout(mutationTimer);
        mutationTimer = setTimeout(() => {
            if (!initAttempted || !getTocRoot() || !getTocItems().length || !getHeaders().length) {
                initAttempted = true;
                init();
            } else {
                refreshState();
            }
            bindTocManualScroll();
        }, 100);
    });

    roots.forEach(root => {
        _mutationObserver.observe(root, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class']
        });
    });

    bindTocManualScroll();
}

function jumpToHeader(index) {
    const headers = getHeaders();
    const header = headers[index];
    if (!header) return;

    header.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function injectTocStyle() {
    const oldStyle = document.getElementById('toc-position-highlight-style');
    if (oldStyle) oldStyle.remove();

    const style = document.createElement('style');
    style.id = 'toc-position-highlight-style';
    style.textContent = `
        #toc .toc-widget,
        #toc .body-wrapper,
        .toc-widget,
        .toc-widget .card-body {
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        #toc .toc li.current-reading,
        #toc .toc li.toc-current-item,
        .toc-widget li.current-reading,
        .toc-widget li.toc-current-item {
            border-radius: 3px;
        }

        #toc .toc li + ol::before,
        .toc-widget .toc li + ol::before {
            border-inline-start-width: 2px !important;
        }

        #toc .toc > ol > li + ol::before,
        .toc-widget .toc > ol > li + ol::before {
            border-inline-start-color: #39C5BB !important;
        }

        #toc .toc > ol > li + ol > li + ol::before,
        .toc-widget .toc > ol > li + ol > li + ol::before {
            border-inline-start-color: #FFE211 !important;
        }

        #toc .toc > ol > li + ol > li + ol > li + ol::before,
        .toc-widget .toc > ol > li + ol > li + ol > li + ol::before {
            border-inline-start-color: #FAAFBE !important;
        }

        #toc .toc > ol > li + ol > li + ol > li + ol > li + ol::before,
        .toc-widget .toc > ol > li + ol > li + ol > li + ol > li + ol::before {
            border-inline-start-color: #66CCFF !important;
        }

        #toc .toc > ol > li + ol > li + ol > li + ol > li + ol > li + ol::before,
        .toc-widget .toc > ol > li + ol > li + ol > li + ol > li + ol > li + ol::before {
            border-inline-start-color: #D80000 !important;
        }
    `;

    document.head.appendChild(style);
}

function init() {
    const tryInit = () => {
        const tocRoot = getTocRoot();
        const tocItems = getTocItems();
        const headers = getHeaders();

        if (tocRoot && tocItems.length && headers.length) {
            watchChanges(true);
            refreshState(true);
            bindTocManualScroll();
            return;
        }

        if (_retryCount < MAX_RETRY * 2) {
            _retryCount += 1;
            setTimeout(tryInit, config.refreshDelay);
        }
    };

    _retryCount = 0;
    watchChanges();
    tryInit();
}

function clearContextRefreshTimers() {
    _contextRefreshTimers.forEach(timer => clearTimeout(timer));
    _contextRefreshTimers = [];
}

function scheduleContextRefresh() {
    clearContextRefreshTimers();
    [0, 120, 280, 600, 1100, 1800].forEach(delay => {
        const timer = setTimeout(() => {
            _currentIndex = -1;
            _lastStateKey = '';
            watchChanges(true);
            refreshState(true);
            bindTocManualScroll();
        }, delay);
        _contextRefreshTimers.push(timer);
    });
}

function onNoteChange() {
    _currentIndex = -1;
    _lastStateKey = '';
    _manualCollapsedLi = null;
    _manualCollapseScrollMarker = null;
    scheduleContextRefresh();
    setTimeout(init, config.refreshDelay + 150);
}

function handleTocClickCapture(e) {
    if (!(e.target instanceof Element)) return;
    if (_programmaticTocToggle) return;

    const collapseButton = e.target.closest('#toc .collapse-button, .toc-widget .collapse-button');
    if (!collapseButton) return;

    const li = collapseButton.closest('li');
    if (!li) return;

    if (isCollapsed(li)) {
        _manualCollapsedLi = null;
        _manualCollapseScrollMarker = null;
        return;
    }

    const currentItem = getTocItems()?.[_currentIndex];
    if (currentItem && (li === currentItem || isAncestorLi(li, currentItem))) {
        _manualCollapsedLi = li;
        _manualCollapseScrollMarker = getScrollMarker();
    }

    setTimeout(() => refreshState(true), 120);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectTocStyle();
        setTimeout(init, 600);
    });
} else {
    injectTocStyle();
    setTimeout(init, 600);
}

window.addEventListener('resize', scheduleSync, { passive: true });
document.addEventListener('click', handleTocClickCapture, true);
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        onNoteChange();
    }
});
document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;

    const mayOpenAnotherContext = e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1;
    if (mayOpenAnotherContext && (
        e.target.closest('.fancytree-container')
        || e.target.closest('a[href^="#root/"]')
        || e.target.closest('a.reference-link')
        || e.target.closest('.note-list-widget')
        || e.target.closest('.note-book-card')
    )) {
        onNoteChange();
    }

    const tocSelector = '#toc, .toc-widget';
    if (e.target.closest(tocSelector + ' .collapse-button')) {
        return;
    }

    const tocLi = e.target.closest(tocSelector + ' .toc li') || e.target.closest(tocSelector + ' li');
    if (tocLi) {
        _manualCollapsedLi = null;
        _manualCollapseScrollMarker = null;
        const items = getTocItems();
        const index = items.indexOf(tocLi);
        if (index >= 0) {
            // 先高亮
            highlightByIndex(index, { keepVisible: false });
            // 强制滚动 TOC 到高亮项（处理高亮项不在可见区域的情况）
            requestAnimationFrame(() => forceScrollTocToItem(items[index]));
            // 再跳转正文
            setTimeout(() => jumpToHeader(index), 30);
            setTimeout(() => scheduleSync(), 1200);
        }
        return;
    }

    if (e.target.closest('.note-list-widget') || e.target.closest('.fancytree-container')) {
        _manualCollapsedLi = null;
        _manualCollapseScrollMarker = null;
        onNoteChange();
    }
});

window.addEventListener('hashchange', onNoteChange);
window.addEventListener('focus', () => setTimeout(scheduleContextRefresh, 120));
