import {useEffect,useRef,useState} from 'react';

// One timer per carousel, started only after the image loads or the film ends.
export default function useCarousel(items,kind,active,running,initialIndex=0){
 const [index,setIndex]=useState(initialIndex),[ready,setReady]=useState(false),[ended,setEnded]=useState(false);
 const video=useRef(null);
 function select(next){if(!items.length){setReady(false);setEnded(false);setIndex(0);return;}const target=((typeof next==='function'?next(index):next)%items.length+items.length)%items.length;if(target===index)return;setReady(false);setEnded(false);setIndex(target);}
 function step(delta){select(i=>i+delta);}
 useEffect(()=>{
  if(!active||!running||items.length<2||!(kind==='image'?ready:ended))return;
  const timer=setTimeout(()=>step(1),kind==='image'?2000:1000);
  return()=>clearTimeout(timer);
 },[active,running,ready,ended,index,kind,items.length]);
 useEffect(()=>{
  const el=video.current;if(!el)return;
  if(active&&running&&!el.ended)el.play().catch(()=>{});else el.pause();
 },[active,running,index]);
 return {index,item:items[index],video,select,step,onLoad:()=>setReady(true),onEnded:()=>setEnded(true)};
}
