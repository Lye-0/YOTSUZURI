import {CradleInputs,type CradlePresentation} from './CradleInputs';
import {OpticalInputs,type OpticalPresentation} from './OpticalInputs';
import {WorldCamera} from './WorldCamera';
import {RepairWorld} from './RepairWorld';
import type {World} from './campaign';
import {WeighingInputs,type WeighingPresentation} from './WeighingInputs';
import {WeighingWorld} from './WeighingWorld';
import {WatermarkWorld} from './WatermarkWorld';
import {WatermarkInputs,type WatermarkPresentation} from './WatermarkInputs';
import {separateTarget} from './screenTargets';
import {envelopeOrigin,envelopeScreenCentre} from './envelopeGeometry';
import {EnvelopeHotspots} from './EnvelopeHotspots';
import {EnvelopeArt,type EnvelopeArtProps} from './EnvelopeArt';
import {EnvelopeControls} from './EnvelopeControls';
import {useLayoutEffect,useRef,useState} from 'react';
import {archiveCamera,archiveRoom,archiveEye,archiveRoomEye,archiveProjectEye,archiveFloorPoint,archivePickShelf,archiveRayClear,archiveDoorPoint,archivePassable,shelfHandlePoint,shelfNames,shelfSpecs,shelfRect,type ShelfState,type ArchiveEye} from './archiveSpace';
import {ArchiveControls} from './ArchiveControls';
import './archive.css';
import {archiveOldPlan,oldFootprint} from './archivePlan';
import {photoBounds} from './photoBounds';
const M=archiveCamera.scale;
import {Face,Photograph,type UV} from './ArchivePhotos';
export {archivePhotoFiles} from './archiveAssets';
function Rails(){const tracks=[[1.69,.1,1.68,90],[2.96,.1,1.68,90],[3.6,0,5.2,90],[4.1,0,5.2,90],[1,.96,3.15,0],[1,2.16,3.15,0],[0,.14,4.17,0],[0,.7,4.17,0]],info=photoBounds['parts/archive/rail'],[x,y,w,h]=info.bounds,uv=(start:number,end:number):UV=>[(x+w*start)/info.width,y/info.height,w*(end-start)/info.width,h/info.height];return <Face x={0} y={0} z={.004} width={4.2} height={5.2} tilt={90} floor>{tracks.map(([x,y,length,angle],i)=>{const cap=.04,middle=length-2*cap,count=Math.ceil(middle/.8);return <div key={i} style={{position:'absolute',left:x*M,top:y*M,width:length*M,height:.055*M,transform:`rotate(${angle}deg) translateY(-50%)`,transformOrigin:'0 0',pointerEvents:'none'}}><div className="archive-wall-tile" style={{left:0,top:0,width:cap*M,height:'100%'}}><Photograph id="rail" crop={uv(0,.03)}/></div>{Array.from({length:count},(_,j)=><div key={j} className="archive-wall-tile" style={{left:(cap+j*middle/count)*M,top:0,width:middle/count*M+.1,height:'100%'}}><Photograph id="rail" crop={uv(.03,.97)}/></div>)}<div className="archive-wall-tile" style={{right:0,top:0,width:cap*M,height:'100%'}}><Photograph id="rail" crop={uv(.97,1)}/></div></div>;})}</Face>;}
const walls={
 north:{width:4.2,x:0,y:0,turn:0,sx:[0,489/1536,918/1536,1],dx:[0,1.4,2.45,4.2],sy:[0,131/1024,529/1024,615/1024,1],dy:[0,.41,1.49,1.7,2.8],hole:false},
 east:{width:5.2,x:4.2,y:0,turn:-90,sx:[0,946/1709,1289/1709,1],dx:[0,2.925,4.0625,5.2],sy:[0,220/920,550/920,1],dy:[0,.72,1.7,2.8],hole:true},
 south:{width:4.2,x:4.2,y:5.2,turn:180,sx:[0,635/1536,984/1536,1],dx:[0,1.75,2.8,4.2],sy:[0,247/1024,610/1024,1],dy:[0,.72,1.7,2.8],hole:true},
 west:{width:5.2,x:0,y:5.2,turn:90,sx:[0,469/1708,839/1708,1],dx:[0,1.3975,2.61625,5.2],sy:[0,211/921,550/921,1],dy:[0,.72,1.7,2.8],hole:true},
} as const;
function ArchiveFloor({room}:{room:6|7}){
 // Calibrate generated caster dents to the drawing; never change the logical footprint to fit a photograph.
 const a=oldFootprint(room===6?3:0),b=oldFootprint(room===6?2:1),px=(r:typeof a,n:number)=>(r.x+r.width*n)/4.2,py=(r:typeof a,n:number)=>(r.y+r.depth*n)/5.2;
 const sx=(room===6?[0,185,373,607,925,1127]:[0,188,280,566,941,1127]).map(n=>n/1127),sy=(room===6?[0,165,300,426,617,1396]:[0,130,238,1032,1151,1396]).map(n=>n/1396);
 const dx=room===6?[0,px(a,.04),px(a,.96),px(b,.04),px(b,.96),1]:[0,px(b,.04),px(a,.04),px(a,.96),px(b,.96),1],dy=[0,py(a,.06),py(a,.94),py(b,.06),py(b,.94),1];
 return <Face x={room===6?0:-4.2} y={0} z={0} width={4.2} height={5.2} tilt={90} floor>{dx.slice(0,-1).flatMap((x,i)=>dy.slice(0,-1).map((y,j)=><div key={`${i}:${j}`} className="archive-wall-tile" style={{left:x*4.2*M,top:y*5.2*M,width:(dx[i+1]-x)*4.2*M+.1,height:(dy[j+1]-y)*5.2*M+.1}}><Photograph id="floor-traces" group={`scenes/archive-${room===6?'east':'west'}`} crop={[sx[i],sy[j],sx[i+1]-sx[i],sy[j+1]-sy[j]]}/></div>))}</Face>;
}
function ArchivePortals({room,facing,eye,scale,values,open,onPortal}:{room:6|7;facing:number;eye:ArchiveEye;scale:number;values:ShelfState;open:boolean;onPortal:(room:number)=>void}){
 let target:number,name:string,points:[number,number,number][];
 if(room===6&&facing===2){target=3;name='活字室へ戻る';points=[[1.4,5.2,2.08],[2.45,5.2,2.08],[2.45,5.2,0],[1.4,5.2,0]];}
 else if(room===6&&facing===3||room===7&&facing===1){target=room===6?7:6;name=room===6?'西書庫へ進む':'東書庫へ戻る';points=[[0,archiveRoom.westDoor[0],2.08],[0,archiveRoom.westDoor[1],2.08],[0,archiveRoom.westDoor[1],0],[0,archiveRoom.westDoor[0],0]];}
 else if(room===6&&facing===1&&open&&archivePassable(values)){target=8;name='修復室へ進む';const from=Math.max(archiveRoom.eastDoor[0],shelfRect(values,1).y+shelfSpecs[1].depth);points=[[4.2,from,2.08],[4.2,archiveRoom.eastDoor[1],2.08],[4.2,archiveRoom.eastDoor[1],0],[4.2,from,0]];}
 else return null;
 const p=points.map(point=>archiveProjectEye(point,eye));if(p.some(v=>v[2]<=.01))return null;
 const x=Math.min(...p.map(v=>v[0])),y=Math.min(...p.map(v=>v[1])),w=Math.max(...p.map(v=>v[0]))-x,h=Math.max(...p.map(v=>v[1]))-y;
 return <button className="archive-portal" aria-label={name} onClick={()=>onPortal(target)} style={{position:'absolute',left:x*scale,top:y*scale,width:w*scale,height:h*scale,clipPath:`polygon(${p.map(v=>`${(v[0]-x)/w*100}% ${(v[1]-y)/h*100}%`).join(',')})`}}/>;
}
type WallSpec={width:number;x:number;y:number;turn:number;sx:readonly number[];dx:readonly number[];sy:readonly number[];dy:readonly number[];hole:boolean};
const westWalls:Record<keyof typeof walls,WallSpec>={north:{...walls.north,x:-4.2,sx:[0,1],dx:[0,4.2],sy:[0,615/1024,1],dy:[0,1.7,2.8]},south:{...walls.south,x:0,sx:[0,1],dx:[0,4.2],sy:[0,615/1024,1],dy:[0,1.7,2.8],hole:false},east:{...walls.west,x:0,y:0,turn:-90,sx:[0,1-839/1708,1-469/1708,1],dx:[0,...archiveRoom.westDoor,5.2]},west:{...walls.west,x:-4.2,hole:false,sx:[0,955/1712,1334/1712,1],dx:[0,2.925,4.0625,5.2],sy:[0,125/920,466/920,540/920,1],dy:[0,.41,1.49,1.7,2.8]}};
function Wall({side,west=false}:{side:keyof typeof walls;west?:boolean}){const w=west?westWalls[side]:walls[side],mirror=west&&side==='east',id=west?(side==='west'?'wall-window':side==='east'?'wall-west':'wall-blank'):`wall-${side}`,group=west&&side!=='east'?'scenes/archive-west':'scenes/archive-east';return <Face x={w.x} y={w.y} z={2.8} width={w.width} height={2.8} turn={w.turn}>{w.dx.slice(0,-1).flatMap((x,i)=>w.dy.slice(0,-1).map((y,j)=>w.hole&&i===1&&j>=1?null:<div key={`${i}:${j}`} className="archive-wall-tile" style={{left:x*M,top:y*M,width:(w.dx[i+1]-x)*M+.15,height:(w.dy[j+1]-y)*M+.15}}><Photograph id={id} group={group} mirror={mirror} crop={[mirror?1-w.sx[i+1]:w.sx[i],w.sy[j],w.sx[i+1]-w.sx[i],w.sy[j+1]-w.sy[j]]}/></div>))}</Face>;}
function Shelving({values,index,onSelect,envelope}:{values:ShelfState;index:number;envelope?:EnvelopeArtProps;onSelect?:(index:number,keyboard:boolean)=>void}){
 const s=shelfSpecs[index],r=shelfRect(values,index);
 return <div className="archive-shelf" onClick={onSelect?e=>{e.stopPropagation();onSelect(index,false);}:undefined} style={{cursor:onSelect?'pointer':undefined,transform:`translate3d(${r.x*M}px,0,${r.y*M}px)`}}>
 <Face x={-.025} y={-.025} z={.003} width={r.width+.05} height={r.depth+.05} tilt={90}><div className="archive-contact-shadow"/></Face>
 {s.handleFace==='west'?<Face x={0} y={0} z={r.height} width={r.depth} height={r.height} turn={-90}><Photograph id={`${s.key}-front`}/></Face>:<Face x={0} y={r.depth} z={r.height} width={r.width} height={r.height}><Photograph id={s.key==='c'?'c-rear':`${s.key}-front`}/></Face>}
 {s.key==='c'&&envelope?<Face x={.225} y={.515} z={r.height+.008} width={.43} height={.28} tilt={90}><EnvelopeArt g={envelope.g}/></Face>:null}
 {s.key==='c'?<Face x={r.width} y={0} z={r.height} width={r.width} height={r.height} turn={180}><Photograph id="c-front"/></Face>:null}
 {s.key==='b'?<><Face x={r.width} y={r.depth} z={r.height} width={r.depth} height={r.height} turn={90}><Photograph id="b-back"/></Face><Face x={0} y={r.depth} z={r.height} width={r.width} height={r.height}><Photograph id="b-side"/></Face><Face x={r.width-.005} y={0} z={r.height} width={r.depth} height={r.height} turn={-90}><Photograph id="b-back" mirror/></Face></>:null}
 {s.key!=='b'?<Face x={0} y={0} z={r.height} width={r.width} height={r.depth} tilt={90}><Photograph id={`${s.key}-top`}/></Face>:null}
 {s.key==='a'||s.key==='c'||s.key==='d'?<><Face x={r.width} y={r.depth} z={r.height} width={r.depth} height={r.height} turn={90}><Photograph id={`${s.key}-side`} clip="polygon(0 0,100% 0,100% 100%,82% 100%,82% 94%,0 94%)"/></Face><Face x={0} y={0} z={r.height} width={r.depth} height={r.height} turn={-90}><Photograph id={`${s.key}-side`} mirror clip="polygon(0 0,100% 0,100% 94%,18% 94%,18% 100%,0 100%)"/></Face></>:null}
 </div>;
}
function ArchiveRepairDoor({open}:{open:boolean}){
 const e=walls.east,leaf=<Photograph id="wall-east" group="scenes/archive-east" crop={[e.sx[1],e.sy[1],e.sx[2]-e.sx[1],1-e.sy[1]]}/>;
 return <>
 {open?<Face x={4.2} y={archiveRoom.eastDoor[0]} z={2.08} width={archiveRoom.eastDoor[1]-archiveRoom.eastDoor[0]} height={2.08}>{leaf}</Face>:<Face x={4.197} y={archiveRoom.eastDoor[0]} z={2.08} width={archiveRoom.eastDoor[1]-archiveRoom.eastDoor[0]} height={2.08} turn={-90}>{leaf}</Face>}
 </>;
}
function Doors({open}:{open:boolean}){return <>
 <ArchiveRepairDoor open={open}/>
 <Face x={1.4} y={5.2} z={2.08} width={1.05} height={2.08} turn={90}><Photograph id="north" group="scenes/type" crop={[685/1672,153/941,292/1672,566/941]}/><div className="archive-door-knob" style={{left:.813*M,top:1.05*M,width:.09*M,height:.09*M}}><Photograph id="p15-keeper-base" group="closeups" crop={[459/1672,629/941,246/1672,253/941]}/></div></Face>
 <Face x={1.4} y={4.15} z={2.08} width={.035} height={2.08} turn={180}><Photograph id="north" group="scenes/type" crop={[967/1672,153/941,10/1672,566/941]}/></Face>
 <Face x={1.365} y={4.15} z={2.08} width={.035} height={1.05} tilt={90}><Photograph id="north" group="scenes/type" crop={[690/1672,155/941,280/1672,10/941]}/></Face>
 <Face x={5.6} y={8.5} z={3.37} width={7} height={7*941/1672} turn={180}><Photograph id="south" group="scenes/type"/></Face>
 <Face x={-1.4} y={5.2} z={0} width={7} height={3.3} tilt={90}><Photograph id="south" group="scenes/type" crop={[.25,.85,.65,.15]} mirror/></Face>
 <Face x={1.38} y={5.16} z={.012} width={1.09} height={.08} tilt={90}><Photograph id="wall-south" group="scenes/archive-east" crop={[620/1536,216/1024,380/1536,25/1024]}/></Face>
 </>;
}
export function ArchiveScene({values,facing,room=6,doorOpen=false,camera,selected=-1,busy=false,keyboard=false,onSelect,onMove,onInspect,onDoor,onPortal,onTrace,envelope,watermark,weighing,repair,frame={width:1672,height:941}}:{values:ShelfState;envelope?:EnvelopeArtProps;watermark?:WatermarkPresentation;weighing?:WeighingPresentation;repair?:OpticalPresentation&CradlePresentation;frame?:{width:number;height:number};facing:number;room?:6|7|8;doorOpen?:boolean;camera?:Partial<ArchiveEye>;selected?:number;busy?:boolean;keyboard?:boolean;onSelect?:(index:number,keyboard:boolean)=>void;onMove?:(index:number,position:number)=>void;onInspect?:(index:number,end:number)=>void;onDoor?:()=>void;onPortal?:(room:number)=>void;onTrace?:(index:number)=>void}){
 const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),eye=archiveEye(facing,{...archiveRoomEye(room===8?6:room,facing),...camera});
 const ep=envelopeOrigin(values),ec=envelopeScreenCentre(values,eye),paperPeer=envelope?.onInspect&&archiveRayClear(values,[ep[0]+.215,ep[1]+.14,ep[2]],2,eye)?[ec[0]*scale,ec[1]*scale] as const:null;
 useLayoutEffect(()=>{const update=()=>setScale(host.current!.clientWidth/frame.width);update();const resize=new ResizeObserver(update);resize.observe(host.current!);return()=>resize.disconnect();},[frame.width]);
 const portalPoints=[[4.2,archiveRoom.eastDoor[0],2.08],[4.2,archiveRoom.eastDoor[1],2.08],[4.2,archiveRoom.eastDoor[1],0],[4.2,archiveRoom.eastDoor[0],0]].map(p=>archiveProjectEye([p[0],p[1],p[2]],eye)),portalClip=portalPoints.every(p=>p[2]>.05)?`polygon(${portalPoints.map(p=>`${p[0]/frame.width*100}% ${p[1]/frame.height*100}%`).join(',')})`:null;
 const archiveWorld=<>
 <ArchiveFloor room={6}/><ArchiveFloor room={7}/>
 <Rails/>
 <Face x={0} y={5.2} z={2.8} width={4.2} height={5.2} tilt={-90}><Photograph id="ceiling" group="scenes/archive-east"/></Face>
 {(['north','east','south','west'] as const).map(side=><div key={side} style={{display:'contents'}}><Wall side={side}/><Wall side={side} west/></div>)}
 <Face x={-4.2} y={5.2} z={2.8} width={4.2} height={5.2} tilt={-90}><Photograph id="ceiling" group="scenes/archive-east"/></Face>
 <Doors open={doorOpen}/>
 {watermark?<WatermarkWorld g={watermark.g}/>:null}
 {weighing?<WeighingWorld g={weighing.g} eye={eye}/>:null}
 {shelfSpecs.map((_,i)=><Shelving key={i} index={i} values={values} envelope={envelope} onSelect={busy?undefined:onSelect}/>)}
 </>;
 return <div ref={host} onClick={e=>{if(!(e.target instanceof Element)||e.target.closest('button'))return;const box=host.current!.getBoundingClientRect(),x=(e.clientX-box.left)/scale,y=(e.clientY-box.top)/scale,hit=archivePickShelf(values,x,y,eye);if(hit>=0){if(!busy)onSelect?.(hit,false);return;}if(!onTrace)return;const point=archiveFloorPoint(x,y,eye);if(!point)return;const index=archiveOldPlan.findIndex((s,i)=>{if(s.room!==room)return false;const r=oldFootprint(i),x=point[0]+(room===7?4.2:0);return x>=r.x-.1&&x<=r.x+r.width+.1&&point[1]>=r.y-.1&&point[1]<=r.y+r.depth+.1;});if(index>=0)onTrace(index);}} className="archive-view" role="group" aria-label={room===6?'東書庫':room===7?'西書庫':'修復室'}>{room===8?<>
 {portalClip?<WorldCamera eye={eye} frame={frame} scale={scale} clip={portalClip}>{archiveWorld}</WorldCamera>:null}
 <WorldCamera eye={eye} frame={frame} scale={scale}>{repair?<RepairWorld g={repair.g} eye={eye}/>:null}<ArchiveRepairDoor open={doorOpen}/></WorldCamera>
 </>:<>
 {repair&&doorOpen&&portalClip?<WorldCamera eye={eye} frame={frame} scale={scale} clip={portalClip}><RepairWorld g={repair.g} eye={eye}/></WorldCamera>:null}
 <WorldCamera eye={eye} frame={frame} scale={scale}>{archiveWorld}</WorldCamera>
 </>}

 {repair?<CradleInputs {...repair} eye={eye} scale={scale}/>:null}
 {repair?<OpticalInputs {...repair} eye={eye} scale={scale}/>:null}
 {weighing?<WeighingInputs {...weighing} eye={eye} scale={scale}/>:null}
 {watermark?<WatermarkInputs {...watermark} eye={eye} scale={scale}/>:null}
 {envelope?<><EnvelopeHotspots {...envelope} eye={eye} scale={scale} values={values}/><EnvelopeControls {...envelope} eye={eye} scale={scale} values={values}/></>:null}
 {onPortal&&room!==8?<ArchivePortals room={room} facing={facing} eye={eye} scale={scale} values={values} open={doorOpen} onPortal={onPortal}/>:null}
 {onTrace?archiveOldPlan.map((s,i)=>{if(s.room!==room)return null;const r=oldFootprint(i),point:[number,number,number]=[r.x+r.width/2+(room===7?-4.2:0),r.y+r.depth/2,.01],p=archiveProjectEye(point,eye);return p[2]>.1&&p[0]>0&&p[0]<1672&&p[1]>0&&p[1]<941&&archiveRayClear(values,point,-1,eye)?<button key={s.key} className="archive-handle" style={{left:p[0]*scale-22,top:p[1]*scale-22}} aria-label="床の跡を観察する" onClick={()=>onTrace(i)}/>:null;}):null}
 {onSelect?shelfSpecs.map((_,i)=>{const h=shelfHandlePoint(values,i),p=archiveProjectEye(h,eye);return p[2]>.1&&p[0]>0&&p[0]<1672&&p[1]>0&&p[1]<941&&archiveRayClear(values,h,i,eye)?<button key={i} className="archive-handle" style={{left:p[0]*scale-22,top:p[1]*scale-22,clipPath:paperPeer?separateTarget([p[0]*scale,p[1]*scale],[paperPeer]):undefined}} aria-label={`${shelfNames[i]}を選ぶ`} disabled={busy} onClick={e=>onSelect(i,e.detail===0)}/>:null;}):null}
 {selected>=0&&onMove?<ArchiveControls values={values} index={selected} eye={eye} scale={scale} busy={busy} keyboard={keyboard} avoid={[...(paperPeer?[paperPeer]:[]),...shelfSpecs.flatMap((_,i)=>{if(i===selected)return [];const h=shelfHandlePoint(values,i),p=archiveProjectEye(h,eye);return p[2]>0&&archiveRayClear(values,h,i,eye)?[[p[0]*scale,p[1]*scale] as const]:[];})]} onMove={onMove} onInspect={onInspect}/>:null}
 {onDoor&&(()=>{const handle=archiveDoorPoint(doorOpen),p=archiveProjectEye(handle,eye);return p[2]>.1&&p[0]>0&&p[0]<1672&&p[1]>0&&p[1]<941&&archiveRayClear(values,handle,-1,eye)?<button className="archive-handle" style={{left:p[0]*scale-22,top:p[1]*scale-22}} aria-label={doorOpen?'戸を閉じる':'戸を開く'} onClick={onDoor}/>:null;})()}
 </div>;
}






