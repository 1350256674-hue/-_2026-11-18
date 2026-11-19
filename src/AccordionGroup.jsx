import React,{useEffect,useRef,useState} from 'react';
import AccordionGallery from './AccordionGallery';
import TextReveal from './TextReveal';
import useCarousel from './useCarousel';
import './accordion-groups.css';
import {useAccordionMotion} from './usePortfolioMotion';

export default function AccordionGroup({group:g,onOpen,blocked,pageVisible}){
 const root=useRef(null);
 const [near,setNear]=useState(false);
 useAccordionMotion(root,near);
 const [visible,setVisible]=useState(false),[hovered,setHovered]=useState(false);
 const [height,setHeight]=useState(Math.min(520,Math.max(360,window.innerHeight*.48)));
 useEffect(()=>{
  const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.12});observer.observe(root.current);
  const preloadObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setNear(true);preloadObserver.disconnect();}},{rootMargin:'400px'});preloadObserver.observe(root.current);
  const resize=()=>setHeight(Math.min(520,Math.max(360,window.innerHeight*.48)));window.addEventListener('resize',resize);
  return()=>{observer.disconnect();preloadObserver.disconnect();window.removeEventListener('resize',resize);};
 },[]);
 const active=visible&&pageVisible&&!blocked&&(g.kind==='video'||hovered);
 const carousel=useCarousel(g.items,g.kind,active,true);
 const title=g.title==='首页'?'首页视觉设计':g.title;
 useEffect(()=>{
  if(g.kind==='image'){
   const image=root.current?.querySelector('.ag-panel--active .accordion-media-cover');
   if(image?.complete&&image.naturalWidth)carousel.onLoad();
  }
  if(window.innerWidth<=760){
   const gallery=root.current?.querySelector('.accordion-gallery'),panel=gallery?.querySelector('.ag-panel--active');
   if(gallery&&panel){const left=panel.getBoundingClientRect().left-gallery.getBoundingClientRect().left+gallery.scrollLeft-10;gallery.scrollTo({left:Math.max(0,left),behavior:'smooth'});}
  }
 },[carousel.index,g.kind]);
 const items=g.items.map((item,i)=>({...item,image:item.thumb,label:`${String(i+1).padStart(2,'0')} / ${g.kind==='video'?'视频':'作品'}`,alt:item.name}));
 function renderMedia(item,i,isActive){
  if(g.kind==='video'&&isActive)return <video key={item.id} ref={carousel.video} src={active?(item.preview||item.src):undefined} poster={item.thumb} muted playsInline preload={active?'auto':'none'} onEnded={carousel.onEnded} aria-label={item.name}/>;
  return <><img className="accordion-media-cover" src={item.thumb} width={item.width} height={item.height} alt={item.name} loading="lazy" draggable="false" decoding="async" onLoad={isActive?carousel.onLoad:undefined}/><img className="accordion-media-full" src={isActive&&visible?(item.preview||item.src):item.thumb} width={item.width} height={item.height} alt="" aria-hidden="true" loading="lazy" draggable="false" decoding="async"/></>;
 }
 return <article ref={root} className="portfolio-accordion-group" data-group={g.title} data-order={g.order} data-slide={carousel.index+1}>
  <header className="accordion-group-header"><div className="accordion-group-title"><span>/{String(g.order).padStart(2,'0')}</span><div><TextReveal tag="h3" text={title} triggerScope=".portfolio-accordion-group" threshold={.12} rootMargin="0px"/><p>{g.en}</p></div></div><div className="accordion-group-actions"><span className="accordion-group-counter">{String(carousel.index+1).padStart(2,'0')} / {String(g.items.length).padStart(2,'0')}</span><div className="card-carousel-controls accordion-row-controls"><button onClick={()=>carousel.step(-1)} aria-label={`${title}上一件`}>←</button><button onClick={()=>carousel.step(1)} aria-label={`${title}下一件`}>→</button></div><button className="accordion-view-all" onClick={()=>onOpen(g,carousel.index)}>查看全部 ↗</button></div></header>
  <div className="accordion-group-stage" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
   {near?<AccordionGallery items={items} activeIndex={carousel.index} onActiveChange={carousel.select} onItemOpen={i=>onOpen(g,i)} renderMedia={renderMedia} height={height} duration={1.05} expandRatio={.42} accentColor="#ff3825" overlayColor="#101112" tilt={3} parallax={.22} gap={12} radius={12} grayscale ariaLabel={`${title}，共${g.items.length}件作品`}/>:<div className="accordion-group-placeholder" style={{height}} aria-hidden="true"/>}
  </div>
 </article>;
}
