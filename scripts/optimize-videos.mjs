import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';

const root=path.resolve(import.meta.dirname,'..');
const temp=path.join(root,'tmp/performance');
const originals=path.join(temp,'originals');
fs.mkdirSync(originals,{recursive:true});
const groups=JSON.parse(fs.readFileSync(path.join(root,'src/works.json'),'utf8'));
const videos=groups.filter(g=>g.kind==='video').flatMap(g=>g.items);
const reportFile=path.join(temp,'video-report.json');
let report=fs.existsSync(reportFile)?JSON.parse(fs.readFileSync(reportFile,'utf8')):[];
const selected=process.argv.slice(2);
const run=args=>new Promise((resolve,reject)=>{
 const proc=spawn(ffmpeg.path,args,{windowsHide:true});let stderr='';
 proc.stderr.on('data',chunk=>{stderr+=chunk;});
 proc.on('error',reject);proc.on('close',code=>code===0?resolve(stderr):reject(new Error(stderr.slice(-3000))));
});
for(const item of videos){
 if(selected.length&&!selected.includes(item.id))continue;
 const target=path.join(root,'public',item.src);
 const backup=path.join(originals,path.basename(target));
 if(!fs.existsSync(backup))fs.copyFileSync(target,backup);
 const output=path.join(temp,path.basename(target));
 const log=await run(['-y','-i',backup,'-map','0:v:0','-map','0:a?',
  '-vf',"scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
  '-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p',
  '-c:a','aac','-b:a','128k','-movflags','+faststart','-threads','4',output]);
 fs.writeFileSync(path.join(temp,`${item.id}-encode.log`),log);
 const before=fs.statSync(backup).size,encoded=fs.statSync(output).size;
 if(encoded>=before)await run(['-y','-i',backup,'-map','0','-c','copy','-movflags','+faststart',output]);
 fs.copyFileSync(output,target);
 report=report.filter(entry=>entry.id!==item.id);
 report.push({id:item.id,url:item.src,before,after:fs.statSync(target).size});
 fs.writeFileSync(reportFile,JSON.stringify(report,null,2));
 console.log(item.id,`${(before/1e6).toFixed(2)} MB -> ${(fs.statSync(target).size/1e6).toFixed(2)} MB`);
}
await run(['-y','-ss','0.5','-i',path.join(root,'public/media/product-film.mp4'),'-frames:v','1','-vf','scale=1600:-2','-quality','82',path.join(root,'public/media/hero-poster.webp')]);
console.log('Hero poster generated; source copies retained under tmp/performance/originals.');
