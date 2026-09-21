import {useRef,useState,type PointerEvent} from 'react';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye,type ShelfPoint} from './archiveSpace';
import {mirrorRows,mirrorStops,opticsValues} from './optics';
import {opticalPosition} from './OpticalWorld';
import {repairSouthPoint,type OpticalView} from './repairSpace';
import {Icon} from './Icons';
export type OpticalPresentation={g:World;onAct?:(a:Action)=>void;onInspectOptics?:()=>void;view?:OpticalView;onView?:(view:OpticalView)=>void};
export function OpticalInputs({g,onAct,onInspectOptics,view='all',onView,eye,scale}:OpticalPresentation&{eye:ArchiveEye;scale:number}){
 const [selected,setSelected]=useState<number|null>(null),suppressClick=useRef(false),drag=useRef<{id:number;index:number;x:number;y:number;value:number;dx:number;dy:number}|null>(null),v=opticsValues(g),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const screen=(p:ShelfPoint)=>{const a=archiveProjectEye(repairSouthPoint(p),eye);return [a[0]*scale,a[1]*scale,a[2]] as const;};
 const centre=(index:number,position=v[index])=>{const p=opticalPosition([mirrorStops[position],mirrorRows[index]]);return screen([p[0],p[1],.866]);};
 if(!onAct&&!onInspectOptics)return null;
 if(onInspectOptics){const ps=[[.05,.03,.91],[1.53,.03,.91],[1.53,.68,.91],[.05,.68,.91]].map(p=>screen([p[0],p[1],p[2]]));if(ps.some(p=>p[2]<=0))return null;const left=Math.min(...ps.map(p=>p[0])),top=Math.min(...ps.map(p=>p[1])),right=Math.max(...ps.map(p=>p[0])),bottom=Math.max(...ps.map(p=>p[1]));return <button className="env-screen-hit" aria-label="反射片と留め棒を調べる" style={{left,top,width:right-left,height:bottom-top}} onClick={onInspectOptics}/>;}
 if(!onAct)return null;
 if(view==='all')return <div className="envelope-hit-layer">{([['反射片を近くで見る',[.43,.35,.92],'light'],['受光部と留め棒を近くで見る',[1.12,.247,.97],'catch']] as const).map(([name,point,next])=>{const p=screen(point);return <button key={name} className="watermark-command" style={{left:p[0]-22,top:p[1]-22}} aria-label={name} onClick={()=>{setSelected(null);onView?.(next);}}><Icon name="inspect"/></button>;})}</div>;
 const move=(e:PointerEvent<HTMLButtonElement>)=>{const s=drag.current;if(!s||s.id!==e.pointerId)return;const delta=((e.clientX-s.x)*s.dx+(e.clientY-s.y)*s.dy)/(s.dx*s.dx+s.dy*s.dy)*3;onAct({type:'p-mirror-slide',id:20,index:s.index,position:Math.max(0,Math.min(3,Math.round(s.value+delta)))});};
 const guard=screen(g.flags['optics:guard']?[1.12,.247,1.17]:[1.38,.247,.91]);
 return <div className="envelope-hit-layer" onPointerDownCapture={()=>{suppressClick.current=false;}} onClickCapture={e=>{if(suppressClick.current&&e.detail!==0){e.preventDefault();e.stopPropagation();}}}>
 {view==='light'?[0,1].map(index=>{const p=centre(index);return <button key={index} className={'env-screen-hit env-screen-drag'+(selected===index?' weighing-selected':'')} aria-label={`${index===0?'手前':'奥'}の反射片を選ぶ`} aria-pressed={selected===index} style={{left:p[0]-22,top:p[1]-22,width:44,height:44}} onPointerDown={e=>{suppressClick.current=true;e.preventDefault();setSelected(index);const a=centre(index,0),b=centre(index,3);drag.current={id:e.pointerId,index,x:e.clientX,y:e.clientY,value:v[index],dx:b[0]-a[0],dy:b[1]-a[1]};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={move} onPointerUp={e=>{move(e);drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(index);}}}/>;}):null}
 {view==='light'&&selected!==null?(()=>{const p=centre(selected),cy=Math.max(30,selected===0&&p[1]+54<=height-82?p[1]+54:p[1]-54),cx=Math.max(78,Math.min(width-78,p[0]));return <>
 <button className="watermark-command" style={{left:cx-72,top:cy-22}} aria-label="反射片を左へ動かす" disabled={v[selected]===0} onClick={()=>onAct({type:'p-mirror-slide',id:20,index:selected,position:v[selected]-1})}><Icon name="left"/></button>
 <button className="watermark-command" style={{left:cx+28,top:cy-22}} aria-label="反射片を右へ動かす" disabled={v[selected]===3} onClick={()=>onAct({type:'p-mirror-slide',id:20,index:selected,position:v[selected]+1})}><Icon name="right"/></button>
 <button className="watermark-command" style={{left:cx-22,top:cy-22}} aria-label="反射片の向きを変える" onClick={()=>onAct({type:'p-mirror-turn',id:20,index:selected})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 20l16-8M6 13A11 11 0 0 1 26 10m-5-1l5 1 1-5M26 19A11 11 0 0 1 6 22m5 1l-5-1-1 5"/></svg></button>
 </>;})():null}
 {view==='catch'?<button className="env-screen-hit" aria-label={g.flags['optics:guard']?'留め棒を閉じる':'留め棒を持ち上げる'} style={{left:guard[0]-22,top:guard[1]-22,width:44,height:44}} onClick={()=>{setSelected(null);onAct({type:'p-optical-guard',id:20});}}/>:null}
 </div>;
}
