import React,{useEffect,useRef,useState} from 'react';
import useCarousel from './useCarousel';
import './controls.css';
export default function WorkCard({group:g,onOpen,blocked,pageVisible,expanded=false,onFrameChange}){
 const node=useRef(null);const [visible,setVisible]=useState(false),[hovered,setHovered]=useState(false),[videoRatio,setVideoRatio]=useState(g.title==='PV'?9/16:16/9);
 useEffect(()=>{const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.15});observer.observe(node.current);return()=>observer.disconnect();},[]);
 const active=visible&&pageVisible&&!blocked&&(g.kind==='video'||hovered);
 const carousel=useCarousel(g.items,g.kind,active,true);
 const item=carousel.item;
 useEffect(()=>{if(g.kind!=='image'||!hovered)return;const next=g.items[(carousel.index+1)%g.items.length];const preload=new Image();preload.src=next.thumb;const full=new Image();full.src=next.src;},[g,hovered,carousel.index]);
 useEffect(()=>{if(!hovered)return;if(g.kind==='image'&&item.width&&item.height)onFrameChange?.(g.id,item.width/item.height);else if(g.title==='PV')onFrameChange?.(g.id,videoRatio);},[hovered,g.kind,g.id,g.title,item.id,item.width,item.height,videoRatio,onFrameChange]);
 return <article ref={node} className={'work-group '+(g.order===1?'work-featured ':'')+(expanded?'work-group-expanded':'')} data-group={g.title} data-slide={carousel.index+1}>
  <div className="work-cover" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
   <button className="work-card-open" onClick={()=>onOpen(g)} aria-label={`打开${g.title}作品，${g.items.length}${g.kind==='video'?'个视频':'张图片'}`}>
    {g.kind==='video'?<video key={item.id} className={g.title==='PV'?'work-video-reveal':undefined} style={{'--media-ratio':videoRatio}} ref={carousel.video} src={active?item.src:undefined} muted playsInline preload={active?'auto':'none'} poster={item.thumb} onLoadedMetadata={e=>{const v=e.currentTarget;if(v.videoWidth&&v.videoHeight)setVideoRatio(v.videoWidth/v.videoHeight);}} onEnded={carousel.onEnded} aria-label={item.name}/>:<><img key={item.id} className="work-image-preview" src={item.thumb} alt={`${g.title}作品：${item.name}`} loading="lazy" decoding="async" onLoad={carousel.onLoad}/><img className="work-image-full" src={expanded?item.src:item.thumb} alt="" aria-hidden="true" loading="lazy" decoding="async"/></>}
    <span className="work-cover-shade"/><span className="work-cover-label">{g.en}</span><span className="work-count">{String(carousel.index+1).padStart(2,'0')} / {String(g.items.length).padStart(2,'0')} {g.kind==='video'?'FILMS':'IMAGES'}</span><span className="work-open" aria-hidden="true">↗</span>
   </button>
   <div className="card-carousel-controls"><button onClick={()=>carousel.step(-1)} aria-label={`${g.title}上一件`} title="上一件">←</button><button onClick={()=>carousel.step(1)} aria-label={`${g.title}下一件`} title="下一件">→</button></div>
  </div>
  <div className="project-meta"><span className="project-number">/{String(g.order).padStart(2,'0')}</span><div><button className="work-title-button" onClick={()=>onOpen(g)}><h3>{g.title==='首页'?'首页视觉设计':g.title}</h3></button><p>{g.kind==='video'?'动态影像 · 产品展示':'三维视觉 · 产品表现'}</p></div><span className="project-year">VIEW COLLECTION</span></div>
 </article>;
}
