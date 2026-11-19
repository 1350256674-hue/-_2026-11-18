import fs from 'node:fs';
import assert from 'node:assert/strict';

// A delayed frame should not launch the cursor off-screen or keep it oscillating.
const source=fs.readFileSync(new URL('../src/TargetCursor.jsx',import.meta.url),'utf8');
const helpers=source.slice(source.indexOf('const CORNER_ANGLES'),source.indexOf('const resolveElement'));
const spring=new Function(`${helpers};return spring;`)();
for(const dt of [1/144,1/60,1/30,.05]){
 for(const duration of [.05,.34,1]){
  const speed=4.6/duration;
  for(const [stiffness,damping] of [[2200,2*Math.sqrt(2200)],[speed*speed,2*.98*speed]]){
   const state={x:0,v:0};
   for(let step=0;step<Math.ceil(5/dt);step++){
    spring(state,1000,stiffness,damping,dt);
    assert(Number.isFinite(state.x+state.v),'motion remains finite');
    assert(state.x>-1&&state.x<1010,'motion remains within the target area');
   }
   assert(Math.abs(state.x-1000)<.01,'motion settles onto the target');
  }
 }
 console.log(`PASS cursor follow and target snap at ${Math.round(1/dt)} fps`);
}
