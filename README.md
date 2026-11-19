# 周兴贤 · 三维视觉作品集

React + Vite 单页作品集。PC 版心最大 1700px，同时适配平板与手机。

## 本地运行

```sh
pnpm install
pnpm dev
```

预览地址：http://127.0.0.1:5186/ 。构建：`pnpm build`；构建预览：`pnpm preview`。

## 真实作品

已导入桌面作品集的 34 张图片、7 个视频，共 7 个分组：

| 编号 | 分组 | 素材数量 | 原始来源 |
| --- | --- | --- | --- |
| 01 | 产品动画 | 3 个视频 | 视频/通用 |
| 02 | PV | 4 个视频 | 图片/PV |
| 03 | 首页视觉设计 | 6 张图片 | 图片/首页 |
| 04 | 母婴 | 9 张图片 | 图片/母婴 |
| 05 | 家具 | 9 张图片 | 图片/家具 |
| 06 | 办公椅 | 6 张图片 | 图片/办公椅 |
| 07 | 货架 | 4 张图片 | 图片/货架 |
原始文件未改动。图片转换为 WebP 大图与缩略图，保持完整比例；视频保留原文件内容，按需加载。首页视频沿用通用_产品动画_001.mp4。旧演示项目已从网站展示中移除。

- `src/works.json`：作品分组、排序、封面选择、素材路径与原文件映射。
- `src/WorkGallery.jsx`、`src/works.css`：分组封面、图片/视频筛选、作品浏览弹窗。
- `public/media/works/`：导入后的素材和视频封面。
- `scripts/import_portfolio.py`：从指定图片与视频目录重新导入，使用 Pillow 生成 WebP。
- `poster-studio.html`：开发环境提取七个视频的封面；生成后保存到上述素材目录。

## 网站样式与个人资料

首页 ZHOUXX 左对齐红字与视频透叠，全站红色强调色、圆角与悬浮换色。主要样式位于 `src/style.css`、`src/hero.css`、`src/theme.css`。

介绍与三段工作经历来自简历。关于我使用根据用户新参考图生成的三维卡通艺术家挂绳卡片：棕色棒球帽、格纹外套、手持咖啡的全身角色。简历没有电话、邮箱，联系入口使用站酷主页，支持复制链接。

## 浏览功能

点击分组查看全部组内素材，支持缩略图、上一件/下一件、键盘左右方向键、Esc 关闭、查看大图/打开视频。视频自带播放、声音和全屏控制；观看作品时暂停首页视频，关闭后恢复。

## 轮播规则

图片仅在鼠标移入画面区域后轮播，每张成功加载后停留 2 秒；移出暂停。视频自动静音播放，播放结束后保留末帧 1 秒，再切换下一部，组末循环。作品卡片与组内弹窗均支持手动切换；离开可视区域、切换浏览器标签或打开弹窗时暂停背景卡片。


## GradualBlur 渐进模糊

使用用户提供的 React Bits / Ansh Dhanani 组件源码，位于 `src/GradualBlur.jsx` 与 `src/GradualBlur.css`。首屏视频底部使用 8 层渐进模糊衔接暗色背景；进入第二屏后，页面下缘显示轻量渐进磨砂，并在滚动到底部时自动淡出。叠层不接收鼠标事件，导航、文字和首屏播放按钮保持清晰可操作。已适配 React + Vite，并让自动隐藏跟随作品卡片展开导致的页面高度变化。

## AccordionGallery 分组画廊

使用用户提供的 React Bits AccordionGallery 源码与 GSAP。01 产品动画、02 PV、03 首页视觉设计、04 母婴、05 家具、06 办公椅、07 货架各占一整行，横向展示组内所有素材。

- 鼠标移动到面板时展开，支持键盘方向键和触屏操作。
- 图片在鼠标位于组内时每 2 秒自动切换；视频播放完停留 1 秒后切换。
- 每组支持前后切换，点击展开项或“查看全部”进入详情并定位当前作品。
- 文件：`src/AccordionGallery.jsx`、`src/AccordionGallery.css`、`src/AccordionGroup.jsx`、`src/accordion-groups.css`。

## GSAP / ScrollTrigger 动效

