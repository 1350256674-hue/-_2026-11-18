import React from 'react';
import ContactLightfall from './ContactLightfall';
import SectionHeading from './SectionHeading';
import TextReveal from './TextReveal';
import PortfolioButton from './PortfolioButton';
import './contact-composition.css';

export default function ContactSection({profileUrl,onCopy}){
 return <section className="contact contact-with-lightfall contact-rebalanced" id="contact">
  <ContactLightfall/>
  <div className="wrap contact-inner">
   <div className="section-kicker"><span>04 / GET IN TOUCH</span><span>下一个好作品，从一次交流开始</span></div>
   <div className="contact-main contact-composition">
    <SectionHeading>LET’S TALK</SectionHeading>
    <h2 className="contact-message"><TextReveal className="contact-line" text="让好想法" duration={1.65}/><TextReveal className="contact-line contact-emphasis" text="被看见" duration={1.65} startDelay={.16}/></h2>
    <div className="contact-bottom contact-connect">
     <p>期待与你一起<br/>探索产品视觉的更多可能</p>
     <div className="contact-actions">
      <PortfolioButton tone="accent" className="contact-cta" href={profileUrl} target="_blank" rel="noreferrer">通过站酷联系我 <span aria-hidden="true">↗</span></PortfolioButton>
      <PortfolioButton onClick={onCopy}>复制站酷主页链接 <span aria-hidden="true">⧉</span></PortfolioButton>
     </div>
    </div>
   </div>
   <footer className="site-footer"><span>© {new Date().getFullYear()} 周兴贤 · ZHOU XINGXIAN</span><span>DESIGNED WITH INTENTION. RENDERED WITH PASSION.</span><a href="#home">BACK TO TOP ↑</a></footer>
  </div>
 </section>;
}
