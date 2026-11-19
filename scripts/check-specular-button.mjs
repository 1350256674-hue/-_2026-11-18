import fs from 'node:fs';
import assert from 'node:assert/strict';
import {transformSync} from 'esbuild';

// Exercise native semantics and component lifecycle; this does not render GPU shaders.
const source=fs.readFileSync(new URL('../src/SpecularButton.jsx',import.meta.url),'utf8');
const compiled=transformSync(source,{loader:'jsx',format:'cjs'}).code;
const events=()=>({handlers:new Map(),addEventListener(k,v){this.handlers.set(k,v);},removeEventListener(k){this.handlers.delete(k);}});
const windowMock={...events(),devicePixelRatio:2};
const media=new Map();
windowMock.matchMedia=q=>{if(!media.has(q))media.set(q,{...events(),matches:!q.endsWith(': reduce)')});return media.get(q);};
const documentMock={...events(),hidden:false,documentElement:events(),createElement:()=>({getContext:()=>({clearRect(){},fillRect(){},getImageData:()=>({data:[255,255,255,255]})})})};
let id=0,draws=0,deleted=0,lostContexts=0;
const frames=new Map(),constants=new Map();
const raf=fn=>{frames.set(++id,fn);return id;};
const cancel=id=>frames.delete(id);
const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:()=>({}),getExtension:()=>({loseContext(){lostContexts++;}}),drawArrays(){draws++;}}, {get(target,key){
 if(key in target)return target[key];
 if(/^[A-Z0-9_]+$/.test(key)){if(!constants.has(key))constants.set(key,constants.size+1);return constants.get(key);}
 if(key.startsWith('create'))return ()=>({});
 if(key.startsWith('delete'))return ()=>{deleted++;};
 return (...args)=>{for(const value of args)if(typeof value==='number')assert(Number.isFinite(value),'finite GPU upload');};
}});
const button={...events(),offsetWidth:240,offsetHeight:48,getBoundingClientRect:()=>({left:0,top:0,width:240,height:48})};
const canvas={isConnected:true,getContext:()=>gl};
const refs=[],effects=[];let refIndex=0,enabled=false;
const react={createElement:(tag,props,...children)=>({tag,props,children}),useRef(initial){return refs[refIndex++]??(refs[refIndex-1]={current:initial});},useEffect(fn){effects.push(fn);},useState:()=>[enabled,value=>{enabled=value;}]};
class ResizeMock{observe(){}disconnect(){}}
class IntersectionMock{constructor(fn){this.fn=fn;}observe(){this.fn([{isIntersecting:true}]);}disconnect(){}}
const module={exports:{}};
new Function('require','module','exports','window','document','requestAnimationFrame','cancelAnimationFrame','ResizeObserver','IntersectionObserver',compiled)(name=>name==='react'?react:name.includes('visualWarmup')?{queueVisualTask:task=>{task();return ()=>{};}}:{},module,module.exports,windowMock,documentMock,raf,cancel,ResizeMock,IntersectionMock);
const render=props=>{refIndex=0;effects.length=0;return module.exports.default({autoAnimate:false,...props});};
const anchor=render({href:'#work',target:'_blank',rel:'noreferrer','data-cursor-label':'作品'});
assert.equal(anchor.tag,'a');assert.equal(anchor.props.href,'#work');assert.equal(anchor.props.target,'_blank');assert.equal(anchor.props.rel,'noreferrer');assert.equal(anchor.props['data-cursor-label'],'作品');
let clicks=0;const native=render({onClick:()=>clicks++});assert.equal(native.tag,'button');assert.equal(native.props.type,'button');native.props.onClick();assert.equal(clicks,1);
const disabled=render({href:'#work',disabled:true});assert.equal(disabled.props.href,undefined);assert.equal(disabled.props['aria-disabled'],true);
const article=render({as:'article',role:'group',inert:true});assert.equal(article.tag,'article');assert.equal(article.props.type,undefined);assert.equal(article.props.disabled,undefined);assert.equal(article.props.role,'group');assert.equal(article.props.inert,true);assert.equal(article.children[1].tag,'div','card content accepts headings and paragraphs');
render({});refs[0].current=button;refs[1].current=canvas;
const stopPreference=effects[0]();assert(enabled,'visible desktop enables rim effect');
render({});const stopGL=effects[1]();effects[2]();
assert.equal(canvas.width,432);assert.equal(canvas.height,144);
const advance=time=>{const queue=[...frames.values()];frames.clear();for(const fn of queue)fn(time);};
for(let i=1;i<=180;i++)advance(i*16.67);
assert(draws>0);assert.equal(frames.size,0,'idle stops scheduling');
windowMock.handlers.get('pointermove')({clientX:180,clientY:24,pointerType:'mouse'});
assert(frames.size>0,'pointer wakes effect');
for(let i=181;i<=500;i++)advance(i*16.67);
assert.equal(frames.size,0,'pointer settles');
windowMock.handlers.get('pointermove')({clientX:20,clientY:5,pointerType:'mouse'});
documentMock.hidden=true;documentMock.handlers.get('visibilitychange')();assert.equal(frames.size,0,'hidden tab cancels animation');
documentMock.hidden=false;documentMock.handlers.get('visibilitychange')();assert(frames.size>0,'visible tab resumes');
stopGL();assert.equal(frames.size,0);assert(deleted>=3);assert.equal(lostContexts,1,'cleanup explicitly releases the GPU context');assert.equal(windowMock.handlers.size,0);assert.equal(documentMock.handlers.size,0);assert.equal(button.handlers.size,0);
media.get('(prefers-reduced-motion: no-preference)').matches=false;media.get('(prefers-reduced-motion: no-preference)').handlers.get('change')();assert.equal(enabled,false);
stopPreference();for(const preference of media.values())assert.equal(preference.handlers.size,0);
console.log('PASS native links, click callbacks, disabled semantics, DPR cap, finite uploads, pointer settling, idle pause, tab visibility, reduced motion and cleanup');
