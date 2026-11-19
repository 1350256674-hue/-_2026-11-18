import {useLayoutEffect} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './motion.css';

gsap.registerPlugin(ScrollTrigger);

const mediaConditions={
 all:'(min-width: 0px)',
 desktop:'(min-width: 900px) and (hover: hover) and (pointer: fine)',
 reduce:'(prefers-reduced-motion: reduce)'
};
const fullMask='inset(0% 0% 0% 0%)';
let refreshFrame,refreshTimer;
export function refreshMotion(){
 clearTimeout(refreshTimer);
 cancelAnimationFrame(refreshFrame);
 const refreshWhenIdle=()=>{
  if(ScrollTrigger.isScrolling()){refreshTimer=setTimeout(refreshWhenIdle,120);return;}
  refreshFrame=requestAnimationFrame(()=>ScrollTrigger.refresh());
 };
 refreshTimer=setTimeout(refreshWhenIdle,80);
}

// Every scene owns its context. Filtering or unmounting also restores inline styles.
function sectionScene(section,selectors){
 const items=section.querySelectorAll(selectors);
 const timeline=gsap.timeline({
  defaults:{ease:'power4.out'},
  scrollTrigger:{trigger:section,start:'top 86%',once:true}
 });
 timeline.fromTo(items,{y:72,clipPath:'inset(0% 0% 100% 0%)'},{
  y:0,clipPath:fullMask,duration:1.35,stagger:.14,clearProps:'transform,clipPath'
 },.48);
 const finish=()=>timeline.progress(1);
 section.addEventListener('focusin',finish);
 return ()=>section.removeEventListener('focusin',finish);
}

export function usePortfolioMotion(pageRef){
 useLayoutEffect(()=>{
  const page=pageRef.current;
  if(!page)return;
  const media=gsap.matchMedia();
  let disposed=false;
  media.add(mediaConditions,({conditions})=>{
   if(conditions.reduce)return;
   const cleanups=[];
   const hero=page.querySelector('.hero');
   const curtain=hero.querySelector('.opening-curtain');
   // A restored scroll position or a section deep link should open directly there.
   const shouldOpen=window.scrollY<80&&(!location.hash||location.hash==='#home');
   if(shouldOpen){
    gsap.set(curtain,{display:'flex'});
    const opening=gsap.timeline({defaults:{ease:'power4.out'},onComplete:()=>{
     curtain.style.display='none';
     hero.dataset.opening='complete';
     window.dispatchEvent(new Event('portfolio:skip-opening'));
    }});
    opening.fromTo('.opening-name',{yPercent:110},{yPercent:0,duration:.9,ease:'expo.out'},0)
     .fromTo('.opening-rule span',{scaleX:0},{scaleX:1,duration:1.1,ease:'power3.inOut'},.05)
     .to(curtain,{yPercent:-101,duration:1.5,ease:'expo.inOut'},.6)
     .fromTo(hero.querySelector('.hero-media video'),{scale:1.22},{scale:1,duration:2.5},.7)
     .fromTo(document.querySelectorAll('.header > a, .header nav, .header .menu-button'),{y:-28,autoAlpha:0},{
      y:0,autoAlpha:1,duration:1.1,stagger:.1,clearProps:'transform,opacity,visibility'
     },1.85)
     .fromTo(hero.querySelectorAll('.hero-experience,.hero-project-cta,.hero-film-caption,.hero-player-bar'),{
      y:46,clipPath:'inset(0% 0% 100% 0%)'
     },{y:0,clipPath:fullMask,duration:1.25,stagger:.12,clearProps:'transform,clipPath'},2);
    // Navigation remains usable even during the opening; scrolling skips to its end.
    const skip=()=>{opening.progress(1);window.dispatchEvent(new Event('portfolio:skip-opening'));};
    const onKey=e=>{if(['Escape','PageDown','End','ArrowDown',' '].includes(e.key))skip();};
    window.addEventListener('wheel',skip,{passive:true,once:true});
    window.addEventListener('touchstart',skip,{passive:true,once:true});
    window.addEventListener('keydown',onKey);
    hero.addEventListener('focusin',skip);
    cleanups.push(()=>{
     window.removeEventListener('wheel',skip);
     window.removeEventListener('touchstart',skip);
     window.removeEventListener('keydown',onKey);
     hero.removeEventListener('focusin',skip);
    });
   }
   for(const [id,selectors] of [
    ['about','.about-copy > .eyebrow,.about-specialties,.about-actions,.about-editorial-meta'],
    ['work','.works-total,.work-tools'],
    ['expertise','.service-controls'],
    ['contact','.contact-main > .eyebrow,.contact-bottom,.site-footer']
   ]){
    const section=page.querySelector(`#${id}`);
    if(section)cleanups.push(sectionScene(section,selectors));
   }
   gsap.fromTo(page.querySelectorAll('.career-step-body'),{y:50,clipPath:'inset(0% 0% 100% 0%)'},{
    y:0,clipPath:fullMask,duration:1.2,stagger:.16,ease:'power4.out',clearProps:'transform,clipPath',
    scrollTrigger:{trigger:page.querySelector('.experience'),start:'top 85%',once:true}
   });
   if(conditions.desktop){
    gsap.fromTo(hero.querySelector('.hero-media'),{yPercent:0,scale:1.08},{
     yPercent:12,scale:1.08,ease:'none',
     scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1.4}
    });
   }
   refreshMotion();
   return ()=>cleanups.forEach(cleanup=>cleanup());
  },page);
  const refresh=()=>{if(!disposed)refreshMotion();};
  document.fonts?.ready.then(refresh);
  window.addEventListener('load',refresh);
  return ()=>{disposed=true;window.removeEventListener('load',refresh);media.revert();};
 },[pageRef]);
}

export function useAccordionMotion(rootRef,enabled=true){
 useLayoutEffect(()=>{
  const root=rootRef.current;
  if(!root||!enabled)return;
  const media=gsap.matchMedia();
  media.add(mediaConditions,({conditions})=>{
   if(conditions.reduce)return;
   const timeline=gsap.timeline({defaults:{ease:'power4.out'},scrollTrigger:{trigger:root,start:'top 88%',once:true}});
   timeline.fromTo(root.querySelectorAll('.accordion-group-title > span,.accordion-group-title p'),{x:-64,clipPath:'inset(0% 100% 0% 0%)'},{
    x:0,clipPath:fullMask,duration:1.2,clearProps:'transform,clipPath'
   },0).fromTo(root.querySelector('.accordion-group-actions'),{y:24,autoAlpha:0},{
    y:0,autoAlpha:1,duration:.9,clearProps:'transform,opacity,visibility'
   },.2).fromTo(root.querySelectorAll('.ag-panel__frame'),{clipPath:'inset(100% 0% 0% 0%)'},{
    clipPath:fullMask,duration:1.5,stagger:.085,ease:'power4.inOut',clearProps:'clipPath'
   },.18);
   timeline.fromTo(root.querySelectorAll('.ag-panel__label'),{clipPath:'inset(0% 0% 100% 0%)'},{
    clipPath:fullMask,duration:.8,stagger:.085,clearProps:'clipPath'
   },.7);
   // Flex/rotation/media transforms belong to AccordionGallery; only its frame mask is animated here.
   const finish=()=>timeline.progress(1);
   root.addEventListener('focusin',finish);
   refreshMotion();
   return ()=>root.removeEventListener('focusin',finish);
  },root);
  return ()=>{media.revert();refreshMotion();};
 },[rootRef,enabled]);
}
