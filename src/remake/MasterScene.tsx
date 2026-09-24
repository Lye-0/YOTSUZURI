import {useRef,useState,useLayoutEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {LoadingWorld} from './LoadingWorld';
import {masterEye,masterPoint,masterCentres} from './masterGeometry';
import {masterPaperIndex} from './masters';
import {archiveProjectEye} from './archiveSpace';
export function MasterScene({g,act,index,onInspect}:{g:World;act?:(a:Action)=>void;index?:number;onInspect:(i:number)=>void}){const host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),eye=masterEye(index),frame={width:1000,height:index===undefined?900:1100},active=masterPaperIndex(g),width=1000*scale,height=frame.height*scale;useLayoutEffect(()=>{const fit=()=>setScale(host.current!.clientWidth/1000);fit();const r=new ResizeObserver(fit);r.observe(host.current!);return()=>r.disconnect()},[]);
 const rect=(x:number,y:number,w:number,h:number):CSSProperties=>{const ps=[[x,y,.84],[x+w,y,.84],[x+w,y+h,.84],[x,y+h,.84]].map(p=>archiveProjectEye(masterPoint([p[0],p[1],p[2]]),eye)),xs=ps.map(p=>p[0]*scale),ys=ps.map(p=>p[1]*scale),left=Math.min(...xs),top=Math.min(...ys),ww=Math.max(...xs)-left,hh=Math.max(...ys)-top;return{left,top,width:ww,height:hh,clipPath:`polygon(${xs.map((x,i)=>`${(x-left)/ww*100}% ${(ys[i]-top)/hh*100}%`).join(',')})`};};
 return <div className="archive-view" ref={host} role="group" aria-label="二つの原型"><WorldCamera eye={eye} frame={frame} scale={scale}><LoadingWorld g={g} eye={eye} pixelScale={scale}/></WorldCamera>{act?<div className="envelope-hit-layer">
 {index===undefined?masterCentres.map((c,i)=><button key={i} className="env-screen-hit" aria-label={`${i+1}枚目の原型を調べる`} style={rect(c-.14,.04,.28,.42)} onClick={()=>onInspect(i)}/>):<>
 {active!==index?<button className="env-screen-hit" aria-label={active<0?'原型に写しを重ねる':'写しをこちらの原型へ移す'} style={rect(masterCentres[index]-.075,.305,.15,.12)} onClick={()=>act({type:'p-master-paper',id:29,index})}/>:<>
 <div className="master-paper-actions"><button aria-label="原型の写しを裏返す" onClick={()=>act({type:'p-rubbing-view',flip:true})}><span>写しを裏返す</span></button>
 <button aria-label="原型の写しを回す" onClick={()=>act({type:'p-rubbing-view'})}><span>写しを90度回す</span></button>
 <button aria-label="原型から写しを取り戻す" onClick={()=>act({type:'p-retrieve',id:29,item:'tissue'})}><span>写しを持ち帰る</span></button></div>
 </>}
 </>}
 </div>:null}</div>}
