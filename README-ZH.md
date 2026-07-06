# 🎨 Trilium Next v0.103.0 现代新布局主题 — 彩色视觉增强包

> **适配版本:** Trilium Next **v0.103.0**
> **作者:** [march-7th-mini (小三月)](https://github.com/march-7th-mini)
> **AI 协助:** [AstrBot](https://github.com/AstrBotDevs/AstrBot)
> **许可证:** [MIT](LICENSE)

---

## 一、简介

本合集为适配 Trilium Next **现代新布局主题** 提供一系列视觉增强脚本，融合 **VOCALOID / 765PRO 偶像大师应援色** 配色方案，让你的笔记树、标题、引用块、列表、Toast 通知等各个角落都充满色彩。同时包含实用的 UI 增强工具：明/暗主题切换按钮、目录浏览位置标记、启动栏背景色自定义、引用块背景色自定义、列表标记层级色自定义等。

**本包包含 9 个子笔记（插件）**，可按需启用/禁用。

![整体效果预览](images/overview.png)

---

## 二、子笔记功能一览

### 🎨 应援色系列

#### 1. VOCALOID歌姬应援色标题 — 三种风格适配

| 项目 | 说明 |
|---|---|
| **文件** | `VOCALOID歌姬应援色标题 - 三种风格适配` |
| **标签** | `#appCss` |
| **功能** | 为笔记标题（h2–h6）配上 VOCALOID 角色代表色。适配了三种标题风格：纯文本左边框竖条 / 下划线 / Markdown 彩色 ## 标记 |
| **配色** | • h2 初音ミク #39C5BB 苍绿色<br>• h3 镜音レン #FFE211 明黄色<br>• h4 巡音ルカ #FAAFBE 粉色<br>• h5 洛天依 #66CCFF 天蓝色<br>• h6 MEIKO #D80000 酒红色 |

<details>
<summary><strong>VOCALOID歌姬应援色标题 — 三种风格适配效果预览</strong></summary>

| 浅色主题 | 深色主题 |
|---|---|
| ![纯文本风格-浅色](images/heading-plain-light.png) | ![纯文本风格-深色](images/heading-plain-dark.png) |
| *纯文本风格-浅色主题* | *纯文本风格-深色主题* |
| ![下划线风格-浅色](images/heading-underline-light.png) | ![下划线风格-深色](images/heading-underline-dark.png) |
| *下划线风格-浅色主题* | *下划线风格-深色主题* |
| ![markdown风格-浅色](images/heading-markdown-light.png) | ![markdown风格-深色](images/heading-markdown-dark.png) |
| *markdown风格-浅色主题* | *markdown风格-深色主题* |

</details>

> [!TIP]
> 风格切换：去 Trilium **文本笔记** > 编辑器 > 标题风格 > 切换标题样式。
>
> ![标题风格设置](images/heading-style-setting.png)

#### 2. 765 PRO 偶像大师应援色 — 树导航 13 色循环

| 项目 | 说明 |
|---|---|
| **文件** | `765 PRO 偶像大师应援色树导航-13色循环` |
| **标签** | `#appCss` |
| **功能** | 树导航每个笔记项以 13 色循环显示彩色左边框和半透明悬停/选中背景。天海春香（第 1 位）拥有金色领队光效 |
| **配色** | 天海春香 #E22B30 → 音無小鳥 #009B9B |
| **修改** | 启用即生效。不想要彩色竖条可将 CSS 中 `border-left` 改为 0px |

<details>
<summary><strong>765 PRO 偶像大师应援色 — 树导航 13 色循环效果预览</strong></summary>

![树导航预览](images/tree-nav.gif) | ![树导航浅色](images/tree-nav-light.png) | ![树导航深色](images/tree-nav-dark.png)

</details>

#### 3. VOCALOID 引用块应援色

| 项目 | 说明 |
|---|---|
| **文件** | `VOCALOID blockquote colors | 引用块应援色` |
| **标签** | `#run=frontendStartup` |
| **功能** | 修改引用块背景色为 VOCALOID 风格色调，仅改背景色，不影响边框/间距/文字 |
| **配置标签** | `#VocaloidQuoteLightBackgroundColor=#e8faf8`（浅色）、`#VocaloidQuoteDarkBackgroundColor=#123330`（深色） |

<details>
<summary><strong>VOCALOID 引用块应援色效果预览</strong></summary>

| 浅色主题 | 深色主题 |
|---|---|
| ![引用块浅色](images/blockquote-light.png) | ![引用块深色](images/blockquote-dark.png) |

</details>

> [!TIP]
> 可以通过脚本的升级属性，快捷的设置自己喜欢的颜色。O(∩_∩)O
>
> ![引用块颜色配置](images/blockquote-config.png)

#### 4. VOCALOID 列表标记层级色

| 项目 | 说明 |
|---|---|
| **文件** | `VOCALOID list marker colors | 列表标记层级色` |
| **标签** | `#run=frontendStartup` |
| **功能** | 5 级列表嵌套各层级显示不同颜色标记（bullet / 编号），暗色主题带发光效果 |
| **配置标签** | `#VocaloidMarkerLevel1Color` ~ `#VocaloidMarkerLevel5Color`，5 级颜色均可自定义 |

<details>
<summary><strong>VOCALOID 列表标记层级色效果预览</strong></summary>

| 浅色主题 | 深色主题 |
|---|---|
| ![列表浅色](images/list-light.png) | ![列表深色](images/list-dark.png) |

</details>

> [!TIP]
> 可以通过脚本的升级属性，快捷的设置自己喜欢的颜色。O(∩_∩)O
>
> ![列表颜色配置](images/list-config.png)

#### 5. VOCALOID Toast 通知样式

| 项目 | 说明 |
|---|---|
| **文件** | `VOCALOID toast style | 消息Toast 位置与背景图` |
| **标签** | `#run=frontendStartup` |
| **功能** | Toast 通知消息换上 VOCALOID 风格：可配置位置、背景图片、亮/暗主题配色 |
| **配置标签** | `#VocaloidToastPosition`（位置）、`#VocaloidToastBackgroundImageUrl`（背景图）、`#VocaloidToastAccentColor`（强调色） |

<details>
<summary><strong>Toast 通知样式效果预览</strong></summary>

| 浅色主题 | 深色主题 |
|---|---|
| ![Toast浅色](images/toast-light.png) | ![Toast深色](images/toast-dark.png) |

</details>

> [!TIP]
> 可以通过脚本的升级属性，快捷的设置自己喜欢的颜色和背景图片。O(∩_∩)O
>
> ![Toast配置](images/toast-config.png)

### 🛠️ UI 增强系列

#### 6. 启动栏背景色自定义

| 项目 | 说明 |
|---|---|
| **文件** | `launcher pane background color` |
| **标签** | `#run=frontendStartup` |
| **功能** | 自定义启动栏的背景色和文字颜色。自动根据亮度调配对比文本色 |
| **配置标签** | `#LauncherPaneLightBackgroundColor=#123f3c`（浅色）、`#LauncherPaneDarkBackgroundColor=#11214c`（深色） |

<details>
<summary><strong>启动栏背景色自定义效果预览</strong></summary>

| 浅色主题 | 深色主题 |
|---|---|
| ![启动栏浅色](images/launcher-light.png) | ![启动栏深色](images/launcher-dark.png) |

</details>

> [!TIP]
> 可以通过脚本的升级属性，快捷的设置自己喜欢的颜色。O(∩_∩)O
>
> ![启动栏配置](images/launcher-config.png)

#### 7. 浅色/深色主题切换按钮

| 项目 | 说明 |
|---|---|
| **文件** | `theme toggle button` |
| **标签** | `#run=frontendStartup` |
| **功能** | 在启动栏添加 ☀/🌙 按钮，一键切换 next-light / next-dark 主题，设置持久化保存 |
| **配置标签** | `#ThemeToggleShortcut`（可选快捷键） |

<details>
<summary><strong>浅色/深色主题切换按钮效果预览</strong></summary>

![主题切换预览](images/theme-toggle.gif)

</details>

> [!NOTE]
> 可以通过脚本的升级属性，快捷的设置自己常用的快捷键。通过这个按钮切换主题不会强制使 Trilium 重载，这个切换按钮在适配主题配色的时候用来预览会很有用。
>
> ![主题快捷键配置](images/theme-shortcut-config.png)
>
> 注意：由于客户端的机制不同，发现切换后，客户端的右上角——最大化、最小化、关闭这三个按钮的背景颜色会受到一定影响。

#### 8. 右侧目录浏览位置标记

| 项目 | 说明 |
|---|---|
| **文件** | `show-position-in-toc` |
| **标签** | `#run=frontendStartup` |
| **功能** | 滚动正文时右侧目录自动高亮当前阅读位置，点击目录项跳转。支持新/旧两种布局 |
| **亮点** | 自动展开被折叠的父级目录、TOC 与正文滚动分离互不干扰、高亮背景 Gumi 绿 #ccff00 |

<details>
<summary><strong>右侧目录浏览位置标记效果预览</strong></summary>

| 目录滚动演示 1 | 目录滚动演示 2 |
|---|---|
| ![TOC演示1](images/toc-demo1.gif) | ![TOC演示2](images/toc-demo2.gif) |

</details>

#### 9. 启动信息 (MoTD)

| 项目 | 说明 |
|---|---|
| **文件** | `startup message 丨启动信息` |
| **标签** | `#run=frontendStartup` |
| **功能** | 启动时随机显示一条信息。信息从子 config 笔记的 `messages` 数组读取 |
| **用法** | 编辑 config 笔记中的 `messages` 数组即可自定义显示内容 |

<details>
<summary><strong>启动信息效果预览</strong></summary>

![启动信息预览](images/startup-message.png)

</details>

---

## 三、使用方式

> 下载附件后，右键左侧树导航，导入到笔记（取消勾选安全导入），按 F5 或 Ctrl+R 刷新页面。

> [!TIP]
> 每个子笔记均有对应的标签（`#appCss` / `#run=frontendStartup` / `#widget`），默认已启用。如需禁用：
>
> 1. 使用 Trilium Next **现代新布局主题** 打开该子笔记
> 2. 在右侧关闭即可。
>
> ![启用/禁用](images/enable-toggle.png)
>
> 3. 刷新页面生效
>
> **切换即可重新启用。**

---

## 四、注意事项

- **兼容版本**：Trilium Next **v0.103.0** 及更高版本
- **配置标签**：部分插件支持通过笔记标签自定义颜色/位置等参数，详见各子笔记注释头中的 `Configuration Labels` 段落
- **依赖关系**：本美化包脚本相互无依赖关系，可以自由的按需启用/禁用

---

## 五、致谢

本合集参考以下项目改编，特此致谢：

| 来源 | 贡献 |
|---|---|
| **Nriver** / startup message | 启动信息 MoTD 原作者 |
| **SiriusXT** / Blue theme | Blue 主题 |
| **SiriusXT** / Show Position in TOC | 目录浏览位置标记原始项目 |
| **云遥 (Yunyao)** | Trilium 主题 |
| **march-7th-mini** | VOCALOID 歌姬应援色主题整合与 Trilium Next 适配 |
| **AstrBot (AI)** | 代码注释、文档整理辅助 |

---

**如果能帮到您，不妨点个 star 吧！O(∩_∩)O**

---

[⬆ 返回语言选择页](README.md)
