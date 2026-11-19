import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as THREE from 'three';

// Exercise the supplied solver without a GPU: a build alone cannot catch an unstable swing.
const source=fs.readFileSync(new URL('../src/Lanyard.jsx',import.meta.url),'utf8');
const helpers=source.slice(source.indexOf('const CARD_SIZES'),source.indexOf('const Lanyard ='));
const physics=source.slice(source.indexOf('    const physics = () =>'),source.indexOf('    const tick ='));
const api=new Function('THREE','settingsRef','reducedMotion',`${helpers}\n${physics}\nreturn {createSimulation,cardLayout,configureSimulation,placeHanging,stepSimulation,physics,frameMetrics};`)(
 THREE,{current:{gravity:.85,damping:.78,elasticity:.25,breeze:0}},false
);
for(const [width,height,extension] of [[650,700,64],[800,760,64],[460,630,64],[335,510,35]]){
 const layout=api.cardLayout('portrait',.34);
 const original=api.frameMetrics(layout,{width,height,topExtension:0},.7,.28);
 const extended=api.frameMetrics(layout,{width,height:height+extension,topExtension:extension},.7,.28);
 const originalTop=extension+(original.viewHeight/2-original.cardTop)*height/original.viewHeight;
 const extendedTop=(extended.viewHeight/2-extended.cardTop)*(height+extension)/extended.viewHeight;
 assert(Math.abs(originalTop-extendedTop)<1e-8,'extension preserves the card position');
 assert(Math.abs(layout.height*height/original.viewHeight-layout.height*(height+extension)/extended.viewHeight)<1e-8,'extension preserves the card size');
}
console.log('PASS continuous top extension on desktop, tablet and mobile');
for(const scenario of ['drop','drag-release','flip','low-frame-rate']){
 const layout=api.cardLayout('portrait',.34),sim=api.createSimulation();
 sim.anchor.set(0,2.14,0);
 api.configureSimulation(sim,layout,1.04);
 api.placeHanging(sim,layout,scenario==='drop');
 const dt=scenario==='low-frame-rate'?1/30:1/60;
 let time=0;
 const advance=seconds=>{
  for(let i=0;i<Math.ceil(seconds/dt);i++){
   time+=dt;api.stepSimulation(sim,dt,api.physics(),time);
   for(const node of sim.nodes)assert(node.toArray().every(Number.isFinite),`${scenario}: finite strap nodes`);
   assert(sim.body.position.toArray().every(Number.isFinite),`${scenario}: finite card position`);
   assert(Math.abs(sim.body.quaternion.length()-1)<.001,`${scenario}: normalized rotation`);
  }
 };
 advance(2);
 if(scenario==='drag-release'){
  const point=sim.body.position.clone();
  sim.grab={local:new THREE.Vector3(),rotation:sim.body.quaternion.clone(),reach:10,from:point.clone(),target:point.clone().add(new THREE.Vector3(1,.7,.1))};
  advance(1);sim.grab=null;
 }
 if(scenario==='flip'){
  sim.turn=Math.PI;
  sim.body.angular.addScaledVector(new THREE.Vector3(0,1,0).applyQuaternion(sim.body.quaternion),9);
 }
 advance(10);
 assert(sim.body.position.y<sim.anchor.y,`${scenario}: card hangs below the anchor`);
 assert(Math.abs(sim.body.position.x)<.2,`${scenario}: swing returns to center`);
 assert(sim.lengths.every(length=>length<sim.rest*1.5),`${scenario}: band returns to its working length`);
 if(scenario==='flip')assert(Math.abs(sim.twist-Math.PI)<.2,'flip: reverse face settles correctly');
 assert(sim.calm>1.2,`${scenario}: settled motion can stop rendering`);
 console.log(`PASS ${scenario}`);
}
