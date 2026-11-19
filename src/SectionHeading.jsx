import React from 'react';
import SplitText from './SplitText';

export default function SectionHeading({children}){
 return <SplitText tag="h2" text={children} className="motion-heading" textAlign="left"
  splitType="words, chars" mask delay={35} duration={1.6} ease="expo.out"
  from={{yPercent:125,xPercent:-14,rotation:-6,scaleY:.68,scaleX:1.15,opacity:1}}
  to={{yPercent:0,xPercent:0,rotation:0,scaleY:1,scaleX:1,opacity:1}}
  triggerScope="section" threshold={.14} rootMargin="0px" hoverEffect="lift"/>;
}
