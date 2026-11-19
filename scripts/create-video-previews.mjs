import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const root=path.resolve(import.meta.dirname,'..');
const manifest=path.join(root,'src/works.json');
const groups=JSON.parse(fs.readFileSync(manifest,'utf8'));
for(const group of groups.filter(g=>g.kind==='video'))for(const item of group.items){
 const source=path.join(root,'public',item.src);
 if(fs.statSync(source).size<=10_000_000)continue;
 const output=path.join(root,`public/media/works/${item.id}-preview.mp4`);
 await new Promise((resolve,reject)=>{
  const proc=spawn(ffmpeg.path,['-v','error','-y','-i',source,'-map','0:v:0','-an',
   '-vf',"scale='min(1280,iw)':'min(1280,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
   '-c:v','libx264','-preset','medium','-crf','24','-maxrate','2500k','-bufsize','5000k',
   '-pix_fmt','yuv420p','-movflags','+faststart','-threads','4',output],{windowsHide:true});
  let error='';proc.stderr.on('data',data=>{error+=data;});proc.on('error',reject);
  proc.on('close',code=>code===0?resolve():reject(new Error(error)));
 });
 item.preview=`/media/works/${item.id}-preview.mp4`;
 console.log(item.id,'inline preview MB',+(fs.statSync(output).size/1e6).toFixed(2));
}
fs.writeFileSync(manifest,JSON.stringify(groups,null,2)+'\n');
