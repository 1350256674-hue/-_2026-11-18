import fs from 'node:fs';
import assert from 'node:assert/strict';
import {transformSync} from 'esbuild';

// Exercise the actual component lifecycle and uploads without claiming to render GPU shaders.
const source=fs.readFileSync(new URL('../src/Lightfall.jsx',import.meta.url),'utf8');
const compiled=transformSync(source,{loader:'jsx',format:'cjs'}).code;
const events=()=>({handlers:new Map(),addEventListener(name,fn){this.handlers.set(name,fn);},removeEventListener(name){this.handlers.delete(name);}});
const windowMock={...events(),devicePixelRatio:2};
const preference={...events(),matches:false};
windowMock.matchMedia=()=>preference;
const documentMock={...events(),hidden:false,documentElement:events(),createElement:()=>({getContext:()=>({clearRect(){},fillRect(){},getImageData:()=>({data:[232,231,225,255]})})})};
let nextFrame=0,draws=0,deleted=0,boundFramebuffer=null;
const frames=new Map();
const raf=fn=>{frames.set(++nextFrame,fn);return nextFrame;};
const cancel=id=>frames.delete(id);
const numeric=values=>{for(const v of values){if(typeof v==='number')assert(Number.isFinite(v),'finite GPU upload');if(ArrayBuffer.isView(v))assert([...v].every(Number.isFinite),'finite vertex data');}};
const constants=new Map();
const gl=new Proxy({
 getShaderParameter:()=>true,
 getProgramParameter:(_program,parameter)=>parameter===gl.ACTIVE_UNIFORMS?0:true,
 bindFramebuffer(_target,value){boundFramebuffer=value;},
 drawArrays(...args){numeric(args);if(boundFramebuffer===null)draws++;},
 getExtension:()=>({loseContext(){}})
},{get(target,key){
 if(key in target)return target[key];
 if(/^[A-Z0-9_]+$/.test(key)){if(!constants.has(key))constants.set(key,constants.size+1);return constants.get(key);}
 if(key.startsWith('create'))return ()=>({});
 if(key.startsWith('delete'))return ()=>{deleted++;};
 return (...args)=>numeric(args);
}});
const canvas={...events(),isConnected:true,getContext:()=>gl};
const container={clientWidth:1600,clientHeight:900,getBoundingClientRect:()=>({left:0,top:0,width:1600,height:900})};
const refs=[],effects=[];let refIndex=0;
const react={createElement:(_tag,props,...children)=>({props,children}),useRef(initial){return refs[refIndex++]??(refs[refIndex-1]={current:initial});},useEffect(fn){effects.push(fn);},useState(initial){return [initial,()=>{}];}};
class ResizeMock{observe(){}disconnect(){}}
class IntersectionMock{constructor(callback){this.callback=callback;}observe(){this.callback([{isIntersecting:true}]);}disconnect(){}}
const module={exports:{}};
new Function('require','module','exports','window','document','requestAnimationFrame','cancelAnimationFrame','ResizeObserver','IntersectionObserver',compiled)(
 name=>name==='react'?react:{},module,module.exports,windowMock,documentMock,raf,cancel,ResizeMock,IntersectionMock
);
const props={colors:["#ede5d9","#ff3825"],dpr:1,maxFps:45,intro:false,bloom:.22,holdToWarp:false};
const rerender=extra=>{refIndex=0;effects.length=0;module.exports.default({...props,...extra});};
rerender();refs[0].current=container;refs[1].current=canvas;
const cleanup=effects[0]();effects[1]();
assert.equal(canvas.width,1600);assert.equal(canvas.height,900);
assert(draws>0,'initial render uploads and draws Lightfall');
const advance=time=>{const queued=[...frames.values()];frames.clear();for(const fn of queued)fn(time);};
const initial=draws;
for(let i=1;i<=144;i++)advance(i*1000/144);
console.log('Composited Lightfall frames in one second:',draws-initial);
assert(draws>initial&&draws-initial<=47,'frame cap limits GPU draws on a 144Hz display');
console.log('PASS initialization, finite GPU uploads, viewport size and frame cap');
rerender({paused:true});effects[1]();advance(1100);advance(1200);
assert.equal(frames.size,0,'paused effect stops scheduling frames');
rerender({paused:false});effects[1]();advance(1300);
documentMock.hidden=true;documentMock.handlers.get('visibilitychange')();
assert.equal(frames.size,0,'hidden tab cancels scheduled frames');
documentMock.hidden=false;documentMock.handlers.get('visibilitychange')();advance(1400);
assert(frames.size>0,'visible tab resumes');
preference.matches=true;preference.handlers.get('change')();advance(1500);advance(1600);
assert.equal(frames.size,0,'reduced motion uses a still frame');
console.log('PASS pause, tab visibility and reduced motion');
cleanup();assert.equal(frames.size,0);assert(deleted>=24,'GPU programs, textures, framebuffers, buffer and VAO disposed');
assert.equal(windowMock.handlers.size,0);assert.equal(documentMock.handlers.size,0);assert.equal(preference.handlers.size,0);assert.equal(canvas.handlers.size,0);
console.log('PASS event and GPU resource cleanup (mock WebGL; not a visual browser test)');
