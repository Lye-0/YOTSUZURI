import {useState,useRef,useLayoutEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {VaultShell} from './VaultShell';
import {JoineryWorld} from './JoineryWorld';
import {joineryValues,frameTaken,frameRails,joineryReady} from './joinery';
import {joineryEye,joineryPoint,railCorners,railCentres,frameOrigin} from './joineryGeometry';
import {archiveProjectEye,type ShelfPoint} from './archiveSpace';
import {Icon} from './Icons';
import {separateTarget} from './screenTargets';
export function JoineryScene({g,act,index,onInspect}:{g:World;act?:(a:Action)=>void;index?:number;onInspect:(i:number)=>void}){
 const [selected,setSelected]=useState<number|null>(null),host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),v=joineryValues(g),eye=joineryEye(index,v),frame={width:1000,height:900},taken=frameTaken(g);
 useLayoutEffect(()=>{const update=()=>setScale(host.current!.clientWidth/1000);update();const r=new ResizeObserver(update);r.observe(host.current!);return()=>r.disconnect()},[]);
 const project=(p:ShelfPoint)=>{const q=archiveProjectEye(joineryPoint(p),eye);return[q[0]*scale,q[1]*scale] as const;};
 const poly=(points:readonly ShelfPoint[]):CSSProperties=>{const ps=points.map(project),x=Math.min(...ps.map(p=>p[0])),y=Math.min(...ps.map(p=>p[1])),w=Math.max(...ps.map(p=>p[0]))-x,h=Math.max(...ps.map(p=>p[1]))-y;return{left:x,top:y,width:w,height:h,clipPath:`polygon(${ps.map(p=>`${(p[0]-x)/w*100}% ${(p[1]-y)/h*100}%`).join(',')})`};};
 const centres=frameRails.map((_,i)=>{const ps=railCorners(v,i).map(project);return[ps.reduce((s,p)=>s+p[0],0)/4,ps.reduce((s,p)=>s+p[1],0)/4] as const;});
 return <div ref={host} className="archive-view" role="group" aria-label="四片の継ぎ枠"><WorldCamera {...{eye,frame,scale}}><VaultShell eye={eye}/><JoineryWorld g={g}/></WorldCamera>{act?<div className="envelope-hit-layer">
 {!taken?frameRails.map((_,i)=>{if(index!==undefined&&index!==i)return null;const p=centres[i];return <button key={i} className="env-screen-hit" aria-label={`木片${i+1}を調べる`} style={{left:p[0]-22,top:p[1]-22,width:44,height:44,clipPath:separateTarget(p,centres.filter((_,j)=>j!==i)),outline:selected===i?'1px solid #c9b98b':undefined}} onClick={()=>{setSelected(i);onInspect(i)}}/>}):null}
 {!taken&&selected!==null?<>
 {index===undefined?railCentres.map(([x,y],slot)=>{if(v.slice(0,4).some((n,i)=>i!==selected&&n===slot))return null;const w=slot%2?.055:.30,h=slot%2?.24:.055;return <button key={slot} className="env-screen-hit" aria-label={`木片を${['奥','右','手前','左'][slot]}の溝へ置く`} style={poly([[frameOrigin.x+x-w/2,frameOrigin.y+y-h/2,.85],[frameOrigin.x+x+w/2,frameOrigin.y+y-h/2,.85],[frameOrigin.x+x+w/2,frameOrigin.y+y+h/2,.85],[frameOrigin.x+x-w/2,frameOrigin.y+y+h/2,.85]])} onClick={()=>{const a:Action={type:'p-frame-place',id:24,piece:selected,slot};act(a)}}/>}):null}
 </>:null}
 {taken&&index===undefined?<button className="env-screen-hit" aria-label="綴じ枠を作業台へ戻す" style={poly([[.6,.15,.84],[.96,.15,.84],[.96,.45,.84],[.6,.45,.84]])} onClick={()=>act({type:'p-frame-return',id:24})}/>:null}
 {!taken&&(selected!==null||joineryReady(g))?<div className="joinery-actions">{selected!==null?<><button aria-label="木片を回す" onClick={()=>act({type:'p-frame-turn',id:24,piece:selected})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 13A11 11 0 1 1 7 24M6 13l-1-8m1 8 8-1"/></svg><span>90度回す</span></button><button aria-label="木片を裏返す" onClick={()=>act({type:'p-frame-turn',id:24,piece:selected,flip:true})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 3v26M5 9l8-4v22l-8-4ZM20 5l7 4v14l-7 4"/></svg><span>裏返す</span></button>{v[selected]>=0?<button aria-label="木片を台へ外す" onClick={()=>act({type:'p-frame-remove',id:24,piece:selected})}><Icon name="back"/><span>枠から外す</span></button>:null}</>:null}{joineryReady(g)&&index===undefined?<button aria-label="組み上がった枠を持ち上げる" onClick={()=>{setSelected(null);act({type:'p-frame-take',id:24})}}><Icon name="bag"/><span>枠を取る</span></button>:null}</div>:null}
 {!g.collected.includes('returnrecord')&&index===undefined?<button className="env-screen-hit" aria-label="壁の返却記録を取る" style={poly([[.65,.002,1.30],[.93,.002,1.30],[.93,.002,1.10] ,[.65,.002,1.10]])} onClick={()=>act({type:'p-take',id:24,item:'returnrecord'})}/>:null}
 </div>:null}</div>;
}
