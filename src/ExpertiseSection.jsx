import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import TextReveal from './TextReveal';
import SpecularButton from './SpecularButton';
import './expertise-services.css';

gsap.registerPlugin(ScrollTrigger);

const services=[
 {type:'product',title:'产品级质感',en:'PRODUCT RENDERING',description:'从材质纹理到细腻反射，用准确的灯光与渲染，让产品拥有可信的真实感。',tools:'Cinema 4D / Octane / Redshift',href:'#work',action:'查看精选作品'},
 {type:'scene',title:'有叙事的场景',en:'SCENE & COMPOSITION',description:'围绕产品特点构建场景，以构图和氛围组织画面，让视觉表达贴合品牌调性。',tools:'Scene Design / Lighting',href:'#work',action:'查看精选作品'},
 {type:'motion',title:'让视觉动起来',en:'MOTION & COMPOSITING',description:'通过产品动画、视频剪辑与后期合成，清晰呈现产品功能与结构细节。',tools:'Cinema 4D / After Effects',href:'/media/product-film.mp4',action:'观看产品动画'},
 {type:'workflow',title:'更完整的交付',en:'VISUAL WORKFLOW',description:'理解电商平台与营销需求，结合精修合成和 AI 辅助设计，完成多形式视觉输出。',tools:'Photoshop / AI Workflow',href:'#contact',action:'聊聊合作'}
];

function ServiceIcon({type}){
 return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {type==='product'&&<><path d="m16 4 11 6.5v13L16 30 5 23.5v-13L16 4Z" transform="translate(0 -1) scale(1 .94)"/><path d="m5 10 11 6 11-6M16 16v12M10.5 7 22 13.5"/></>}
  {type==='scene'&&<><rect x="4" y="5" width="24" height="22" rx="3"/><path d="M10 27V15a6 6 0 0 1 12 0v12M4 21h6m12 0h6M16 5v4"/></>}
  {type==='motion'&&<><circle cx="16" cy="16" r="11"/><path d="m13 11 8 5-8 5V11Z"/><path d="M3 8 1 11m28 10 2 3"/></>}
  {type==='workflow'&&<><path d="m16 3 3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5L16 3Z"/><path d="m25 4 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z"/></>}
 </svg>;
}

export default function ExpertiseSection(){
 const root=useRef(null),viewport=useRef(null);
 const layout=useRef({visible:3,stride:0,max:1});
 const [view,setView]=useState({start:0,visible:3});
 useEffect(()=>{
  const rail=viewport.current;
  const update=()=>{
   const next={start:Math.max(0,Math.min(layout.current.max,Math.round(rail.scrollLeft/(layout.current.stride||1)))),visible:layout.current.visible};
   setView(previous=>previous.start===next.start&&previous.visible===next.visible?previous:next);
  };
  const measure=()=>{
   const cards=rail.querySelectorAll('.service-card');
   const visible=Number(getComputedStyle(rail).getPropertyValue('--service-visible'))||3;
   const stride=cards[1].offsetLeft-cards[0].offsetLeft;
   layout.current={visible,stride,max:Math.max(0,services.length-visible)};
   update();
  };
  const observer=new ResizeObserver(measure);observer.observe(rail);
  rail.addEventListener('scroll',update,{passive:true});measure();
  return()=>{observer.disconnect();rail.removeEventListener('scroll',update);};
 },[]);
 useLayoutEffect(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const reveal=gsap.fromTo(root.current.querySelectorAll('.service-card'),{y:64,rotation:1.2,clipPath:'inset(0% 0% 100% 0%)'},{
    y:0,rotation:0,clipPath:'inset(0% 0% 0% 0%)',duration:1.4,stagger:.13,ease:'power4.out',clearProps:'transform,clipPath',
    scrollTrigger:{trigger:viewport.current,start:'top 85%',once:true}
   });
   const finish=()=>reveal.progress(1);viewport.current.addEventListener('focusin',finish);
   return()=>viewport.current?.removeEventListener('focusin',finish);
  },root);
  return()=>media.revert();
 },[]);
 function step(delta){
  const rail=viewport.current,{stride,max}=layout.current;
  const index=Math.max(0,Math.min(max,Math.round(rail.scrollLeft/(stride||1))+delta));
  rail.scrollTo({left:index*stride,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 }
 return <section ref={root} className="expertise expertise-services section wrap" id="expertise" aria-labelledby="expertise-title">
  <div className="service-header">
   <div><span className="service-kicker">03 / EXPERTISE</span><h2 id="expertise-title" className="service-heading"><TextReveal text="MY EXPERTISE" duration={1.5} delay={28} triggerScope="#expertise" threshold={.14} rootMargin="0px"/></h2></div>
   <div className="service-controls"><span className="service-counter" aria-live="polite" aria-atomic="true">{String(view.start+1).padStart(2,'0')} — {String(Math.min(services.length,view.start+view.visible)).padStart(2,'0')} <i>/ 04</i></span><button onClick={()=>step(-1)} disabled={view.start===0} aria-label="上一组专业能力" aria-controls="expertise-cards"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg></button><button onClick={()=>step(1)} disabled={view.start>=services.length-view.visible} aria-label="下一组专业能力" aria-controls="expertise-cards"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 5 5 5-5 5"/></svg></button></div>
  </div>
  <div ref={viewport} className="service-viewport" id="expertise-cards" role="region" aria-label="专业能力卡片，可用左右方向键切换" aria-roledescription="轮播" tabIndex={0} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();step(event.key==='ArrowLeft'?-1:1);}}}>
   {services.map((service,index)=><SpecularButton as="article" size="card" radius={24} tint="#1b1c1b" tintOpacity={.92} blur={8} lineColor="#ffffff" baseColor="#555957" intensity={.9} idleIntensity={.18} shineSize={14} shineFade={40} thickness={1.1} glow={.6} proximity={150} autoAnimate={false} className="service-card cursor-target" key={service.type} role="group" aria-roledescription="卡片" aria-label={`${index+1} / ${services.length} ${service.title}`} inert={index<view.start||index>=view.start+view.visible}>
    <span className="service-number" aria-hidden="true">/{String(index+1).padStart(2,'0')}</span><div className="service-icon cursor-target"><ServiceIcon type={service.type}/></div>
    <TextReveal tag="h3" text={service.title} className="service-card-title" textAlign="center" startDelay={.2}/><span className="service-card-en">{service.en}</span>
    <p className="service-description">{service.description}</p><p className="service-tools">{service.tools}</p>
    <a className="service-link" href={service.href} target={service.type==='motion'?'_blank':undefined} rel={service.type==='motion'?'noreferrer':undefined}>{service.action}<span aria-hidden="true">↗</span></a>
   </SpecularButton>)}
  </div>
  <p className="service-summary">从创意，到交付。让每一个环节，都为最终画面负责。</p>
 </section>;
}
