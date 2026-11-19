import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
const root=path.resolve(import.meta.dirname,'..');
const groups=JSON.parse(fs.readFileSync(path.join(root,'src/works.json'),'utf8'));
const ids=new Set(),videos=new Set();
let images=0;
for(const group of groups)for(const item of group.items){
 assert(!ids.has(item.id),'unique item IDs');ids.add(item.id);
 for(const url of [item.src,item.thumb,item.preview].filter(Boolean)){
  const file=path.join(root,'public',url);assert(fs.statSync(file).size>0,`media exists: ${url}`);
  if(file.endsWith('.mp4'))videos.add(file);
 }
 if(group.kind==='image'){assert(item.width>0&&item.height>0);assert(item.preview,'image has a lightweight preview');images++;}
}
for(const file of videos){
 const buffer=fs.readFileSync(file),atoms=[];
 for(let offset=0;offset+8<=buffer.length;){
  const size=buffer.readUInt32BE(offset);atoms.push(buffer.toString('ascii',offset+4,offset+8));
  const length=size===1?Number(buffer.readBigUInt64BE(offset+8)):size;if(length<8)break;offset+=length;
 }
 assert(atoms.includes('moov')&&atoms.indexOf('moov')<atoms.indexOf('mdat'),'MP4 metadata precedes video for progressive playback');
 const result=spawnSync(ffmpeg.path,['-v','error','-xerror','-i',file,'-t','2','-f','null','-'],{encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,`video decoding: ${path.basename(file)} ${result.stderr}`);
}
assert(fs.statSync(path.join(root,'public/media/hero-poster.webp')).size>0);
console.log(`PASS ${images} image previews, unique IDs, asset references, ${videos.size} streaming MP4 headers and decoded video samples`);
