import React from 'react';
import ArtistLanyard from './ArtistLanyard';
import TextReveal from './TextReveal';
import CareerTimeline from './CareerTimeline';
import PortfolioButton from './PortfolioButton';
import './about-editorial.css';

export default function AboutSection({jobs,profileUrl}){
 return <section className="about about-editorial section wrap" id="about">
  <div className="about-grid about-editorial-grid">
   <ArtistLanyard variant="editorial"/>
   <div className="about-copy about-editorial-copy">
    <div className="eyebrow about-editorial-kicker"><span>01 /</span> ABOUT ME</div>
    <h2 className="about-editorial-title" aria-label="CRAFTING REALITY.">
     <TextReveal text="CRAFTING" className="about-interactive-title cursor-target" hoverEffect="lift" triggerScope="#about" rootMargin="0px" threshold={.14} duration={1.65}/><br/>
     <TextReveal text="REALITY." className="about-interactive-title cursor-target" hoverEffect="lift" triggerScope="#about" rootMargin="0px" threshold={.14} startDelay={.14} duration={1.65}/>
    </h2>
    <div className="about-specialties" aria-label="创作方向">{['产品渲染','场景视觉','动态影像'].map(label=><PortfolioButton as="span" size="tag" radius={999} className="about-specialty cursor-target" key={label}>{label}</PortfolioButton>)}</div>
    <TextReveal tag="p" className="body-copy about-editorial-intro about-interactive-copy cursor-target" hoverEffect="lift" text="我是周兴贤，拥有4年三维视觉设计经验。擅长C4D及OC、RS渲染，独立完成材质灯光、场景搭建、后期精修与产品动画。" splitType="lines" delay={110} from={{yPercent:100,rotation:0,opacity:1}}>我是周兴贤，拥有<strong className="about-highlight">4年三维视觉设计经验</strong>。擅长C4D及OC、RS渲染，<strong className="about-highlight about-highlight-accent">独立完成</strong>材质灯光、场景搭建、后期精修与产品动画。</TextReveal>
    <TextReveal tag="p" className="body-copy secondary-copy about-editorial-detail about-interactive-copy cursor-target" hoverEffect="lift" text="熟悉主流电商平台需求，结合AI辅助设计，将产品质感、功能卖点与品牌调性转化为清晰的视觉表达。" splitType="lines" delay={110} from={{yPercent:100,rotation:0,opacity:1}}>熟悉主流电商平台需求，结合<span className="about-inline-phrase"><strong className="about-highlight">AI辅助设计</strong>，</span>将产品质感、功能卖点与品牌调性转化为清晰的视觉表达。</TextReveal>
    <div className="about-actions">
     <PortfolioButton tone="light" className="about-primary-action" href="#work" data-cursor-label="浏览作品">探索精选作品 <span aria-hidden="true">↗</span></PortfolioButton>
     <a className="about-film-action" href="/media/product-film.mp4" target="_blank" rel="noreferrer" aria-label="在新窗口观看产品动画" data-cursor-label="观看动画"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/><path d="m10 8 6 4-6 4V8Z" fill="currentColor"/></svg>观看产品动画</a>
    </div>
    <div className="about-editorial-meta"><span className="about-city cursor-target"><span>意向城市 /</span><span>杭州</span></span><a href={profileUrl} target="_blank" rel="noreferrer">站酷主页 <span aria-hidden="true">↗</span></a></div>
    <div className="about-editorial-contact"><span>联系电话 /</span><a href="tel:18069815997" aria-label="拨打联系电话 18069815997" data-cursor-label="拨打电话">18069815997</a></div>
   </div>
  </div>
  <CareerTimeline jobs={jobs}/>
 </section>;
}
