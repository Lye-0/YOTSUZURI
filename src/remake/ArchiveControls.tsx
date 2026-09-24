import {useLayoutEffect,useRef} from 'react';
import {archiveCamera,archiveProjectEye,shelfHandlePoint,shelfSpecs,shelfNames,nearestShelfFoot,type ArchiveEye,type ShelfState} from './archiveSpace';
import {Icon} from './Icons';
type ScreenPoint=readonly [number,number];
export function ArchiveControls({values,index,eye,scale,busy,keyboard,avoid=[],onMove,onInspect}:{values:ShelfState;index:number;eye:ArchiveEye;scale:number;busy:boolean;keyboard:boolean;avoid?:ScreenPoint[];onMove:(index:number,position:number)=>void;onInspect?:(index:number,end:number)=>void}){
 const minus=useRef<HTMLButtonElement>(null),plus=useRef<HTMLButtonElement>(null),lastDirection=useRef(-1),s=shelfSpecs[index],h=shelfHandlePoint(values,index),p=archiveProjectEye(h,eye),offset:typeof h=[h[0]+(s.axis==='x'?.1:0),h[1]+(s.axis==='y'?.1:0),h[2]],q=archiveProjectEye(offset,eye),dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
 const width=archiveCamera.width*scale,height=archiveCamera.heightPx*scale,gap=50,rangeX=25+Math.abs(ux)*gap,rangeY=25+Math.abs(uy)*gap,angle=Math.atan2(uy,ux)*180/Math.PI;
 const obstacles=[{x:0,y:height/2-38,w:70,h:76},{x:width-70,y:height/2-38,w:70,h:76},{x:width-124,y:0,w:124,h:49},...avoid.map(([x,y])=>({x:x-25,y:y-25,w:50,h:50}))];
 const candidates=[0,50,-50,100,-100,150,-150].flatMap(ox=>[0,50,-50,100,-100].map(oy=>{
  const x=Math.max(rangeX,Math.min(width-rangeX,p[0]*scale+ox)),y=Math.max(rangeY,Math.min(height-rangeY,p[1]*scale+oy));
  const collisions=[-1,0,1].reduce((n,d)=>n+obstacles.filter(o=>x+ux*gap*d+23>o.x&&x+ux*gap*d-23<o.x+o.w&&y+uy*gap*d+23>o.y&&y+uy*gap*d-23<o.y+o.h).length,0);
  return {x,y,score:collisions*1e6+Math.hypot(x-p[0]*scale,y-p[1]*scale)};
 }));const {x:cx,y:cy}=candidates.reduce((best,p)=>p.score<best.score?p:best);
 useLayoutEffect(()=>{if(keyboard&&!busy){const target=lastDirection.current>0&&values[index]<s.stops.length-1||values[index]===0?plus.current:minus.current;target?.focus({preventScroll:true});}},[index,keyboard,busy]);
 return <div className="archive-object-controls" onClick={e=>e.stopPropagation()}>
 <button ref={minus} style={{left:cx-ux*gap-21,top:cy-uy*gap-21}} aria-label={`${shelfNames[index]}を${s.axis==='x'?'西':'北'}へ動かす`} disabled={busy||values[index]===0} onClick={()=>{lastDirection.current=-1;onMove(index,values[index]-1);}}><span style={{transform:`rotate(${angle+180}deg)`}}><Icon name="right"/></span></button>
 {onInspect?<button style={{left:cx-21,top:cy-21}} aria-label={`${shelfNames[index]}の脚元を見る`} disabled={busy} onClick={()=>onInspect(index,nearestShelfFoot(values,index))}><Icon name="inspect"/></button>:null}
 <button ref={plus} style={{left:cx+ux*gap-21,top:cy+uy*gap-21}} aria-label={`${shelfNames[index]}を${s.axis==='x'?'東':'南'}へ動かす`} disabled={busy||values[index]===s.stops.length-1} onClick={()=>{lastDirection.current=1;onMove(index,values[index]+1);}}><span style={{transform:`rotate(${angle}deg)`}}><Icon name="right"/></span></button>
 </div>;
}
