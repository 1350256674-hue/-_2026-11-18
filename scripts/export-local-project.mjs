import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root=path.resolve(import.meta.dirname,'..');
const label=process.argv[2];
if(!/^\d{4}-\d{2}-\d{2}$/.test(label||''))throw new Error('Pass a snapshot date: YYYY-MM-DD');
const prefix=path.join(root,'tmp/releases',`portfolio-${label}`);
let destination=prefix,number=2;
while(fs.existsSync(destination))destination=`${prefix}-${number++}`;
fs.mkdirSync(destination,{recursive:true});
const directories=['src','public','scripts','dist'];
const files=['package.json','pnpm-lock.yaml','pnpm-workspace.yaml','.npmrc','.gitignore',
 'index.html','vite.config.js','jsconfig.json','poster-studio.html','README.md','PERFORMANCE.md'];
for(const entry of [...directories,...files]){
 const source=path.join(root,entry);
 if(!fs.existsSync(source))throw new Error(`Missing project file: ${entry}`);
 fs.cpSync(source,path.join(destination,entry),{recursive:true,dereference:true});
}
const components=JSON.parse(fs.readFileSync(path.join(root,'components.json'),'utf8'));
for(const registry of Object.values(components.registries||{})){
 if(typeof registry==='object'&&registry.headers)for(const name of Object.keys(registry.headers)){
  if(name.toLowerCase()==='authorization')registry.headers[name]='Bearer ${REACTBITS_LICENSE_KEY}';
 }
}
fs.writeFileSync(path.join(destination,'components.json'),JSON.stringify(components,null,2)+'\n');
fs.writeFileSync(path.join(destination,'.env.example'),'# Optional: only for installing licensed React Bits Pro components.\nREACTBITS_LICENSE_KEY=\n');
fs.writeFileSync(path.join(destination,'使用与部署说明.md'),`# 周兴贤个人作品集网站

保存日期：${label}。这是当前网站的完整 React + Vite 项目快照，包含源码和已经构建好的网站。

## 直接部署

1. 打开本项目的 dist 文件夹。
2. 将 dist 内部的全部文件和文件夹上传到静态网站托管平台或服务器的网站根目录。
3. 入口文件为 index.html；assets 与 media 文件夹必须一起上传。
4. 使用网站的 HTTP/HTTPS 地址访问。直接双击 index.html 无法完整运行 ES 模块与 WebGL 页面。

当前资源使用 /media/ 等根路径，适合部署在域名根目录。若要部署到 /portfolio/ 这样的子目录，需要统一修改资源前缀与 Vite base，再重新构建；只修改 base 不会自动更改代码中的所有 /media/ 路径。

部署成品无需在服务器上安装 Node.js。该站是静态个人作品集，不依赖独立后端服务。电话号码、站酷链接、原有作品分组和三维卡片均已包含。

## 本地运行与继续修改

准备 Node.js 22.12 或更新的兼容版本，以及 pnpm。在本项目根目录打开终端，运行：

\`\`\`sh
pnpm install --frozen-lockfile
pnpm dev
\`\`\`

开发地址为 http://127.0.0.1:5186/。如果该端口已由原项目占用，请先关闭原项目的预览进程，或使用 pnpm dev --port 5188，并访问终端显示的新地址。

修改完成后重新生成部署文件：

\`\`\`sh
pnpm build
pnpm preview
\`\`\`

build 会重新生成 dist；preview 会在终端显示静态构建的预览地址。运行预览时需要保持对应终端或后台服务运行。已部署的网站由托管服务器持续提供访问。

## 文件位置

- src：React 组件、页面样式、作品目录 works.json。
- public：完整图片、视频和人物卡片等静态资源，运行网站无需原电脑的桌面素材文件夹。
- dist：最新生产构建，可直接部署。
- scripts：素材导入、压缩与验证工具。导入工具的默认源目录是原电脑的桌面作品集；换电脑后可通过 --source 指定新的素材目录。
- package.json 与 pnpm-lock.yaml：依赖与锁定版本。依赖安装后生成 node_modules。
- PERFORMANCE.md：性能优化与验证记录。
- 文件清单.json：随项目保存的文件大小和 SHA-256 校验值，不包含清单自身。

当前网站的运行和构建不要求填写 React Bits 授权密钥。.env.example 仅提供未来安装付费组件时使用的变量模板。
`);

const groups=JSON.parse(fs.readFileSync(path.join(destination,'src/works.json'),'utf8'));
let mediaReferences=0;
for(const group of groups)for(const item of group.items){
 for(const url of [item.src,item.thumb,item.preview].filter(Boolean))for(const folder of ['public','dist']){
  const asset=path.join(destination,folder,url.replace(/^\//,''));
  if(!fs.existsSync(asset)||!fs.statSync(asset).size)throw new Error(`Missing ${folder} media: ${url}`);
  mediaReferences++;
 }
}
const index=fs.readFileSync(path.join(destination,'dist/index.html'),'utf8');
for(const match of index.matchAll(/(?:src|href)="(\/(?:assets\/[^"?]+|media\/[^"?]+|favicon\.svg))"/g)){
 if(!fs.existsSync(path.join(destination,'dist',match[1].slice(1))))throw new Error(`Missing entry asset: ${match[1]}`);
}
for(const omitted of ['node_modules','.pnpm-store','.env.local','.git','tmp']){
 if(fs.existsSync(path.join(destination,omitted)))throw new Error(`Unexpected export entry: ${omitted}`);
}
const records=[];
function inventory(directory){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())inventory(file);
  else records.push({path:path.relative(destination,file).split(path.sep).join('/'),bytes:fs.statSync(file).size,
   sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')});
 }
}
inventory(destination);
fs.writeFileSync(path.join(destination,'文件清单.json'),JSON.stringify({snapshot:label,files:records},null,2)+'\n');
console.log(JSON.stringify({destination,files:records.length+1,bytes:records.reduce((total,file)=>total+file.bytes,0),mediaReferences,groups:groups.map(group=>({title:group.title,count:group.items.length}))},null,2));
