import React,{lazy,Suspense,useEffect,useRef,useState} from 'react';
import './artist-lanyard.css';
import {queueVisualTask} from './visualWarmup';

let modulePromise;
const loadLanyard=()=>modulePromise??=import('./Lanyard');
const Lanyard=lazy(loadLanyard);
const frontImage='/media/artist-card-front-v2.svg';

export default function ArtistLanyard({variant='default'}){
 const root=useRef(null);
 const [near,setNear]=useState(false),[mounted,setMounted]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  const observer=new IntersectionObserver(([entry])=>{
   setNear(entry.isIntersecting&&entry.intersectionRatio>0);
  },{rootMargin:'320px',threshold:.01});
  observer.observe(root.current);
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  if(!near||mounted)return;
  let disposed=false,cancel=()=>{};
  const prepare=()=>{cancel=queueVisualTask(()=>{
   loadLanyard().then(()=>{if(!disposed)cancel=queueVisualTask(()=>{if(!disposed)setMounted(true);},{priority:0});})
    .catch(()=>{if(!disposed)setFailed(true);});
  },{priority:0});};
  const curtain=document.querySelector('.opening-curtain');
  if(curtain?.style.display==='flex')window.addEventListener('portfolio:skip-opening',prepare,{once:true});else prepare();
  return()=>{disposed=true;cancel();window.removeEventListener('portfolio:skip-opening',prepare);};
 },[near,mounted]);
 return <div ref={root} className={`portrait-panel lanyard-portrait${variant==='editorial'?' lanyard-portrait-editorial':''}${ready?' is-ready':''}${failed?' is-static':''}`}>
  <div className="lanyard-annotation" aria-hidden="true"><span>01 / THE ARTIST</span><span>ZHOUXX</span></div>
  <div className="lanyard-static" aria-hidden={ready}>
   <div className="lanyard-static-band"><span>3D ARTIST</span></div>
   <div className="lanyard-static-clamp"/>
   <div className="lanyard-static-ring"/>
   <img src={near?frontImage:undefined} width="1024" height="1440" decoding="async" alt="周兴贤的艺术家卡片，棕色棒球帽、格纹外套、手持咖啡的三维卡通形象"/>
  </div>
  {mounted&&!failed&&<Suspense fallback={null}><Lanyard
   frontImage={frontImage} backImage="/media/artist-card-back.svg" strapImage="/media/artist-strap.svg"
   className="artist-lanyard-scene" cardColor="#17181b" size={variant==='editorial'?.7:.58} strapLength={variant==='editorial'?.28:.36} strapWidth={.63}
   cornerRadius={.34} finish="glossy" metal="silver" gravity={.85} damping={.78} elasticity={.25} breeze={.08}
   onReady={()=>setReady(true)} onError={()=>{setReady(false);setFailed(true);}}/>
  </Suspense>}
  <div className="lanyard-instruction"><span>{failed?'周兴贤 / 三维渲染师':'拖动卡片，让灵感摆动'}<small>{failed?'3D ARTIST / VISUAL DESIGNER':'点击翻面 · 支持键盘 Enter 翻转'}</small></span><span className="lanyard-coordinate" aria-hidden="true">X / Y / Z</span></div>
 </div>;
}
