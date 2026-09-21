import type {CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import {gatheringValues,gatheringsTaken} from './gatherings';
import {watermarkTable,candidatePlaces,gatheringPlaces,inspectionPlace} from './watermarkGeometry';
import {Icon} from './Icons';
export type WatermarkPresentation={g:World;onAct?:(a:Action)=>void;onInspect?:()=>void;onZoom?:()=>void;detail?:boolean};
type Rect=readonly [number,number,number,number];
export function WatermarkInputs({g,onAct,onInspect,onZoom,detail=false,eye,scale}:{eye:ArchiveEye;scale:number}&WatermarkPresentation){
 if(!onAct&&!onInspect)return null;const t=watermarkTable,v=gatheringValues(g),taken=gatheringsTaken(g),selected=v.slice(1),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const rect=(r:Rect,z=.846,min=0):CSSProperties|null=>{const [x,y,w,h]=r,p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([x,y])=>archiveProjectEye([t.x+x,t.y+y,z],eye));if(p.some(a=>a[2]<=0))return null;const l=Math.min(...p.map(a=>a[0])),u=Math.min(...p.map(a=>a[1])),rw=Math.max(...p.map(a=>a[0]))-l,rh=Math.max(...p.map(a=>a[1]))-u;if(l+rw<0||u+rh<0||l>width/scale||u>height/scale)return null;return {left:(l+rw/2)*scale-Math.max(min,rw*scale)/2,top:(u+rh/2)*scale-Math.max(min,rh*scale)/2,width:Math.max(min,rw*scale),height:Math.max(min,rh*scale)};};
 const hit=(label:string,r:Rect,action:()=>void,z=.846,min=0)=>{const css=rect(r,z,min);return css?<button className="env-screen-hit" key={label} aria-label={label} style={css} onClick={e=>{e.stopPropagation();action();}}/>:null;};
 if(onInspect)return hit('透かしの作業台を調べる',[0,0,t.width,t.depth],onInspect,t.z,44);
 if(!onAct)return null;
 return <div className="envelope-hit-layer">
 {!detail?<>
 {candidatePlaces.map(([x,y],index)=>selected.includes(index)?null:hit(`${index+1}組目の紙を透かす`,[x,y,.15,.20],()=>{onAct({type:'p-gathering-probe',id:17,index});onZoom?.();},.85,44))}
 {v[0]>=0?hit('光に載せた紙を近くで見る',[inspectionPlace[0],inspectionPlace[1],.15,.20],()=>onZoom?.(),.864,44):null}
 {taken?hit('紙束を整理布へ戻す',[-.035,.355,.84,.255],()=>onAct({type:'p-gathering-return',id:17}),.825,44):gatheringPlaces.map(([x,y],slot)=>hit(selected[slot]<0?`${slot+1}番目の布へ紙を置く`:v[0]>=0?`${slot+1}番目の布の紙と入れ替える`:`${slot+1}番目の布の紙を調べる`,[x-.025,y-.015,.20,.23],()=>selected[slot]<0?onAct({type:'p-gathering-place',id:17,slot}):v[0]>=0?onAct({type:'p-gathering-place',id:17,slot}):(()=>{onAct({type:'p-gathering-probe',id:17,index:selected[slot]});onZoom?.();})(),.85,44))}
 {!taken&&selected.every(n=>n>=0)?<button className="watermark-command" aria-label="六折をまとめて取る" style={(()=>{const p=archiveProjectEye([t.x+.39,t.y+.62,.824],eye);return {left:p[0]*scale-22,top:p[1]*scale-22};})()} onClick={()=>onAct({type:'p-gathering-take',id:17})}><Icon name="bag"/></button>:null}
 </>:v[0]>=0?<>
 <button className="watermark-command" aria-label="透かしている紙を裏返す" style={{left:width*.59-22,top:height-82}} onClick={()=>onAct({type:'p-gathering-turn',id:17,mode:'flip'})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 9h16v18H8zM5 7A12 12 0 0 1 27 7m-6-1l6 1 1-5"/></svg></button>
 <button className="watermark-command" aria-label="透かしている紙の上下を返す" style={{left:width*.79-22,top:height-82}} onClick={()=>onAct({type:'p-gathering-turn',id:17,mode:'rotate'})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 13A11 11 0 0 1 27 13m-6-1l6 1 1-6M26 20A11 11 0 0 1 5 20m6 1l-6-1-1 6"/><path d="M13 10h6v12h-6z"/></svg></button>
 </>:null}
 </div>;
}

