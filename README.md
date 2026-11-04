# PDF++ 水印工坊 · 官网

零依赖静态落地页，用于展示 PDF++ 水印工坊的卖点与价格。

- 站点地址：`https://xutiantian258.github.io/`
- 仓库地址：`https://github.com/xutiantian258/xutiantian258.github.io`
- 购买咨询：`xudadiao102@gmail.com`

## 本地预览

在项目根目录运行：

```bat
python -m http.server 4173 --directory site
```

然后打开 `http://127.0.0.1:4173/`。

## 当前配置

所有站点级配置都在 `assets/app.js` 顶部的 `SITE` 对象里：

```js
const SITE = {
  downloadUrl: "https://github.com/xutiantian258/xutiantian258.github.io/releases/latest",
  contactEmail: "xudadiao102@gmail.com",
  githubUrl: "https://github.com/xutiantian258/xutiantian258.github.io",
  siteUrl: "https://xutiantian258.github.io"
};
```

- `downloadUrl`：试用版下载地址，当前指向站点仓库的 Releases。`v1.3.0` 安装包已上传，`/releases/latest` 会自动跳到该版本。
- `contactEmail`：个人版 / 工作室版 / 机构版的购买咨询邮箱。购买按钮会自动带上版本名称和机器码提示。
- `githubUrl`：页脚 GitHub 链接。
- `siteUrl`：页脚显示的站点地址，同时会更新链接。

`index.html` 里的 canonical、`og:url` 和页脚域名也已同步为 `xutiantian258.github.io`。

## 部署为 `xutiantian258.github.io`

GitHub 用户主页仓库必须叫 `xutiantian258.github.io`，并且站点文件要放在仓库根目录。

1. 在 GitHub 新建公开仓库 `xutiantian258.github.io`。
2. 把 **`site/` 目录里面的内容**（不是 `site` 文件夹本身）复制到仓库根目录。
3. 在仓库根目录执行：

```bat
git init
git add .
git commit -m "Add PDF++ landing page"
git branch -M main
git remote add origin https://github.com/xutiantian258/xutiantian258.github.io.git
git push -u origin main
```

4. 打开仓库 **Settings → Pages**，Source 选择 **Deploy from a branch**，Branch 选择 **main**，目录选择 **/(root)**，保存。
5. 等待一两分钟，访问 `https://xutiantian258.github.io/`。

> 本目录 `site/` 已初始化为 Git 仓库（`main`），remote 指向
> `https://github.com/xutiantian258/xutiantian258.github.io.git`，代码已推送。
> Pages 已启用并构建成功，线上地址：`https://xutiantian258.github.io/`。

### 可选：用 GitHub Actions 部署

仓库根目录已包含 `.github/workflows/deploy-site.yml`。如果使用本项目的完整仓库（而不是只复制 `site/`），可以：

1. 推送仓库到 `main`。
2. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 在 Actions 页面等待 `Deploy site` 完成。

仓库名必须是 `xutiantian258.github.io`，否则站点会部署到 `https://xutiantian258.github.io/<repo>/`。

## 发布清单

- [x] 创建 `xutiantian258.github.io` 仓库
- [x] 上传 `dist/PDFPlusWatermark-v1.3.0-win64.zip` 到 Releases
- [x] 推送 `site/` 内容到仓库根目录
- [x] Pages 选择 `main` / `/(root)`
- [x] 打开站点检查下载按钮、购买邮件、移动端布局

## 文件结构

```text
site/
├─ index.html          # 页面结构与全部文案
├─ assets/
│  ├─ styles.css       # 设计系统、响应式与动效
│  ├─ app.js           # 配置、预览开关、FAQ、购买链接
│  └─ favicon.svg      # 站点图标
├─ .nojekyll           # 跳过 Jekyll 处理
└─ README.md
```

## 设计说明

- 视觉：暖纸色底、墨黑文字、单一信号红（取自桌面端主题 `#D93A35`），不用大面积渐变和发光。
- 字体：只使用系统中文字体，不请求外部字体或 CDN，国内访问与离线预览都不依赖第三方。
- 动效：自定义 `ease-out` 曲线；UI 动效 160–220ms，仅首屏入场使用较长时长；按钮按下有 `scale(0.97)` 反馈；所有 hover 仅对精确指针设备生效；完整支持 `prefers-reduced-motion`。
- 交互：首屏预览里的「显示水印」开关可直接切换；FAQ 手风琴；购买按钮自动生成带版本名称的邮件。
- 响应式：在 320 / 390 / 768 / 1024 / 1440 / 1920 宽度下检查过布局，无横向滚动。

## 改价格 / 改文案

价格和卖点都直接写在 `index.html` 中，搜索「定价」「个人版」「工作室版」即可定位。修改价格时同步检查：

- 四张套餐卡的数字与权益；
- `faq` 里关于试用、发票的说明；
- `assets/app.js` 里购买邮件不需要改价格，只带版本名称。

## 许可

页面代码属于本项目；截图中的示例客户名称（张三、李四等）仅为演示数据。