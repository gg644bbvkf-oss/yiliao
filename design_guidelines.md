# 乡镇卫生院小程序 - 设计指南

## 品牌定位

- **应用定位**：乡镇卫生院便民服务小程序
- **设计风格**：简洁清爽、温暖可信赖、适老化
- **目标用户**：农村居民、中老年患者、基层就医群众

## 配色方案

| 用途 | Tailwind 类名 | 色值 | 说明 |
|------|--------------|------|------|
| 主色 | `bg-teal-600` / `text-teal-600` | #0D9488 | TabBar 选中、主按钮、标题 |
| 辅色 | `bg-teal-400` / `text-teal-400` | #14B8A6 | 背景高亮、次要按钮 |
| 强调色 | `bg-orange-500` / `text-orange-500` | #F97316 | 行动召唤、号源提示 |
| 页面背景 | `bg-teal-50` | #F0FDFA | 极浅薄荷白 |
| 卡片背景 | `bg-white` | #FFFFFF | 卡片、模块底色 |
| 文字主色 | `text-slate-800` | #1E293B | 标题、正文 |
| 文字辅色 | `text-slate-500` | #64748B | 说明文字、时间 |
| 分割线 | `border-slate-200` | #E2E8F0 | 分割线、边框 |

## 字体规范

- 标题 H1：`text-2xl font-bold`（科室名、页面标题）
- 标题 H2：`text-xl font-bold`（模块标题）
- 标题 H3：`text-lg font-semibold`（卡片标题）
- 正文：`text-base`（内容、列表项）
- 辅助文字：`text-sm text-slate-500`（说明、时间戳）
- 所有垂直排列的 Text 必须添加 `block` 类

## 间距系统

- 页面边距：`px-4`（左右 16px）
- 卡片内边距：`p-4`
- 模块间距：`mb-4` 到 `mb-6`
- 列表项间距：`gap-3` 或 `space-y-3`
- 快捷入口图标间距：`gap-4`

## 组件使用原则

- 通用 UI 组件优先使用 `@/components/ui/*`（Button、Card、Badge、Input、Tabs、Dialog 等）
- 页面开发前先拆分 UI 单元，再映射到组件库
- 禁止用 View/Text 手搓按钮、输入框、弹窗、卡片等通用组件
- 按钮主操作用 `bg-teal-600 text-white`，强调操作用 `bg-orange-500 text-white`
- 卡片统一使用 `bg-white rounded-xl shadow-sm`

## 导航结构

- **TabBar**：首页、预约挂号、医院介绍、我的（4 个 tab）
- TabBar 选中色：`#0D9488`（teal-600）
- TabBar 未选中色：`#64748B`（slate-500）
- TabBar 页面跳转用 `Taro.switchTab()`
- 普通子页面跳转用 `Taro.navigateTo()`

## 适老化要点

- 按钮最小高度 `h-11`（lg 尺寸），主操作按钮 `h-12`
- 触控区域不小于 44x44
- 关键信息用 `text-lg` 以上字号
- 色彩对比度充足，避免浅色文字配浅色背景
- 预约成功等关键反馈使用大字号 + 图标

## 小程序约束

- 图片使用 TOS 对象存储 URL，不打包到项目
- TabBar 图标使用本地 PNG（通过 taro-lucide-tabbar 生成）
- 包体积控制在 2MB 以内
- 预约数据使用 Taro.setStorageSync / getStorageSync 本地存储
