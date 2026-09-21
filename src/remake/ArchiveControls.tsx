import {useLayoutEffect,useRef} from 'react';
import {archiveCamera,archiveProjectEye,shelfHandlePoint,shelfSpecs,shelfNames,nearestShelfFoot,type ArchiveEye,type ShelfState} from './archiveSpace';
import {Icon} from './Icons';
export function ArchiveControls({values,index,eye,scale,busy,keyboard,onMove,onInspect}:{values:ShelfState;index:number;eye:ArchiveEye;scale:number;busy:boolean;keyboard:boolean;onMove:(index:number,position:number)=>void;onInspect?:(index:number,end:number)=>void}){
 const minus=useRef<HTMLButtonElement>(null),plus=useRef<HTMLButtonElement>(null),s=shelfSpecs[index],h=shelfHandlePoint(values,index),p=archiveProjectEye(h,eye),offset:typeof h=[h[0]+(s.axis==='x'?.1:0),h[1]+(s.axis==='y'?.1:0),h[2]],q=archiveProjectEye(offset,eye),dx=q[0]-p[0],dy=q[1]-p[1],length=Math.hypot(dx,dy)||1,ux=dx/length,uy=dy/length;
 const width=archiveCamera.width*scale,height=archiveCamera.heightPx*scale,gap=50,margin=25,rangeX=margin+Math.abs(ux)*gap,rangeY=margin+Math.abs(uy)*gap,cx=Math.max(rangeX,Math.min(width-rangeX,p[0]*scale)),cy=Math.max(rangeY,Math.min(height-rangeY,p[1]*scale)),angle=Math.atan2(uy,ux)*180/Math.PI;
 useLayoutEffect(()=>{if(keyboard){const target=values[index]===0?plus.current:minus.current;target?.focus({preventScroll:true});}},[index,keyboard]);
 return <div className="archive-object-controls" onClick={e=>e.stopPropagation()}>
 <button ref={minus} style={{left:cx-ux*gap-21,top:cy-uy*gap-21}} aria-label={`${shelfNames[index]}を${s.axis==='x'?'西':'北'}へ動かす`} disabled={busy||values[index]===0} onClick={()=>onMove(index,values[index]-1)}><span style={{transform:`rotate(${angle+180}deg)`}}><Icon name="right"/></span></button>
 {onInspect?<button style={{left:cx-21,top:cy-21}} aria-label={`${shelfNames[index]}の脚元を見る`} disabled={busy} onClick={()=>onInspect(index,nearestShelfFoot(values,index))}><Icon name="inspect"/></button>:null}
 <button ref={plus} style={{left:cx+ux*gap-21,top:cy+uy*gap-21}} aria-label={`${shelfNames[index]}を${s.axis==='x'?'東':'南'}へ動かす`} disabled={busy||values[index]===s.stops.length-1} onClick={()=>onMove(index,values[index]+1)}><span style={{transform:`rotate(${angle}deg)`}}><Icon name="right"/></span></button>
 </div>;
}

