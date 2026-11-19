import React,{useState,useRef,useEffect,useLayoutEffect} from 'react';
import groups from './works.json';
import './works.css?pv-reveal';
import useCarousel from './useCarousel';
import AccordionGroup from './AccordionGroup';
import SectionHeading from './SectionHeading';
import TextReveal from './TextReveal';
import {refreshMotion} from './usePortfolioMotion';

const counts=groups.reduce((a,g)=>({...a,[g.kind]:a[g.kind]+g.items.length}),{image:0,video:0});
export default function WorkGallery(){
 const [filter,setFilter]=useState('全部');
 useLayoutEffect(()=>{refreshMotion();},[filter]);
 const [group,setGroup]=useState(null);
 const [pageVisible,setPageVisible]=useState(!document.hidden),[stageHovered,setStageHovered]=useState(false);
 const carousel=useCarousel(group?.items||[],group?.kind,!!group&&pageVisible&&(group.kind==='video'||stageHovered),true);
 const {index,item,select,step}=carousel;
 useEffect(()=>{const update=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update);},[]);
 const dialog=useRef(null), close=useRef(null), trigger=useRef(null), heroWasPlaying=useRef(false), openIndex=useRef(0);

 function open(g,initialIndex=0){trigger.current=document.activeElement;select(0);openIndex.current=initialIndex;setStageHovered(false);setGroup(g);}
 function dismiss(){setGroup(null);}
 const visibleGroups=groups.filter(g=>filter==='全部'||g.kind===(filter==='场景渲染'?'image':'video'));
 useLayoutEffect(()=>{if(group)select(openIndex.current);},[group]);

 useEffect(()=>{
  if(!group)return;
  const hero=document.querySelector('.hero video');heroWasPlaying.current=hero&&!hero.paused;hero?.pause();
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  dialog.current?.showModal();close.current?.focus();
  return()=>{document.body.style.overflow=overflow;trigger.current?.focus();if(heroWasPlaying.current)hero?.play().catch(()=>{});};
 },[group]);
 return <section className="work section" id="work"><div className="wrap">
  <div className="section-kicker"><span>02 / SELECTED WORK</span><span>光影之下，细节之上</span></div><SectionHeading>SELECTED WORK</SectionHeading>
  <div className="section-title-row"><div><h2 className="work-editorial-title"><TextReveal className="work-interactive-title cursor-target" text="以视觉" hoverEffect="lift"/><TextReveal className="muted work-interactive-title cursor-target" text="赋予价值" startDelay={.12} hoverEffect="lift"/></h2><TextReveal tag="p" className="section-subtitle work-interactive-subtitle cursor-target" text="产品动画、渲染静帧与电商视觉，记录我的创作实践。" splitType="lines" delay={110} hoverEffect="lift" from={{yPercent:100,rotation:0,opacity:1}}/></div><span className="works-total">{counts.image} 张图片 <i>/</i> {counts.video} 部影片 <i>/</i> {groups.length} 个分组</span></div>
  <div className="work-tools"><div className="filters" role="group" aria-label="作品类型">{['全部','场景渲染','动态视频'].map(label=><button key={label} aria-pressed={filter===label} className={filter===label?'selected':''} onClick={()=>setFilter(label)}>{label}<sup>{label==='全部'?groups.length:groups.filter(g=>g.kind===(label==='场景渲染'?'image':'video')).length}</sup></button>)}</div><span className="works-hint">选择分组，浏览完整作品 ↗</span></div>
  <div className="works-grid works-adaptive">{visibleGroups.map(g=><AccordionGroup key={g.id} group={g} onOpen={open} blocked={!!group} pageVisible={pageVisible}/>)}</div>  <div className="work-end"><span>FORM. LIGHT. MOTION.</span><span>全部作品按原始素材分组收录</span></div>
 </div>{group&&<dialog className="collection-dialog" ref={dialog} aria-label={`${group.title}作品集`} onCancel={dismiss} onClick={e=>{if(e.target===dialog.current)dismiss();}} onKeyDown={e=>{if(['VIDEO','INPUT'].includes(e.target.tagName))return;if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}}}>
   <header className="collection-header"><div><span>{group.en}</span><h2>{group.title}</h2></div><div className="collection-index">{index+1} / {group.items.length}</div><button ref={close} className="collection-close" onClick={dismiss} aria-label="关闭作品集">×</button></header>
   <div className="collection-stage" onMouseEnter={()=>setStageHovered(true)} onMouseLeave={()=>setStageHovered(false)}>{group.kind==='video'?<video key={item.id} ref={carousel.video} src={item.src} controls muted playsInline preload="auto" poster={item.thumb} onEnded={carousel.onEnded} aria-label={item.name}>当前浏览器无法播放此视频，请使用下方链接打开。</video>:<img key={item.id} src={item.src} alt={item.name} onLoad={carousel.onLoad}/>}</div>
   <div className="collection-toolbar"><button onClick={()=>step(-1)} aria-label="上一件作品">←</button><p>{item.name}</p><a href={item.src} target="_blank" rel="noreferrer">{group.kind==='video'?'打开视频':'查看大图'} ↗</a><button onClick={()=>step(1)} aria-label="下一件作品">→</button></div>
   <div className="collection-thumbs" role="group" aria-label="组内作品">{group.items.map((media,i)=><button key={media.id} className={i===index?'current':''} aria-pressed={i===index} aria-label={`查看${media.name}`} onClick={()=>select(i)}><img src={media.thumb} alt="" loading="lazy"/><span>{String(i+1).padStart(2,'0')}{group.kind==='video'?' ▷':''}</span></button>)}</div>
 </dialog>}</section>;
}


