import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
export default defineConfig({resolve:{alias:{'@':path.resolve('src')}},plugins:[tailwindcss(),{name:'local-asset-studio',configureServer(server){
server.middlewares.use('/__workposter',(req,res,next)=>{if(req.method!=='POST')return next();const name=new URL(req.url,'http://localhost').searchParams.get('name');if(!/^g[12]-0[1-4]-poster\.jpg$/.test(name||'')){res.statusCode=400;return res.end();}const chunks=[];req.on('data',x=>chunks.push(x));req.on('end',()=>{fs.writeFileSync(path.resolve('public/media/works',name),Buffer.concat(chunks));res.end('saved');});});
server.middlewares.use('/__asset', (req,res,next)=>{if(req.method!=='POST') return next();const name=new URL(req.url,'http://localhost').searchParams.get('name');if(!/^(hero\.webm|hero\.png|project-[1-3]\.png)$/.test(name||'')){res.statusCode=400;return res.end();}const chunks=[];req.on('data',x=>chunks.push(x));req.on('end',()=>{fs.writeFileSync(path.resolve('public/media',name),Buffer.concat(chunks));res.end('saved');});});}}],server:{port:5173,strictPort:true}});