- 从首页进入时播放约 3.7 秒片头：红色幕布揭开，ZHOUXX 逐字位移、压缩后归位，导航和首屏信息按节奏出现。不等待视频加载，不锁定滚动；滚轮、触屏滑动或导航操作可直接继续浏览。
- 关于我、精选作品、专业能力与联系模块新增英文大标题，遮罩内大幅位移进场，随后揭开内容；经历、能力卡片与每组画廊图片按顺序出现，单次触发。
- 桌面鼠标设备启用视频背景和联系区图形的轻微滚动视差；关于我头像区域已使用独立的三维挂绳交互，手机保留揭幕动效，取消持续视差。尊重系统“减少动态效果”设置。
- 进场只控制独立遮罩，保留手风琴画廊自身的尺寸、旋转和媒体位移。筛选后更新滚动触发位置；卸载和偏好变化时清理动画与监听。
- 动效集中在 `src/usePortfolioMotion.js`，版式与遮罩样式位于 `src/motion.css`，英文标题组件位于 `src/SectionHeading.jsx`。

## React Bits SplitText 文字动效

根据用户提供的完整组件源码接入 `src/SplitText.jsx`，使用 GSAP SplitText、ScrollTrigger 和 `@gsap/react`。首屏 ZHOUXX、英文模块标题、中文主标题、项目分组名和能力卡片标题采用逐字遮罩揭开；关于我的两段介绍按行揭开，保留原来的正文层次和颜色。

- 首屏拆字与 opening 揭幕同步；直接打开模块链接、恢复滚动位置或跳过片头时，文字直接显示。
- 英文模块大标题支持桌面鼠标邻近抬升，使用更强阻尼平滑归位，不自动循环；触屏禁用鼠标效果。
- 文字动画取代原先手动拆字的进场，图片、卡片和视差仍由各自的动画控制。
- 等待字体设有 900 毫秒上限，后续字体和宽度变化交由自动重拆分处理；减少动态效果模式直接显示文字。
- `src/TextReveal.jsx` 提供中文标题和正文的统一参数；`src/SplitText.css` 处理原网站标题和换行样式的兼容。

## React Bits Lanyard 艺术家卡片

关于我左侧已替换为用户提供的 Three.js Lanyard 源码，位于 `src/Lanyard.jsx`。由 `src/ArtistLanyard.jsx` 集成：红色织带、金属扣、黑色双面卡片，正面是三维卡通形象与姓名，背面是创作方向与已有站酷地址。支持拖拽摆动、点击翻转，聚焦后按 Enter 或空格也可翻面。

接近区域时才动态加载 Three.js；离屏或隐藏浏览器标签时停止动画，最多 60 帧/秒，屏幕像素比上限为桌面 1.5、手机 1.25。WebGL 不可用时保留静态卡面；减少动态效果模式取消入场甩动和持续微风。

- 卡通形象：`public/media/avatar-3d-cartoon-v2.png`，内置 imagegen 根据用户新角色参考生成，来源与完整提示词见 `public/media/avatar-3d-cartoon-v2.prompt.md`；原版素材保留。
- 卡面：`public/media/artist-card-front-v2.svg`、`public/media/artist-card-back.svg`；织带：`public/media/artist-strap.svg`。正面 SVG 内嵌卡通图像，可独立加载。
- 修改卡面排版后运行 `node scripts/build-artist-card.mjs`；`node scripts/check-lanyard.mjs` 检查落下、拖拽释放、翻面与低帧率下的物理稳定性，不代替 WebGL 浏览器实测。

## React Bits TargetCursor

使用用户提供的 `TargetCursor` 源码，位于 `src/TargetCursor.jsx` 和 `src/TargetCursor.css`。桌面鼠标默认显示细线定位框，4 秒旋转一圈；悬停导航、链接、按钮和手风琴作品面板时贴合其边缘，颜色转为白色。重要入口与作品面板显示简短操作提示，按下时轻微收拢。

原生视频控件、挂绳画布、输入框保留系统光标；触屏和减少动态效果模式不启用。键盘 Tab、离开窗口和隐藏标签时恢复系统光标。作品详情原生 dialog 打开后，光标装饰移入其顶层，避免被遮挡。装饰不拦截点击事件；组件卸载时清理光标样式和事件。

`node scripts/check-target-cursor.mjs` 检查 144、60、30、20 帧/秒下的跟随、贴合收敛和运动范围。

## React Bits Pro 安装准备

