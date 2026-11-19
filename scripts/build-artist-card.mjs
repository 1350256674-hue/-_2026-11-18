import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const media=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public/media');
const avatar=fs.readFileSync(path.join(media,'avatar-3d-cartoon-v2.png')).toString('base64');
const front=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1440" viewBox="0 0 1024 1440">
<defs><clipPath id="portrait"><rect x="54" y="286" width="916" height="916" rx="22"/></clipPath></defs>
<rect width="1024" height="1440" fill="#17181b"/>
<path d="M64 52h126v12H64z" fill="#ff3825"/>
<g fill="#f2f0e9" font-family="Arial, sans-serif">
<text x="64" y="202" font-size="112" font-weight="900" letter-spacing="-7">ZHOUXX</text>
<text x="68" y="246" font-size="20" letter-spacing="5" fill="#9c9fa3">3D ARTIST / VISUAL DESIGNER</text>
</g>
<image href="data:image/png;base64,${avatar}" x="54" y="286" width="916" height="916" clip-path="url(#portrait)"/>
<rect x="54" y="286" width="916" height="916" rx="22" fill="none" stroke="#ffffff18" stroke-width="2"/>
<text x="64" y="1303" fill="#f2f0e9" font-size="64" font-weight="700" font-family="Microsoft YaHei, Noto Sans SC, sans-serif">周兴贤</text>
<text x="66" y="1361" fill="#9c9fa3" font-size="24" letter-spacing="3" font-family="Arial, sans-serif">ZHOU XINGXIAN</text>
<text x="955" y="1300" text-anchor="end" fill="#ff3825" font-size="30" font-family="Arial, sans-serif">ZX — 01</text>
<text x="955" y="1360" text-anchor="end" fill="#9c9fa3" font-size="20" letter-spacing="2" font-family="Arial, sans-serif">FORM / LIGHT / MOTION</text>
<rect y="1428" width="1024" height="12" fill="#ff3825"/>
</svg>`;
const back=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1440" viewBox="0 0 1024 1440">
<rect width="1024" height="1440" fill="#17181b"/>
<g fill="none" stroke="#ffffff10" stroke-width="2"><circle cx="512" cy="560" r="345"/><circle cx="512" cy="560" r="275"/><path d="M64 560h896M512 168v784"/></g>
<g font-family="Arial, sans-serif"><text x="64" y="192" font-size="24" fill="#9c9fa3" letter-spacing="5">THE PERSON BEHIND THE PIXELS</text>
<text x="498" y="718" text-anchor="middle" fill="#ff3825" font-size="440" font-weight="900" letter-spacing="-36">ZX.</text>
<text x="64" y="994" fill="#f2f0e9" font-size="66" font-weight="700" letter-spacing="-2">FORM. LIGHT. MOTION.</text>
<path d="M64 1040h896" stroke="#ffffff22"/>
<text x="64" y="1120" fill="#9c9fa3" font-size="25" letter-spacing="2">CINEMA 4D / OCTANE / REDSHIFT</text>
<text x="64" y="1180" fill="#9c9fa3" font-size="25" letter-spacing="2">SCENE DESIGN / ANIMATION</text>
<text x="64" y="1335" fill="#f2f0e9" font-size="26" letter-spacing="1">ZCOOL.COM.CN/U/25231956</text>
<text x="960" y="1340" text-anchor="end" fill="#ff3825" font-size="54">↗</text></g>
<rect y="1428" width="1024" height="12" fill="#ff3825"/>
</svg>`;
const strap=`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="192" viewBox="0 0 1400 192">
<rect width="1400" height="192" fill="#ff3825"/>
<path d="M0 12h1400M0 180h1400" stroke="#00000038" stroke-width="3" stroke-dasharray="10 8"/>
<text x="64" y="132" fill="#17181b" font-family="Arial,sans-serif" font-weight="800" font-size="96" letter-spacing="5">ZHOUXX / 3D ARTIST /</text>
</svg>`;
for(const [name,svg] of [['artist-card-front-v2.svg',front],['artist-card-back.svg',back],['artist-strap.svg',strap]]){
 fs.writeFileSync(path.join(media,name),svg,'utf8');
 console.log(`Created ${name}`);
}
