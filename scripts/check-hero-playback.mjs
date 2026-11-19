import fs from 'node:fs';
import assert from 'node:assert/strict';
import {transformSync} from 'esbuild';

const source=fs.readFileSync(new URL('../src/useHeroPlayback.js',import.meta.url),'utf8');
const code=transformSync(source,{format:'cjs'}).code;
const events=()=>({handlers:new Map(),addEventListener(k,f){this.handlers.set(k,f);},removeEventListener(k){this.handlers.delete(k);}});
const preference={...events(),matches:false};
const documentMock={...events(),hidden:false,getElementById:()=>({}),querySelector:()=>null};
let intersection,disconnected=false,effect;
class Observer{constructor(fn){intersection=fn;}observe(){}disconnect(){disconnected=true;}}
const video={paused:true,plays:0,play(){this.paused=false;this.plays++;return Promise.resolve();},pause(){this.paused=true;}};
const react={useRef:value=>({current:value}),useEffect:fn=>{effect=fn;}};
const module={exports:{}};
new Function('require','module','exports','window','document','navigator','IntersectionObserver',code)(()=>react,module,module.exports,{matchMedia:()=>preference},documentMock,{connection:{saveData:false}},Observer);
const toggle=module.exports.default({current:video});
const cleanup=effect();
assert(video.paused,'no playback before viewport observation');
intersection([{isIntersecting:true,intersectionRatio:1}]);await Promise.resolve();assert(!video.paused,'visible hero plays');
intersection([{isIntersecting:false,intersectionRatio:0}]);assert(video.paused,'offscreen pauses');
intersection([{isIntersecting:true,intersectionRatio:1}]);await Promise.resolve();toggle();assert(video.paused,'manual pause');
intersection([{isIntersecting:false,intersectionRatio:0}]);intersection([{isIntersecting:true,intersectionRatio:1}]);assert(video.paused,'manual pause persists after revisiting');
toggle();await Promise.resolve();assert(!video.paused,'manual resume');
documentMock.hidden=true;documentMock.handlers.get('visibilitychange')();assert(video.paused,'hidden tab pauses');
documentMock.hidden=false;documentMock.handlers.get('visibilitychange')();await Promise.resolve();assert(!video.paused);
cleanup();assert(video.paused);assert(disconnected);assert.equal(documentMock.handlers.size,0);assert.equal(preference.handlers.size,0);
console.log('PASS visible playback, offscreen pause, manual choice, tab visibility and cleanup');
