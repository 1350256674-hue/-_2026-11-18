import React,{useCallback,useEffect,useRef,useState} from 'react';
import WorkCard from './WorkCard';

export default function WorkRow({groups,onOpen,blocked,pageVisible}){
 const node=useRef(null);
 const [width,setWidth]=useState(0),[expanded,setExpanded]=useState(null),[desktop,setDesktop]=useState(false),[viewportHeight,setViewportHeight]=useState(window.innerHeight);
 useEffect(()=>{
  const media=window.matchMedia('(min-width: 761px) and (hover: hover)');
  const update=()=>{setDesktop(media.matches);setViewportHeight(window.innerHeight);if(!media.matches)setExpanded(null);};update();media.addEventListener('change',update);window.addEventListener('resize',update);
  const observer=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));observer.observe(node.current);
  return()=>{observer.disconnect();media.removeEventListener('change',update);window.removeEventListener('resize',update);};
 },[]);
 const expand=useCallback((id,ratio)=>setExpanded(current=>current?.id===id&&current.ratio===ratio?current:{id,ratio}),[]);
 const focus=desktop&&!blocked?expanded:null;
 const single=groups.length===1;
 const available=width-(single?0:28);
 let columns=single?'minmax(0,1fr)':'minmax(0,1fr) minmax(0,1fr)';
 const height=available/(single?2.4:3.3);
 let activeHeight=height;
 let revealWidth=available;
 if(focus){
  // Keep the reveal close to the requested frame, including on large monitors.
  const activeWidth=Math.min(available*(single?1:.52),620);
  revealWidth=activeWidth;
  const fraction=single?1:Math.max(.5,activeWidth/available);
  activeHeight=Math.min(activeWidth/focus.ratio,780,viewportHeight*.68);
  if(!single){const a=groups[0].id===focus.id?fraction:1-fraction;columns=`minmax(0,${a}fr) minmax(0,${1-a}fr)`;}
 }
 const style=desktop&&width?{gridTemplateColumns:columns,'--row-cover-height':`${height}px`,'--active-cover-height':`${activeHeight}px`,'--active-cover-width':focus?`${revealWidth}px`:'100%'}:undefined;
 return <div ref={node} className={`work-row ${single?'work-row-single':''} ${focus?'work-row-expanded':''}`} style={style} onMouseLeave={()=>setExpanded(null)}>
  {groups.map(g=><WorkCard key={g.id} group={g} onOpen={onOpen} blocked={blocked} pageVisible={pageVisible} expanded={focus?.id===g.id} onFrameChange={expand}/>)}
 </div>;
}
