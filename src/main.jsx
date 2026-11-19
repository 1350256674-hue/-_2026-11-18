import React,{useState,useRef,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import './hero.css';
import './theme.css';
import './reactbits.css';
import WorkGallery from './WorkGallery';
import GradualBlur from './GradualBlur';
import SplitText from './SplitText';
import AboutSection from './AboutSection';
import ExpertiseSection from './ExpertiseSection';
import TargetCursor from './TargetCursor';
import PageParticles from './PageParticles';
import ContactSection from './ContactSection';
import PortfolioButton from './PortfolioButton';
import './discipline-glass.css';
import {usePortfolioMotion} from './usePortfolioMotion';
import useHeroPlayback from './useHeroPlayback';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
const zcool='https://www.zcool.com.cn/u/25231956';
const Arrow=({diagonal=true})=><span aria-hidden="true">{diagonal?'↗':'→'}</span>;
const jobs=[['2025.08 — 2026.06','英氏母婴电器旗舰店','三维渲染师','产品渲染 / 电商视觉 / 动态素材'],['2024.04 — 2025.05','欧宝美集团','3D 设计师','办公家具 / 场景表现 / 模型资产'],['2023.05 — 2024.01','近美健康科技（上海）有限公司','3D设计师','产品动画 / 三维建模 / 后期合成']];
function App(){const page=useRef(null);usePortfolioMotion(page);const [playing,setPlaying]=useState(false);const [menu,setMenu]=useState(false);const [toast,setToast]=useState('');const video=useRef();const [active,setActive]=useState('home');const [navFloating,setNavFloating]=useState(false);
useEffect(()=>{const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);}),{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main > section').forEach(s=>observer.observe(s));return()=>observer.disconnect();},[]);
useEffect(()=>{const hero=document.getElementById('home');if(!hero)return;const observer=new IntersectionObserver(([entry])=>{setNavFloating(!entry.isIntersecting&&entry.boundingClientRect.bottom<=80);},{rootMargin:'-80px 0px 0px 0px',threshold:0});observer.observe(hero);return()=>observer.disconnect();},[]);
const toggleVideo=useHeroPlayback(video);
useEffect(()=>{
 if(!location.hash||location.hash==='#home'||window.scrollY>=2)return;
 let frame;
 const align=()=>{ScrollTrigger.removeEventListener('refresh',align);frame=requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant',block:'start'}));};
 // Align only after the first measurement pass, when timeline triggers are initialized.
 if(ScrollTrigger.getAll().length)ScrollTrigger.addEventListener('refresh',align);else align();
 return()=>{ScrollTrigger.removeEventListener('refresh',align);cancelAnimationFrame(frame);};
},[]);
async function copy(){try{await navigator.clipboard.writeText(zcool);setToast('站酷主页链接已复制');}catch{setToast('请复制：'+zcool);}setTimeout(()=>setToast(''),3500);}
return <><PageParticles/><TargetCursor targetSelector="a[href], button:not(:disabled), .cursor-target" cursorColor="#eeeae2" cursorColorOnTarget="#ffffff" spinDuration={4} hoverDuration={.34} size={30} cornerSize={9} thickness={1.5} dotSize={3} padding={6} blendMode="normal" hideDefaultCursor parallaxOn/><header className={navFloating?"header header-floating":"header"}><a className="brand" href="#home" aria-label="周兴贤 首页" data-cursor-label="回到首页"><span className="brand-mark">Z<span>·</span></span><span>ZHOU XINGXIAN<small>3D ARTIST & VISUAL DESIGNER</small></span></a><button className="menu-button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="切换导航">☰</button><nav className={menu?'open':''} aria-label="主导航">{[['home','首页'],['about','关于我'],['work','精选作品'],['expertise','专业能力']].map(([id,label])=><a key={id} className={active===id?'active':''} href={'#'+id} data-cursor-label={label} onClick={()=>setMenu(false)}>{label}</a>)}</nav><PortfolioButton className="contact-pill" href="#contact" data-cursor-label="开始合作">聊聊合作 <Arrow/></PortfolioButton></header>
<main ref={page} className="portfolio-with-particles"><section className="hero hero-editorial" id="home"><div className="opening-curtain" aria-hidden="true"><div className="opening-top"><span>ZHOU XINGXIAN</span><span>3D VISUAL PORTFOLIO</span></div><div className="opening-name-mask"><span className="opening-name">ZHOUXX</span></div><div><div className="opening-rule"><span/></div><div className="opening-bottom"><span>FORM. LIGHT. MOTION.</span><span>从想法，到画面。</span></div></div></div><div className="hero-media"><video ref={video} muted loop playsInline preload="metadata" poster="/media/hero-poster.webp" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} aria-label="周兴贤产品动画作品"><source src="/media/product-film.mp4" type="video/mp4"/></video></div><div className="hero-shade"/><GradualBlur className="hero-gradual-blur" position="bottom" height="clamp(110px, 18vh, 200px)" strength={1.6} layers={5} curve="bezier" exponential tint="rgba(12, 13, 14, 0.32)" zIndex={1}/><div className="hero-editorial-top wrap"><div className="hero-title-line"><SplitText tag="h1" text="ZHOUXX" className="hero-split-title" textAlign="left" trigger="load" syncOpening startDelay={1.55} splitType="chars" mask delay={75} duration={1.8} ease="expo.out" from={{yPercent:125,rotation:8,skewX:-10,scaleY:.48,scaleX:1.18,opacity:1}} to={{yPercent:0,rotation:0,skewX:0,scaleY:1,scaleX:1,opacity:1}}/><span className="title-asterisk" aria-hidden="true">✳</span></div></div><div className="hero-editorial-bottom wrap"><div className="hero-left-column"><div className="hero-experience"><span className="experience-slashes" aria-hidden="true">///</span><strong>04<span>年</span></strong><p>三维视觉设计经验<small>PRODUCT VISUALIZATION & MOTION</small></p></div><PortfolioButton tone="light" className="hero-project-cta" href="#work" data-cursor-label="浏览作品">探索精选作品 <Arrow/></PortfolioButton></div></div><div className="hero-player-bar wrap"><a href="#about">向下探索 ↓</a><span>PRODUCT FILM / 周兴贤</span><PortfolioButton className="play-control" aria-label={playing?'暂停背景视频':'播放背景视频'} onClick={toggleVideo}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13L18.5 12 8 5.5Z"/></svg><span>{playing?'PAUSE FILM':'PLAY FILM'}</span></PortfolioButton></div></section><div className="discipline-strip"><div className="wrap"><span>PRODUCT VISUALIZATION</span><span className="discipline-separator" aria-hidden="true"/><span>CGI & ART DIRECTION</span><span className="discipline-separator" aria-hidden="true"/><span>MOTION DESIGN</span><span className="discipline-separator" aria-hidden="true"/><span>MATERIAL & LIGHT</span></div></div>
<AboutSection jobs={jobs} profileUrl={zcool}/>
<WorkGallery/><ExpertiseSection/>
<ContactSection profileUrl={zcool} onCopy={copy}/></main>
{navFloating&&<GradualBlur className="page-gradual-blur" target="page" position="bottom" height="clamp(56px, 7vh, 88px)" strength={1.25} layers={8} curve="bezier" exponential tint="rgba(12, 13, 14, 0.22)" autoHide duration={0.45} zIndex={30}/>}{toast&&<div className="toast" role="status">{toast}</div>}</>;}
if(new URLSearchParams(location.search).has('studio')){import('./Studio').then(({default:Studio})=>createRoot(document.getElementById('root')).render(<Studio/>));}else createRoot(document.getElementById('root')).render(<App/>);







