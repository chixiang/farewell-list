# 告别清单 · Farewell List

> 一个让你「不做」事的 iOS app。  
> 断舍离不是"扔东西"，是"和过去好好告别"。

这是告别清单的官方主页，纯静态站点，用于展示和宣传。

## 🎨 设计语言

- **东方水墨** + **极简留白**
- 三套主题：**浅色（米白+淡赭）/ 深色（墨黑+淡青）/ 墨色（纯黑+朱砂）**
- 衬线字体（Noto Serif SC）标题 + 无衬线正文
- **呼吸感**：持续缓浮动（2.5s）、缓缩放（1.8s）—— 对应 app 的 DiaryEmptyView
- **仪式感**：逐字打字机（50ms/字）—— 对应 app 的 SplashQuoteView  
- **仪式感**：朱砂圆圈点击展开（0.5s spring）—— 对应 app 的 AddFarewell ceremony
- **物理反馈**：按压缩放（0.97x + 0.9opacity, 0.25s spring）—— 对应 app 的 PressScaleButtonStyle
- **错峰入场**：滚动触发的逐项延迟（60-80ms/index）—— 对应 app 的 DiaryListView

## 🛠️ 技术栈

- **纯静态** — HTML / CSS / 原生 JavaScript，零依赖
- **字体** — Google Fonts (Noto Serif SC + Noto Sans SC)
- **图标** — 内联 SVG
- **金句** — 跟 app 同步的 30 句（按一年中的第几天取模）

## 📁 目录结构

```
farewell-list/
├── index.html      # 主页面
├── styles.css      # 三套主题样式（含呼吸/仪式动画）
├── script.js       # 逐字打字机/主题切换/错峰入场/朱砂圆圈
└── README.md
```

## 🚀 本地预览

```bash
# 任意 HTTP 服务器即可，例如：
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

## 🌐 部署到 GitHub Pages

1. 把代码 push 到 GitHub 仓库
2. 进入 `Settings` → `Pages`
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main` / `root`
5. 保存，等待 1-2 分钟即可访问

## ✏️ 内容修改

| 想改什么 | 改哪里 |
|---------|--------|
| 标题、副标、CTA | `index.html` 里 hero section |
| 主题色 | `styles.css` 顶部 CSS variables |
| 字体 | `index.html` 里的 Google Fonts link + `styles.css` 里的 font-family |
| 金句 | `script.js` 顶部 `QUOTES` 数组（要跟 app 的 `daily_quotes.json` 保持同步） |
| 告别方式 | `index.html` 里的 method-grid |

## 🎯 设计原则

- **克制** — 极简留白，不堆砌动效
- **素** — 米白底、墨灰字、淡赭点缀
- **意** — 仪式感、克制

避免：
- ❌ Emoji
- ❌ 大色块
- ❌ 营销话术（"赶紧下载"）
- ❌ 渐变背景
- ❌ 不必要的大动效

## 💨 App 微交互映射

| App 文件 | 微交互 | 网站实现 |
|----------|--------|---------|
| `DiaryEmptyView.swift` | 树叶浮动（2.5s）+ 按钮脉动（1.8s） | Hero title 呼吸浮动 + CTA 按钮呼吸 |  
| `SplashQuoteView.swift` | 金句逐字揭示（0.15s/字）+ 出处淡入 | Hero 金句打字机（50ms/字）+ 出处 opacity 淡入 |
| `AddFarewellView.swift` | Ceremony 朱砂圆圈展开（0.5s spring） | 右下圆圈点击展开动画 |
| `DiaryView.swift` | 列表 0.06s/index 错峰 + scrollTransition | 所有卡片/模块同节奏错峰入场 |
| `PressScaleButtonStyle.swift` | 按压缩放（0.97x + 0.9 op, 0.25s spring） | 所有 `pressable` / `btn` / `:active` 元素 |
| `RootTabView.swift` | Tab 切换弹簧动画（0.5s） | 主题切换 0.6s ease-in-out background transition |

## 📜 License

MIT
