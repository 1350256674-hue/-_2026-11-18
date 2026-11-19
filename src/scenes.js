import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export function makeScene(canvas,kind=0,width=1600,height=1000){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setSize(width,height);renderer.setPixelRatio(1);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 const scene=new T.Scene();scene.background=new T.Color(kind===1?'#c2b9a9':kind===2?'#7d8d91':'#101215');
 const pmrem=new T.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;
 const camera=new T.PerspectiveCamera(35,width/height,.1,100);camera.position.set(0,1.2,9);camera.lookAt(0,0,0);
 const group=new T.Group();scene.add(group);
 const metal=new T.MeshStandardMaterial({color:'#c6d4da',metalness:1,roughness:.17});
 const mat=(color,roughness=.4,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const mesh=(geo,material,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);group.add(m);return m;};
 const box=(w,h,d,m,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
 if(kind===0){const knot=mesh(new T.TorusKnotGeometry(1.45,.48,280,48,2,3),metal);knot.rotation.set(.4,-.6,-.35);group.position.x=1.8;group.scale.setScalar(1.15);camera.position.set(0,.5,10);camera.lookAt(0,0,0);}
 if(kind===1){const body=mat('#e9e0ca',.22,.15);const dark=mat('#303938',.2,.6);mesh(new T.CylinderGeometry(.8,.87,2.2,96),body,0,-.15);mesh(new T.CylinderGeometry(.85,.85,.25,96),dark,0,1.08);mesh(new T.CylinderGeometry(.5,.5,.08,96),metal,0,1.25);box(.22,.7,.24,dark,.6,1.5,0);box(.65,.18,.25,dark,.38,1.82,0);const stripe=mesh(new T.TorusGeometry(.85,.022,16,90),metal,0,.3);stripe.rotation.x=Math.PI/2;group.rotation.y=-.4;camera.position.set(4,2.4,7);camera.lookAt(0,.15,0);}
 if(kind===2){const upholstery=mat('#233e43',.75);const frame=mat('#9ba6a4',.23,.85);const seat=mesh(new T.SphereGeometry(1,64,32),upholstery,0,-.3);seat.scale.set(1.4,.25,1.1);const back=mesh(new T.SphereGeometry(1,64,32),upholstery,0,.8,-.8);back.scale.set(1.4,1.2,.24);back.rotation.x=-.15;for(const x of [-1,1]){box(.12,1.7,.12,frame,x,-1.1,.6);box(.12,1.7,.12,frame,x,-1.1,-.7);box(.15,.15,1.7,frame,x,.15,0);}group.rotation.y=-.4;camera.position.set(4,2.5,7.5);camera.lookAt(0,0,0);}
 if(kind===3){mesh(new T.TorusKnotGeometry(1.25,.38,240,40,2,3),new T.MeshPhysicalMaterial({color:'#bbccd3',metalness:.98,roughness:.13})).rotation.set(.8,.4,.2);camera.position.set(0,0,7);camera.lookAt(0,0,0);}
 if(kind!==0){const floor=new T.Mesh(new T.PlaneGeometry(200,200),mat(kind===1?'#b2a995':kind===2?'#728589':'#17191b',.65));floor.rotation.x=-Math.PI/2;floor.position.y=kind===2?-1.98:-1.5;scene.add(floor);}
 const light=new T.DirectionalLight('#dcecff',4);light.position.set(2,4,3);scene.add(light);const edge=new T.PointLight('#b6d9ef',35);edge.position.set(-3,2,-2);scene.add(edge);
 const render=(t=0)=>{if(kind===0){group.rotation.y=Math.sin(t*Math.PI*2)*.22;group.rotation.z=Math.sin(t*Math.PI*2)*.08;}renderer.render(scene,camera);};render();
 return {render,dispose(){scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});env.dispose();room.dispose();pmrem.dispose();renderer.dispose();}};
}
