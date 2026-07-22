# 🎨 TriliumNext Modern New Layout Theme — Colorful Visual Pack

> **Compatible with:** Trilium Next **v0.103.0** later
> **Author:** [march-7th-mini](https://github.com/march-7th-mini)
> **AI Assistant:** [AstrBot](https://github.com/AstrBotDevs/AstrBot)
> **License:** [AGPL-3.0](LICENSE)

---

## 1. Introduction

A collection of visual enhancement scripts for the Trilium Next **Modern New Layout**. It blends **VOCALOID / 765PRO Idol Master support color** schemes into note trees, headings, blockquotes, lists, toasts, and more. It also includes useful UI tools: a light/dark theme toggle button, scroll-synced TOC, customizable launcher pane background color, customizable blockquote background color, multi-level list marker colors, and more.

**This pack contains 9 sub-notes (plugins)**, each can be enabled or disabled independently.

![Overall preview](images/overview.png)

---

## 2. Plugin Overview

### 🎨 Support Color Series

#### 1. VOCALOID Heading Styles — 3 Variants

| Item | Description |
|---|---|
| **File** | `VOCALOID歌姬应援色标题 - 三种风格适配` |
| **Label** | `#appCss` |
| **Feature** | Colors note headings (h2–h6) with VOCALOID character colors. Supports three heading styles: plain left border / underline / Markdown colored ## marker |
| **Palette** | • h2 Miku Hatsune #39C5BB Teal<br>• h3 Len Kagamine #FFE211 Bright yellow<br>• h4 Luka Megurine #FAAFBE Pink<br>• h5 Luo Tianyi #66CCFF Sky blue<br>• h6 MEIKO #D80000 Wine red |

<details>
<summary><strong>VOCALOID Heading Styles — Preview</strong></summary>

| Light theme | Dark theme |
|---|---|
| ![Plain style - Light](images/heading-plain-light.png) | ![Plain style - Dark](images/heading-plain-dark.png) |
| *Plain style — Light theme* | *Plain style — Dark theme* |
| ![Underline style - Light](images/heading-underline-light.png) | ![Underline style - Dark](images/heading-underline-dark.png) |
| *Underline style — Light theme* | *Underline style — Dark theme* |
| ![Markdown style - Light](images/heading-markdown-light.png) | ![Markdown style - Dark](images/heading-markdown-dark.png) |
| *Markdown style — Light theme* | *Markdown style — Dark theme* |

</details>

> [!TIP]
> To switch styles, go to Trilium **Text Notes** > Editor > Heading Style.
>
> ![Heading style setting](images/heading-style-setting.png)

#### 2. 765 PRO Idol Colors — Tree Navigation 13-Color Cycle

| Item | Description |
|---|---|
| **File** | `765 PRO 偶像大师应援色树导航-13色循环` |
| **Label** | `#appCss` |
| **Feature** | Each tree item gets a colored left border in a 13-color cycle, with semi-transparent hover/selected backgrounds. Haruka Amami (#1) has a gold leader glow effect |
| **Palette** | Haruka #E22B30 → Kotori #009B9B |
| **Modification** | Works out of the box. Set `border-left` to 0px in the CSS if you don't want colored borders |

<details>
<summary><strong>765 PRO Idol Colors — Tree Navigation Preview</strong></summary>

![Tree navigation preview](images/tree-nav.gif) | ![Tree nav light](images/tree-nav-light.png) | ![Tree nav dark](images/tree-nav-dark.png)

</details>

#### 3. VOCALOID Blockquote Colors

| Item | Description |
|---|---|
| **File** | `VOCALOID blockquote colors \| 引用块应援色` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Colors blockquote backgrounds with VOCALOID-inspired tints. Only background is changed — borders, spacing, and text are untouched |
| **Config Labels** | `#VocaloidQuoteLightBackgroundColor=#e8faf8` (light), `#VocaloidQuoteDarkBackgroundColor=#123330` (dark) |

<details>
<summary><strong>VOCALOID Blockquote Colors — Preview</strong></summary>

| Light theme | Dark theme |
|---|---|
| ![Blockquote light](images/blockquote-light.png) | ![Blockquote dark](images/blockquote-dark.png) |

</details>

> [!TIP]
> You can quickly customize the colors via the script's promoted attributes. O(∩_∩)O
>
> ![Blockquote config](images/blockquote-config.png)

#### 4. VOCALOID List Marker Colors

| Item | Description |
|---|---|
| **File** | `VOCALOID list marker colors \| 列表标记层级色` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Colors ordered/unordered list markers at 5 nesting levels with different colors. Dark theme adds a soft glow effect |
| **Config Labels** | `#VocaloidMarkerLevel1Color` ~ `#VocaloidMarkerLevel5Color`, all 5 levels are customizable |

<details>
<summary><strong>VOCALOID List Marker Colors — Preview</strong></summary>

| Light theme | Dark theme |
|---|---|
| ![List light](images/list-light.png) | ![List dark](images/list-dark.png) |

</details>

> [!TIP]
> You can quickly customize the colors via the script's promoted attributes. O(∩_∩)O
>
> ![List config](images/list-config.png)

#### 5. VOCALOID Toast Style

| Item | Description |
|---|---|
| **File** | `VOCALOID toast style \| 消息Toast 位置与背景图` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Styles notification toasts with a VOCALOID theme. Configurable position, background image, and light/dark colors |
| **Config Labels** | `#VocaloidToastPosition` (position), `#VocaloidToastBackgroundImageUrl` (background image), `#VocaloidToastAccentColor` (accent color) |

<details>
<summary><strong>Toast Style — Preview</strong></summary>

| Light theme | Dark theme |
|---|---|
| ![Toast light](images/toast-light.png) | ![Toast dark](images/toast-dark.png) |

</details>

> [!TIP]
> You can quickly customize the colors and background image via the script's promoted attributes. O(∩_∩)O
>
> ![Toast config](images/toast-config.png)

### 🛠️ UI Enhancement Series

#### 6. Launcher Pane Background Color

| Item | Description |
|---|---|
| **File** | `launcher pane background color` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Customize the background & text color of the launcher pane. Automatically picks a contrasting text color based on luminance |
| **Config Labels** | `#LauncherPaneLightBackgroundColor=#123f3c` (light), `#LauncherPaneDarkBackgroundColor=#11214c` (dark) |

<details>
<summary><strong>Launcher Pane Background Color — Preview</strong></summary>

| Light theme | Dark theme |
|---|---|
| ![Launcher light](images/launcher-light.png) | ![Launcher dark](images/launcher-dark.png) |

</details>

> [!TIP]
> You can quickly customize the colors via the script's promoted attributes. O(∩_∩)O
>
> ![Launcher config](images/launcher-config.png)

#### 7. Light/Dark Theme Toggle Button

| Item | Description |
|---|---|
| **File** | `theme toggle button` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Adds a ☀/🌙 button to the launcher pane for one-click switching between next-light / next-dark themes. Settings are persisted |
| **Config Labels** | `#ThemeToggleShortcut` (optional keyboard shortcut) |

<details>
<summary><strong>Theme Toggle Button — Preview</strong></summary>

![Theme toggle preview](images/theme-toggle.gif)

</details>

> [!NOTE]
> You can configure a convenient keyboard shortcut via the script's promoted attributes. Toggling the theme this way does **not** force a Trilium reload — very useful for previewing theme color adaptations.
>
> ![Theme shortcut config](images/theme-shortcut-config.png)
>
> Note: Due to differences in client mechanisms, the background color of the top-right window buttons (minimize, maximize, close) may be slightly affected after switching themes.

#### 8. Show Position in TOC

| Item | Description |
|---|---|
| **File** | `show-position-in-toc` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Highlights the current reading position in the right-side TOC as you scroll. Click to jump. Supports both new and classic layouts |
| **Highlights** | Auto-expands collapsed parent items, TOC & body scroll are independent, highlight background: Gumi green #ccff00 |

<details>
<summary><strong>Show Position in TOC — Preview</strong></summary>

| TOC demo 1 | TOC demo 2 |
|---|---|
| ![TOC demo 1](images/toc-demo1.gif) | ![TOC demo 2](images/toc-demo2.gif) |

</details>

#### 9. Startup Message (MoTD)

| Item | Description |
|---|---|
| **File** | `startup message 丨启动信息` |
| **Label** | `#run=frontendStartup` |
| **Feature** | Displays a random message on startup. Messages are read from the child config note's `messages` array |
| **Usage** | Edit the `messages` array in the child config note to customize the content |

<details>
<summary><strong>Startup Message — Preview</strong></summary>

![Startup message preview](images/startup-message.png)

</details>

---

## 3. How to Use

> Download the attachment archive, then right-click the left tree panel, select "Import into notes" (uncheck "Safe Import"), and press F5 or Ctrl+R to refresh the page.

> [!TIP]
> Each sub-note already has the required label (`#appCss` / `#run=frontendStartup` / `#widget`), enabled by default. To disable:
>
> 1. Open the sub-note in the **Trilium Next Modern New Layout**
> 2. Toggle it off on the right-hand panel.
>
> ![Enable/disable toggle](images/enable-toggle.png)
>
> 3. Refresh the page to apply.
>
> **Toggle it back on to re-enable.**

---

## 4. Notes

- **Compatibility**: Trilium Next **v0.103.0** and above
- **Config labels**: Some plugins support customization via note labels — see each sub-note's `Configuration Labels` section for details
- **Dependencies**: The scripts in this pack have **no dependencies on each other** — feel free to enable or disable any of them as you wish

---

## 5. Credits

This pack is adapted with reference to the following projects:

| Source | Contribution |
|---|---|
| **Nriver** / startup message | Original startup message (MoTD) author |
| **SiriusXT** / Blue theme | Blue theme |
| **SiriusXT** / Show Position in TOC | Original TOC position project |
| **Yunyao (云遥)** | Trilium theme |
| **march-7th-mini** | VOCALOID support color theme integration & Trilium Next adaptation |
| **AstrBot (AI)** | Code annotation & documentation assistance |

---

**If you find this helpful, feel free to give it a star! O(∩_∩)O**

---

[⬆ Back to language selection](README.md)
