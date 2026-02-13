# 🚀 Vercel 部署指南

## 📋 前置要求

- ✅ GitHub 账号
- ✅ Vercel 账号 (用 GitHub 登录即可)
- ✅ Fork 的 hotspot-web 仓库

## 🎯 部署步骤

### 第一步: 推送代码到 GitHub

在服务器上执行:

```bash
cd ~/clawd/hotspot-web

# 添加所有文件
git add .

# 提交
git commit -m "🎨 定制热榜展示页面

- 配置微博/知乎/B站/GitHub/HackerNews
- 简约现代UI风格
- 自动刷新功能
- 搜索过滤功能

Co-Authored-By: Claude <noreply@anthropic.com>"

# 推送到你的 GitHub
git push origin main
```

### 第二步: 连接 Vercel

1. **访问 Vercel**: https://vercel.com/
2. **登录**: 点击"Sign Up" → "Continue with GitHub"
3. **导入项目**:
   - 点击 "Add New..." → "Project"
   - 选择你的 `hotspot-web` 仓库
   - 点击 "Import"

### 第三步: 配置构建设置

Vercel 会自动检测项目类型，你需要确认：

**Framework Preset**: Vite
**Build Command**: `pnpm run build`
**Output Directory**: `dist/output/public`
**Install Command**: `pnpm install`

### 第四步: 部署

点击 "Deploy" 按钮，Vercel 会自动:
1. 安装依赖
2. 构建项目
3. 部署到全球 CDN

⏱️ 预计时间: 2-3 分钟

### 第五步: 获取域名

部署成功后，你会获得:
- **Vercel 域名**: `https://hotspot-web-xxx.vercel.app`
- 可选：绑定自定义域名

## 🎨 定制配置

### 修改页面标题

编辑 `index.html`:

```html
<title>Hotspot Hub - 热点聚合</title>
```

### 配置显示的数据源

编辑 `shared/metadata.ts`:

```typescript
// 在相应分类下添加/删除数据源
```

### 修改主题颜色

编辑 `uno.config.ts` 或组件样式文件

## 🔧 环境变量 (可选)

如果需要配置 API 密钥等，在 Vercel 项目设置中添加:

- Settings → Environment Variables
- 添加变量名和值
- 重新部署生效

## 📱 移动端优化

NewsNow 已经完美支持移动端，无需额外配置。

## 🔄 自动部署

配置完成后，每次推送代码到 GitHub，Vercel 会自动重新部署！

```bash
# 修改代码后
git add .
git commit -m "更新配置"
git push

# Vercel 自动部署 ✅
```

## 💡 常见问题

### Q: 构建失败怎么办?

A: 查看 Vercel 构建日志:
1. 点击失败的部署
2. 查看 "Build Logs"
3. 根据错误信息调整

### Q: 如何绑定自定义域名?

A:
1. Settings → Domains
2. 输入你的域名
3. 按提示配置 DNS

### Q: 部署很慢?

A: 首次部署会慢一些,后续增量部署很快 (30秒内)

### Q: 如何回滚到之前的版本?

A:
1. Deployments 页面
2. 找到之前的部署
3. 点击 "..." → "Promote to Production"

## 🌐 访问你的网站

部署成功后访问:
```
https://你的项目名.vercel.app
```

---

**🎉 完成！你的热榜网站已经上线了！**
