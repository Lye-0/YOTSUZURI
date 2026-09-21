import {useRef,useState,useLayoutEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import type {ArchiveDetail} from './ArchiveRoom';
import {archiveEye,archiveProjectEye,type ShelfPoint} from './archiveSpace';
import {WorldCamera} from './WorldCamera';
import {VaultShell} from './VaultShell';
import {RepairWorld} from './RepairWorld';
import {BlankStudyWorld} from './BlankStudyWorld';
import {BlankStudyScene} from './BlankStudyScene';
import {studyPoint} from './studyGeometry';
import {boxInFront} from './worldVisibility';
export function VaultRoom({g,act,enabled,detail,onDetail}:{g:World;act:(a:Action)=>void;enabled:boolean;detail:ArchiveDetail;onDetail:(d:ArchiveDetail)=>void}){
 const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),frame={width:1672,height:941},eye=archiveEye(g.facing,{x:6.3,y:-2.6,height:1.65,pitch:14,focal:650});
 useLayoutEffect(()=>{if(!host.current)return;const update=()=>setScale(host.current!.clientWidth/frame.width);update();const r=new ResizeObserver(update);r.observe(host.current);return()=>r.disconnect()},[g.focus]);
 if(g.focus==='object:23')return <BlankStudyScene g={g} act={enabled?act:undefined} index={detail?.kind==='study-leaf'?detail.index:undefined} onInspect={index=>onDetail({kind:'study-leaf',index})}/>;
 const ps=(points:readonly ShelfPoint[])=>points.map(p=>archiveProjectEye(p,eye));
 const poly=(points:readonly ShelfPoint[]):CSSProperties=>{const a=ps(points),x=Math.min(...a.map(p=>p[0])),y=Math.min(...a.map(p=>p[1])),w=Math.max(...a.map(p=>p[0]))-x,h=Math.max(...a.map(p=>p[1]))-y;return{left:x*scale,top:y*scale,width:w*scale,height:h*scale,clipPath:`polygon(${a.map(p=>`${(p[0]-x)/w*100}% ${(p[1]-y)/h*100}%`).join(',')})`};};
 const portal:readonly ShelfPoint[]=[[5.85,0,2.05],[6.77,0,2.05],[6.77,0,0],[5.85,0,0]],projected=ps(portal),clip=projected.every(p=>p[2]>.05)?`polygon(${projected.map(p=>`${p[0]/frame.width*100}% ${p[1]/frame.height*100}%`).join(',')})`:undefined;
 return <div className="archive-view" ref={host} role="group" aria-label="原型庫">
 {clip?<WorldCamera {...{eye,frame,scale,clip}}><RepairWorld g={g} eye={eye} pixelScale={scale}/></WorldCamera>:null}
 <WorldCamera {...{eye,frame,scale}}><VaultShell eye={eye}/>{boxInFront(eye,[4.32,-3.8,0],[4.97,-2.15,.86])?<BlankStudyWorld g={g}/>:null}</WorldCamera>
 {enabled&&g.facing===3?<button className="env-screen-hit" aria-label="原型庫の紙標本を調べる" style={poly([[.03,.008,.84],[1.61,.008,.84],[1.61,.63,.84],[.03,.63,.84]].map(p=>studyPoint([p[0],p[1],p[2]])))} onClick={()=>{onDetail(null);act({type:'focus',focus:'object:23'})}}/>:null}
 {enabled&&g.facing===2&&clip?<button className="env-screen-hit" aria-label="修復室へ戻る" style={poly(portal)} onClick={()=>act({type:'go',room:8})}/>:null}
 </div>;
}
