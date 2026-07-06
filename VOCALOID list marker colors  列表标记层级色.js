/* ============================================================
 *  VOCALOID List Marker Colors | 列表标记层级色
 * ============================================================
 *
 *  [ English ]
 *  Colors ordered/unordered list markers (bullets & numbers)
 *  at different nesting levels with VOCALOID character colors.
 *  Only the marker color is changed — the text color remains
 *  untouched.
 *
 *  In dark theme, markers automatically get a soft glow effect
 *  for better visibility.
 *
 *  Color palette (5 nesting levels):
 *    Level 1  #ff0000  Red
 *    Level 2  #da00ff  Purple
 *    Level 3  #00bcd4  Cyan
 *    Level 4  #ffc107  Amber
 *    Level 5  #795548  Brown
 *
 *  Config labels:
 *    #VocaloidMarkerLevel1Color=#ff0000
 *    #VocaloidMarkerLevel2Color=#da00ff
 *    #VocaloidMarkerLevel3Color=#00bcd4
 *    #VocaloidMarkerLevel4Color=#ffc107
 *    #VocaloidMarkerLevel5Color=#795548
 *
 *
 *  [ 中文 ]
 *  为不同层级的有序/无序列表标记（bullet 和数字）
 *  配上 VOCALOID 角色代表色。
 *  只改变 marker 颜色，不改变正文文字颜色。
 *
 *  暗色主题下自动添加发光效果，提升可读性。
 *
 *  配色表（5 级嵌套）：
 *    第1层  #ff0000  红
 *    第2层  #da00ff  紫
 *    第3层  #00bcd4  青
 *    第4层  #ffc107  琥珀
 *    第5层  #795548  棕
 *
 *  配置标签:
 *    #VocaloidMarkerLevel1Color=#ff0000
 *    #VocaloidMarkerLevel2Color=#da00ff
 *    #VocaloidMarkerLevel3Color=#00bcd4
 *    #VocaloidMarkerLevel4Color=#ffc107
 *    #VocaloidMarkerLevel5Color=#795548
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
    if (window.__vocaloidListMarkerColors) return;
    window.__vocaloidListMarkerColors = true;

    const STYLE_ID = 'vocaloid-list-marker-colors-style';
    const DEFAULTS = {
        VocaloidMarkerLevel1Color: '#ff0000',
        VocaloidMarkerLevel2Color: '#da00ff',
        VocaloidMarkerLevel3Color: '#00bcd4',
        VocaloidMarkerLevel4Color: '#ffc107',
        VocaloidMarkerLevel5Color: '#795548'
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
        if (/^#([0-9a-f]{3}){1,2}$/i.test(color)) return color;
        return fallback;
    }

    function colorLabel(name) {
        return normalizeColor(getLabelValue(name, DEFAULTS[name]), DEFAULTS[name]);
    }

    function injectStyle() {
        const c1 = colorLabel('VocaloidMarkerLevel1Color');
        const c2 = colorLabel('VocaloidMarkerLevel2Color');
        const c3 = colorLabel('VocaloidMarkerLevel3Color');
        const c4 = colorLabel('VocaloidMarkerLevel4Color');
        const c5 = colorLabel('VocaloidMarkerLevel5Color');

        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        style.textContent = `
.note-detail .ck-content :is(ol, ul) > li::marker,
.note-detail-readonly-text :is(ol, ul) > li::marker,
.note-detail-editable-text-editor :is(ol, ul) > li::marker {
    color: ${c1} !important;
    font-weight: 700;
}
.note-detail .ck-content :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-readonly-text :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-editable-text-editor :is(ol, ul) :is(ol, ul) > li::marker {
    color: ${c2} !important;
}
.note-detail .ck-content :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-readonly-text :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-editable-text-editor :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker {
    color: ${c3} !important;
}
.note-detail .ck-content :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-readonly-text :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-editable-text-editor :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker {
    color: ${c4} !important;
}
.note-detail .ck-content :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-readonly-text :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker,
.note-detail-editable-text-editor :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) :is(ol, ul) > li::marker {
    color: ${c5} !important;
}

/* 暗色主题：列表标记发光 */
@media (prefers-color-scheme: dark) {
    .note-detail .ck-content li::marker,
    .note-detail-readonly-text li::marker,
    .note-detail-editable-text-editor li::marker {
        text-shadow: 0 0 3px currentColor, 0 0 8px currentColor;
    }
}
`;
    }

    injectStyle();
})();