`components.json` 已配置官方 `@reactbits-starter` 与 `@reactbits-pro` registry，Authorization 通过 `${REACTBITS_LICENSE_KEY}` 环境变量引用。`jsconfig.json` 与 Vite 配置提供 `@/` 路径别名，`src/reactbits.css` 提供 Tailwind v4 工具类及网站黑红色设计变量，不引入全站基础样式重置。

Dappled Light 尚未安装：本次准备时未找到有效的许可证环境变量。先在项目根目录 `.env.local` 填写 `REACTBITS_LICENSE_KEY`，再运行 `npx shadcn@latest add @reactbits-starter/dappled-light-tw`。密钥文件已加入忽略列表，不应复制进前端代码或使用 `VITE_` 前缀。

官方 Dappled Light 未下载，registry 配置保留。联系屏现已根据用户后续提供的完整源码改用 Lightfall，不依赖 Pro 许可证。

官方文档：[安装](https://pro.reactbits.dev/docs/installation)、[Dappled Light 参数](https://pro.reactbits.dev/docs/components/dappled-light)。

## React Bits Particles 页面背景

使用用户提供的完整 Particles JavaScript + CSS 源码，位于 `src/Particles.jsx` 和 `src/Particles.css`，不依赖 Pro 许可证或额外依赖。`src/PageParticles.jsx` 将单个固定视口画布用于首屏以下的关于我、精选作品与专业能力；首屏仍由原视频覆盖，联系屏使用独立 Lightfall。区块背景采用局部半透明处理，粒子始终位于文字、作品和交互层下方，不拦截鼠标和触屏事件。

- 柔白与暖灰为主，少量红色点缀；缓慢漂浮、低亮度连线、轻微鼠标排斥，关闭点击爆发效果。
- 桌面 210 个粒子、最多 60 帧/秒、像素比 1.25；手机 100 个粒子、最多 30 帧/秒、像素比 1，并关闭连线和鼠标响应。
- 滚动至首屏以下才加载组件；返回首屏或隐藏浏览器标签后停止动画。系统减少动态效果模式显示静态粒子，偏好变化即时生效。无 WebGL 时维持现有深色背景与完整内容。
- `node scripts/check-particles.mjs` 用模拟 WebGL 检查实际组件初始化、上传数据、视口画布尺寸、帧率上限、暂停、标签切换、减少动态效果及资源清理，不代替浏览器 GPU 与视觉实测。

## 自我介绍两栏排版

`src/AboutSection.jsx` 和 `src/about-editorial.css` 按用户参考重排：左侧突出可拖拽卡片，右侧使用小号 ABOUT ME、两行 CRAFTING REALITY. 标题、三个创作方向标签、精简介绍、精选作品及产品动画入口。下方独立展示工作经历时间轴，保留已有站酷链接。

挂绳画布向上延伸至首屏下方分隔栏，消除上方断层；右侧文案保留自己的起始间距。Lanyard 的投影按延伸部分修正，保持卡片原本的大小和位置，静态卡面同时适配。桌面延伸 64px，手机延伸 35px，几何与摆动检查均在 `scripts/check-lanyard.mjs` 中。

## 专业能力卡片

自我介绍的 CRAFTING / REALITY. 标题现启用 SplitText 鼠标局部抬升；两段正文使用轻微行抬升及重点文字变色。三个能力标签接入 SpecularButton 高光与悬浮换色，意向城市显示亮度和位移反馈；三段工作经历加入独立圆角高光区域、文字提亮和时间轴节点呼应。以上区域均加入现有白色 TargetCursor 定位框，静态文字与标签保留非按钮语义。保留减少动态效果降级、原有文案、链接与入场动效。

`src/ExpertiseSection.jsx` 与 `src/expertise-services.css` 按用户的服务卡片参考重排专业能力模块：轻字重 MY EXPERTISE 标题、右上圆形切换按钮、独立深色圆角卡片，以及居中的图标、能力标题、介绍、工具与实际作品入口。原有四项能力完整保留，桌面展示三张、平板两张、手机一张，可点击箭头、触屏横滑或聚焦后使用左右方向键切换；边界箭头禁用，屏幕外卡片不进入键盘焦点。

卡片保留单次遮罩错峰入场与文字动效；横向切换使用浏览器滚动吸附，尊重减少动态效果设置。产品动画链接使用现有 `/media/product-film.mp4`，其余入口指向精选作品或联系模块。

## 首屏下方磨砂横栏

`src/discipline-glass.css` 将专业方向横栏改为透明磨砂玻璃，使用 24px 背景模糊、低透明度底色和细边缘高光。首屏同一视频向下延伸到横栏背后，再由横栏覆盖，无需增加第二个视频。首屏按钮和主体内容保持原先的位置，挂绳继续与横栏下缘衔接。三个红色星形分隔符已换成简洁的细斜线；桌面横栏 76px，手机 60px，不支持背景模糊时使用深色半透明底色。

## 工作经历时间轴

`src/CareerTimeline.jsx` 与 `src/career-timeline.css` 将原工作经历列表重排为横向三段时间轴，顶部使用 CAREER PATH / 工作经历，细线连接三个圆形节点，依次展示原有日期、公司、职位标签及工作方向。最近一段经历用网站主红色强调，三段经历按原顺序完整保留。自我介绍后直接衔接时间轴，原 04 年 / 03 段 / 03 类数据横排已移除，收紧段落间距；手机端时间轴转为纵向。经历正文错峰揭开，节点和连线保持稳定。

## 联系屏 Lightfall 背景

`src/Lightfall.jsx` 和 `src/Lightfall.css` 使用用户提供的完整 React Bits 源码，通过 `src/ContactLightfall.jsx` 应用于最后的联系屏。原圆环与独立大箭头已移除；当前排版由 `src/ContactSection.jsx` 和 `src/contact-composition.css` 管理，缩小 LET’S TALK，将中文主标题、说明与联系按钮居中排列。联系入口、复制与返回顶部功能保留；局部深色遮罩保证内容清晰，背景不接收点击事件。

- 接近联系屏时动态加载；离屏或隐藏浏览器标签后暂停。联系屏覆盖整个视口时，后方全站粒子也会暂停，避免重复渲染。
- 桌面采用 45 帧/秒与像素比 1，保留弱泛光与鼠标光场；手机采用 30 帧/秒与像素比 0.75，关闭泛光和鼠标交互。
- 背景顶部改为低饱和暖灰，光晕强度由 0.14 降至 0.055，整体光效亮度与透明度下调。调色板为七份灰白与一份低饱和暖红，红色流星的随机配色占比由约三分之一降至八分之一，正文与联系按钮继续使用网站主红色。
- 关闭按压加速，系统减少动态效果时显示静态光效，无 WebGL 时保留深色渐变底色。支持上下文恢复和资源清理。
- `node scripts/check-lightfall.mjs` 用模拟 WebGL 检查初始化、上传数据、画布大小、帧率限制、暂停、标签切换、减少动态效果与 GPU 资源清理，不代替真实浏览器 GPU 与视觉实测。

## SpecularButton 高光按钮

2026-11-18 已完成媒体、WebGL、滚动、GSAP 与首屏性能优化，具体体积对比、验证范围和维护方式见 [PERFORMANCE.md](./PERFORMANCE.md)。

`src/SpecularButton.jsx` 与 `src/SpecularButton.css` 接入用户提供的 React Bits 源码；`src/PortfolioButton.jsx` 和 `src/portfolio-buttons.css` 适配红色、米白与透明磨砂三种主题。应用于顶部合作按钮、首屏作品与视频控制、个人介绍作品入口、底部联系和复制按钮。保留原有悬浮换色、白色光标定位框及点击功能；链接仍使用原生锚点，支持新窗口打开和键盘操作。

专业能力的四张卡片也使用同一高光效果，以原生 article 展示内容，保留内部链接、卡片排版、轮播和白色光标框。卡片使用独立尺寸样式，不套用按钮的内边距或按压缩放。

仅接近视口的桌面按钮或卡片启用 WebGL 高光，像素比上限 1.5；指针停稳后停止逐帧渲染，离屏或隐藏标签页时暂停。触屏、减少动态效果偏好及无 WebGL 环境保留 CSS 外观。筛选和轮播控件维持现有样式，以控制 GPU 上下文数量。

`node scripts/check-specular-button.mjs` 检查原生链接、点击回调、禁用语义、像素比、上传数据、指针收敛、静止暂停、标签页切换、减少动态效果及清理；该模拟检查不代替真实浏览器 GPU 与视觉实测。
