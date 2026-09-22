import {useRef,useState,useEffect,type PointerEvent} from 'react';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import {gatheringValues,gatheringsTaken,gatheringPairs,gatheringPose} from './gatherings';
import {watermarkTable,candidatePlaces,gatheringPlaces,inspectionPlace} from './watermarkGeometry';
import {Icon} from './Icons';
import {FoldedPaper} from './FoldedPaper';
import {BUNDLE_THICKNESS} from './book';
export type WatermarkPresentation={g:World;onAct?:(a:Action)=>void;onInspect?:()=>void;onZoom?:()=>void;onTable?:()=>void;detail?:boolean};
type Rect=readonly [number,number,number,number];
type Destination='light'|'home'|0|1|2;
type Box={left:number;top:number;width:number;height:number;clipPath:string};
export function WatermarkInputs({g,onAct,onInspect,onZoom,detail=false,eye,scale}:{eye:ArchiveEye;scale:number}&WatermarkPresentation){
 const host=useRef<HTMLDivElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),[chosen,setChosen]=useState<number|null>(null),[flight,setFlight]=useState<{index:number;x:number;y:number;w:number;h:number;settling:boolean}|null>(null),track=useRef<{index:number;x:number;y:number;box:Box;wasChosen:boolean}|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 useEffect(()=>{setChosen(null);setFlight(null);track.current=null},[detail,g.focus]);
 if(!onAct&&!onInspect)return null;
 const t=watermarkTable,v=gatheringValues(g),taken=gatheringsTaken(g),slots=v.slice(1),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const rect=(r:Rect,z=.846):Box|null=>{const [x,y,w,h]=r,p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([x,y])=>archiveProjectEye([t.x+x,t.y+y,z],eye));if(p.some(a=>a[2]<=0))return null;const l=Math.min(...p.map(a=>a[0]))*scale,u=Math.min(...p.map(a=>a[1]))*scale,rw=Math.max(...p.map(a=>a[0]))*scale-l,rh=Math.max(...p.map(a=>a[1]))*scale-u;if(l+rw<0||u+rh<0||l>width||u>height)return null;return {left:l,top:u,width:rw,height:rh,clipPath:`polygon(${p.map(a=>`${(a[0]*scale-l)/rw*100}% ${(a[1]*scale-u)/rh*100}%`).join(',')})`};};
 const boxAt=(p:readonly [number,number],z=.85)=>rect([p[0],p[1],.15,.2],z)!;
 const paperBox=(i:number)=>v[0]===i?boxAt(inspectionPlace,.864):boxAt(slots.includes(i)?gatheringPlaces[slots.indexOf(i)]:candidatePlaces[i],.824+gatheringPairs[i].reduce<number>((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*.006);
 const outline=(box:Box)=><svg className="watermark-hit-outline" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points={box.clipPath.slice(8,-1).replaceAll('%','')}/></svg>;
 const hit=(label:string,box:Box|null,action:()=>void,extra='')=>box?<button className={'env-screen-hit watermark-hit '+extra} aria-label={label} style={box} onClick={e=>{e.stopPropagation();action()}}>{outline(box)}</button>:null;
 if(onInspect)return hit('透かしの作業台を調べる',rect([0,0,t.width,t.depth],t.z),onInspect);
 if(!onAct)return null;
 const targets=(i:number):{destination:Destination;box:Box;label:string}[]=>[
 ...(v[0]<0?[{destination:'light' as const,box:boxAt(inspectionPlace,.864),label:'選んだ紙を光の台へ置く'}]:[]),
 ...(!taken?gatheringPlaces.flatMap((p,slot)=>slots[slot]<0?[{destination:slot as 0|1|2,box:boxAt(p,.824),label:`選んだ紙を${slot+1}番目の布へ置く`}]:[]):[]),
 ...(v.includes(i)?[{destination:'home' as const,box:boxAt(candidatePlaces[i]),label:'選んだ紙を元の場所へ戻す'}]:[])
 ];
 const move=(i:number,d:Destination,to:Box)=>{if(flight?.settling)return;if(g.reducedMotion){onAct({type:'p-gathering-move',id:17,index:i,destination:d});setChosen(null);setFlight(null);return;}const from=flight??(()=>{const b=paperBox(i);return{x:b.left,y:b.top,w:b.width,h:b.height}})();setFlight({index:i,...from,settling:false});requestAnimationFrame(()=>setFlight({index:i,x:to.left,y:to.top,w:to.width,h:to.height,settling:true}));timer.current=setTimeout(()=>{onAct({type:'p-gathering-move',id:17,index:i,destination:d});setChosen(null);setFlight(null);timer.current=null},g.reducedMotion?0:260);};
 const point=(e:PointerEvent)=>{const b=host.current!.getBoundingClientRect();return{x:e.clientX-b.left,y:e.clientY-b.top}};
 return <div ref={host} className="envelope-hit-layer watermark-direct">
 {!detail?<>
 {[0,1,2,3,4].filter(i=>!(taken&&slots.includes(i))).map(i=>{const b=paperBox(i);if(!b)return null;return <button key={i} className={'env-screen-hit watermark-hit watermark-paper'+(chosen===i?' watermark-chosen':'')} aria-label={`${i+1}組目の紙を選ぶ・動かす`} style={b} disabled={!!flight?.settling} onPointerDown={e=>{e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);track.current={index:i,...point(e),box:b,wasChosen:chosen===i};setChosen(i)}} onPointerMove={e=>{const d=track.current;if(!d||d.index!==i)return;const p=point(e);if(Math.hypot(p.x-d.x,p.y-d.y)>7)setFlight({index:i,x:d.box.left+p.x-d.x,y:d.box.top+p.y-d.y,w:b.width,h:b.height,settling:false})}} onPointerUp={e=>{const d=track.current;if(!d)return;track.current=null;const p=point(e);if(Math.hypot(p.x-d.x,p.y-d.y)<7){setFlight(null);if(v[0]===i&&d.wasChosen){setChosen(null);onZoom?.()}return;}const dest=targets(i).find(t=>p.x>=t.box.left&&p.x<=t.box.left+t.box.width&&p.y>=t.box.top&&p.y<=t.box.top+t.box.height);if(dest)move(i,dest.destination,dest.box);else setFlight(null)}} onPointerCancel={()=>{track.current=null;setFlight(null)}} onClick={e=>{e.stopPropagation();if(e.detail===0){if(v[0]===i&&chosen===i)onZoom?.();else setChosen(i)}}}>{outline(b)}{chosen===i&&v[0]===i?<span className="watermark-inspect-cue"><Icon name="inspect"/></span>:null}</button>})}
 {chosen!==null&&!flight?.settling?targets(chosen).map(t=><span key={t.label}>{hit(t.label,t.box,()=>move(chosen,t.destination,t.box),'watermark-destination')}</span>):null}
 {taken?hit('紙束を整理布へ戻す',rect([-.035,.355,.84,.255],.825),()=>onAct({type:'p-gathering-return',id:17})):null}
 {!taken&&slots.every(n=>n>=0)?<button className="watermark-command" aria-label="六折をまとめて取る" style={(()=>{const p=archiveProjectEye([t.x+.39,t.y+.62,.824],eye);return {left:p[0]*scale-22,top:p[1]*scale-22}})()} onClick={()=>onAct({type:'p-gathering-take',id:17})}><Icon name="bag"/></button>:null}
 {flight?<div className={'watermark-drag'+(flight.settling?' settling':'')} data-index={flight.index} style={{left:flight.x,top:flight.y,width:flight.w,height:flight.h}}><FoldedPaper index={flight.index} {...gatheringPose(g,flight.index)} illuminated={v[0]===flight.index}/></div>:null}
 </>:v[0]>=0?<div className="watermark-actions"><div><button onClick={()=>onAct({type:'p-gathering-turn',id:17,mode:'flip'})}>裏返す</button><button onClick={()=>onAct({type:'p-gathering-turn',id:17,mode:'rotate'})}>上下を反転</button></div></div>:null}
 </div>;
}
