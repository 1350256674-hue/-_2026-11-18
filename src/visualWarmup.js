// Serialize expensive visual setup after scrolling settles, with a frame between jobs.
const QUIET_MS=160,GAP_MS=70;
let jobs=[],running=false,timer=0,idle=0,watching=false,lastScroll=0,nextSlot=0;
const stopWaiting=()=>{clearTimeout(timer);timer=0;if(idle){window.cancelIdleCallback?.(idle);idle=0;}};
function onScroll(){lastScroll=performance.now();arm();}
function onVisibility(){arm();}
function listen(){
 if(watching)return;watching=true;lastScroll=performance.now();
 window.addEventListener('scroll',onScroll,{passive:true,capture:true});
 document.addEventListener('visibilitychange',onVisibility);
}
function release(){
 if(!watching)return;watching=false;
 window.removeEventListener('scroll',onScroll,true);
 document.removeEventListener('visibilitychange',onVisibility);
}
function arm(){
 stopWaiting();jobs=jobs.filter(job=>!job.cancelled);
 if(running)return;
 if(!jobs.length){release();return;}
 if(document.hidden)return;
 const delay=Math.max(0,lastScroll+QUIET_MS-performance.now(),nextSlot-performance.now());
 timer=setTimeout(()=>{
  timer=0;
  if(window.requestIdleCallback)idle=window.requestIdleCallback(deadline=>{
   idle=0;
   const waited=performance.now()-Math.min(...jobs.map(job=>job.queuedAt));
   const critical=jobs.some(job=>job.priority===0);
   if(deadline.timeRemaining()<(critical?1:4)&&!deadline.didTimeout&&waited<(critical?160:800)){nextSlot=performance.now()+20;arm();return;}
   run();
  },{timeout:300});else run();
 },delay);
}
function run(){
 if(document.hidden||running){arm();return;}
 jobs.sort((a,b)=>a.priority-b.priority);
 const job=jobs.shift();if(!job){arm();return;}
 if(job.cancelled){arm();return;}
 running=true;
 Promise.resolve().then(()=>{if(!job.cancelled)return job.task();})
  .catch(error=>console.error('Visual warmup failed',error))
  .finally(()=>{running=false;nextSlot=performance.now()+GAP_MS;arm();});
}
export function queueVisualTask(task,{priority=10}={}){
 const job={task,priority,cancelled:false,queuedAt:performance.now()};jobs.push(job);listen();arm();
 return ()=>{job.cancelled=true;arm();};
}
