import React,{lazy,Suspense,useEffect,useState} from 'react';
import './page-particles.css';
import {queueVisualTask} from './visualWarmup';

const Particles=lazy(()=>import('./Particles'));
const colors=['#e8e7e1','#e8e7e1','#bec3c7','#cdbfb0','#ff3825'];

export default function PageParticles(){
 const [mounted,setMounted]=useState(false),[active,setActive]=useState(false);
 const [hidden,setHidden]=useState(document.hidden);
 const [mobile,setMobile]=useState(()=>window.matchMedia('(max-width:760px)').matches);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches);
 useEffect(()=>{
  const hero=document.getElementById('home');
  if(!hero)return;
  const visibleSections=new Set();
  let wasActive=false,hasMounted=false,contactDominant=false,cancelWarmup=()=>{};
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.target.id==='contact'){contactDominant=entry.isIntersecting&&entry.intersectionRatio>=.7;continue;}
    if(entry.isIntersecting&&entry.intersectionRatio>0)visibleSections.add(entry.target);else visibleSections.delete(entry.target);
   }
   const next=visibleSections.size>0&&!contactDominant;
   if(next!==wasActive){wasActive=next;setActive(next);}
   if(next&&!hasMounted){hasMounted=true;cancelWarmup=queueVisualTask(()=>setMounted(true),{priority:10});}
  },{threshold:[0,.7]});
  document.querySelectorAll('#about,#work,#expertise,#contact').forEach(section=>observer.observe(section));
  const visibility=()=>setHidden(document.hidden);
  const phone=window.matchMedia('(max-width:760px)');
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)');
  const onPhone=()=>setMobile(phone.matches),onReduce=()=>setReduced(reduce.matches);
  document.addEventListener('visibilitychange',visibility);
  phone.addEventListener('change',onPhone);reduce.addEventListener('change',onReduce);
  return()=>{
   observer.disconnect();
   cancelWarmup();
   document.removeEventListener('visibilitychange',visibility);
   phone.removeEventListener('change',onPhone);reduce.removeEventListener('change',onReduce);
  };
 },[]);
 return <div className={`page-particles${active?' is-active':''}`} aria-hidden="true">
  {mounted&&<Suspense fallback={null}><Particles className="page-particles-field"
   particleColors={colors} particleCount={mobile?100:210} particleSpread={11} speed={.055}
   particleBaseSize={72} sizeRandomness={1.1} glow={.28} twinkle={.16} depthOfField={.12}
   alphaParticles opacity={.58} connections={!mobile} connectionDistance={90}
   moveParticlesOnHover={!mobile&&!reduced} hoverEffect="repel" particleHoverFactor={.35} hoverRadius={130}
   clickBurst={false} cameraDistance={20} variation={8} intro={!reduced}
   pixelRatio={mobile?1:1.25} maxFps={mobile?30:45} paused={!active||hidden||reduced}/></Suspense>}
 </div>;
}
