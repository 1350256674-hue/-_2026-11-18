import {useEffect,useRef} from 'react';

// Automatic playback only belongs to the visible hero; a manual pause stays paused.
export default function useHeroPlayback(videoRef){
 const choice=useRef(null),syncRef=useRef(()=>{});
 useEffect(()=>{
  const video=videoRef.current,hero=document.getElementById('home');
  if(!video||!hero)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false,disposed=false;
  const sync=()=>{
   const wanted=choice.current??(!motion.matches&&!navigator.connection?.saveData);
   const allowed=wanted&&visible&&!document.hidden&&!document.querySelector('dialog[open]');
   if(allowed){video.play().then(()=>{if(disposed||document.hidden||!visible)video.pause();}).catch(()=>{});}
   else video.pause();
  };
  syncRef.current=sync;
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>0;sync();});
  observer.observe(hero);
  document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
  return()=>{disposed=true;syncRef.current=()=>{};observer.disconnect();document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);video.pause();};
 },[videoRef]);
 return ()=>{const video=videoRef.current;if(video){choice.current=video.paused;syncRef.current();}};
}
