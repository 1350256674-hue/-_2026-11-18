import React from 'react';
import SplitText from './SplitText';

// Keep short copy crisp; longer body copy is split into complete readable lines.
export default function TextReveal({text,tag='span',className='',...props}){
 return <SplitText tag={tag} text={text} className={className} textAlign="left" mask
  effect="rise" delay={30} duration={1.35} ease="power4.out"
  from={{yPercent:110,rotation:3,opacity:1}} to={{yPercent:0,rotation:0,opacity:1}}
  threshold={.08} rootMargin="-55px" {...props}/>;
}
