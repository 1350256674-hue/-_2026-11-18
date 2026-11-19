import React from 'react';
import SpecularButton from './SpecularButton';
import './career-timeline.css';

export default function CareerTimeline({jobs}){
 return <div className="experience career-timeline" id="journey" role="region" aria-labelledby="career-heading">
  <header className="career-header"><span>CAREER PATH</span><h3 id="career-heading">工作经历</h3></header>
  <ol className="career-list">
   {jobs.map(([date,name,role,desc],index)=><li className={`career-step${index===0?' career-step-latest':''}`} key={name}>
    <span className="career-node" aria-hidden="true"/>
    <div className="career-step-body">
     <SpecularButton as="article" size="card" className="career-card cursor-target" radius={16} tintOpacity={0} blur={0} lineColor="#ffffff" baseColor="#555957" intensity={.85} idleIntensity={0} thickness={1} glow={.45} proximity={110} autoAnimate={false} aria-label={`${name}，${role}`}>
     <p className="career-date">{date}</p>
     <h4 className="career-company">{name}</h4>
     <span className="career-role">{role}</span>
     <p className="career-description">{desc.replaceAll(' / ',' · ')}</p>
     </SpecularButton>
    </div>
   </li>)}
  </ol>
  <p className="career-caption">每一程，积累新的视角。</p>
 </div>;
}
