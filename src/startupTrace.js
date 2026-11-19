const enabled=import.meta.env.DEV&&new URLSearchParams(location.search).has('profile');
export function startupTrace(scope){
 if(!enabled){const noop=()=>{};noop.reset=()=>{};return noop;}
 let previous=performance.now();
 const trace=stage=>{const now=performance.now();console.info(`[startup:${scope}] ${stage}: ${(now-previous).toFixed(1)} ms`);previous=now;};
 trace.reset=()=>{previous=performance.now();};
 return trace;
}
