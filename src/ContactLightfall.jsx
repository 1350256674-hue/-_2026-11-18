import React,{lazy,Suspense,useEffect,useRef,useState} from 'react';
import './contact-lightfall.css';

const Lightfall=lazy(()=>import('./Lightfall'));
const colors=['#e6e2dc','#d0d1d0','#e0ddd7','#d3d4d2','#e6e2dc','#bfc3c4','#d0d1d0','#b7867d'];

export default function ContactLightfall(){
 const root=useRef(null);
 const [near,setNear]=useState(false),[hidden,setHidden]=useState(document.hidden);
 const [mobile,setMobile]=useState(()=>window.matchMedia('(max-width:760px)').matches);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches);
 useEffect(()=>{
  const observer=new IntersectionObserver(([entry])=>{
   if(entry.isIntersecting){setNear(true);observer.disconnect();}
  },{rootMargin:'160px'});
  observer.observe(root.current);
  const visibility=()=>setHidden(document.hidden);
  const phone=window.matchMedia('(max-width:760px)'),reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
  const onPhone=()=>setMobile(phone.matches),onReduce=()=>setReduced(reduce.matches);
  document.addEventListener('visibilitychange',visibility);
  phone.addEventListener('change',onPhone);reduce.addEventListener('change',onReduce);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);phone.removeEventListener('change',onPhone);reduce.removeEventListener('change',onReduce);};
 },[]);
 return <div ref={root} className="contact-lightfall-background" aria-hidden="true">
  {near&&<Suspense fallback={null}><Lightfall colors={colors} backgroundColor="#a69a92"
   className="contact-lightfall-field" speed={.18} streakCount={2} streakWidth={.65} streakLength={.85} density={.45}
   twinkle={.08} glow={.56} backgroundGlow={.055} headGlow={.32} depth={.7} bloom={mobile?0:.14} zoom={3.1}
   opacity={.52} fade={.2} mouseInteraction={!mobile&&!reduced} mouseStrength={.15} mouseRadius={.42}
   mouseDampening={.3} lens={.18} holdToWarp={false} intro={!mobile&&!reduced}
   paused={hidden||reduced} dpr={mobile?.75:1} maxFps={mobile?30:45}/></Suspense>}
 </div>;
}
