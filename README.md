# PDF++ 水印工坊 · 官网

零依赖静态落地页，用于展示 PDF++ 水印工坊的卖点与价格。

- 站点地址：`https://xutiantian258.github.io/`
- 仓库地址：`https://github.com/xutiantian258/xutiantian258.github.io`
- 购买咨询：`ykxu_1@163.com`

## 本地预览

在项目根目录运行：

```bat
python -m http.server 4173 --directory site
```

然后打开 `http://127.0.0.1:4173/`。

## 下载线路（Gitee 直链）

安装包放在 Gitee 发行版，站点上的下载按钮直接指向附件直链，点击就开始下载，不经过发行版页面：

```text
https://gitee.com/xutiantian_1/pdfplus-watermark/releases/download/v1.6.0/WatermarkTrace-v1.6.0-win64.zip
```

仓库：`https://gitee.com/xutiantian_1/pdfplus-watermark`

下载相关配置集中在 `assets/app.js` 顶部的 `DOWNLOAD` 对象：

```js
const DOWNLOAD = {
  giteeRepo: "xutiantian_1/pdfplus-watermark",
  tag: "v1.6.0",
  asset: "WatermarkTrace-v1.6.0-win64.zip",
  size: "71 MB",
  sha256: "a87b6c09…",
  fallbackUrl: "https://github.com/xutiantian258/xutiantian258.github.io/releases/latest"
};
```

- `giteeRepo` / `tag` / `asset`：三段拼出直链，换版本只改这三个。
- `size`：页面上的「约 xx MB」。
- `sha256`：安装包校验值，用户反馈下载损坏时可以对照。
- `fallbackUrl`：GitHub 备用线路，只出现在首屏「下载不了？用 GitHub 备用」。

其余站点配置仍在 `SITE` 对象里（`downloadUrl` 由上面三项自动拼出来）：

```js
const SITE = {
  downloadUrl: giteeDirectUrl(),
  downloadFallbackUrl: DOWNLOAD.fallbackUrl,
  contactEmail: "ykxu_1@163.com",
  githubUrl: "https://github.com/xutiantian258/xutiantian258.github.io",
  siteUrl: "https://xutiantian258.github.io"
};
```

- `contactEmail`：个人版 / 工作室版 / 机构版的购买咨询邮箱。点击购买按钮会打开站内联系弹窗，邮箱可一键复制。
- `assets/wechat-qr.jpg`：联系弹窗中的微信二维码，替换时建议使用正方形图片。
- `githubUrl`：页脚 GitHub 链接。
- `siteUrl`：页脚显示的站点地址，同时会更新链接。

### 发新版本

```powershell
# 1. 打包（生成 dist\WatermarkTrace-vX.Y.Z-win64.zip）
.\build_exe.ps1 -Zip

# 2. 把 zip 传到 Gitee 发行版，并把直链写回站点配置
#    先在 Gitee 网页建发行版、拖入 zip；也可以加 -Upload 由脚本自动创建发行版并上传
$env:GITEE_TOKEN = "你的 Gitee 私人令牌"
.\tools\publish_gitee.ps1 -Tag v1.6.0
```

脚本会算好大小和 SHA-256，并把 `giteeRepo / tag / asset / size / sha256` 写回 `assets/app.js`。

Gitee 单个附件上限 100 MB，当前包约 71 MB；超过时改用对象存储或分包。

### 说明

- 站点页面本身仍部署在 GitHub Pages（`xutiantian258.github.io`），只有安装包下载走 Gitee。
- 仓库里如果还没有对应 tag 的发行版，直链会返回 404，所以顺序是：**先传 Gitee，再推站点**。

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
- [x] Gitee 发行版 `v1.6.0` 上传 `WatermarkTrace-v1.6.0-win64.zip`（直链已写回 `assets/app.js`）
- [x] GitHub 发行版 `v1.6.0` 同步上传同一安装包（首屏「GitHub 备用」线路）
- [x] 推送 `site/` 内容到 GitHub 仓库根目录
- [x] Pages 选择 `main` / `/(root)`
- [x] 打开站点检查下载按钮、购买邮件、移动端布局
- [ ] 点一次下载按钮，确认浏览器直接开始下载 zip（不是跳到发行版页面）

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
