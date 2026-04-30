# Career Profile Page

个人求职展示网页，基于 `Next.js App Router + TypeScript + Tailwind CSS + Framer Motion` 搭建，适合部署到 Vercel。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 构建

```bash
npm run build
npm run start
```

## 页面文案与数据

主要内容集中在：

- `src/lib/content.ts`：教育、经历、能力、项目、联系方式等数据
- `src/components/Hero.tsx`：首屏文案与浮空卡片
- `src/components/About.tsx`：About Me 文案

## 组件结构

- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/components/About.tsx`
- `src/components/Education.tsx`
- `src/components/Experience.tsx`
- `src/components/OtherExperience.tsx`
- `src/components/Capabilities.tsx`
- `src/components/Projects.tsx`
- `src/components/Contact.tsx`

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 `Next.js`。
4. 保持默认构建命令即可：

```bash
npm run build
```

5. 点击 Deploy。
