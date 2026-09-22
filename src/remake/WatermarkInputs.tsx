import type {CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import {gatheringValues,gatheringsTaken} from './gatherings';
import {watermarkTable,candidatePlaces,gatheringPlaces,inspectionPlace} from './watermarkGeometry';
import {Icon} from './Icons';
import {gatheringPairs} from './gatherings';
import {BUNDLE_THICKNESS} from './book';
export type WatermarkPresentation={g:World;onAct?:(a:Action)=>void;onInspect?:()=>void;onZoom?:()=>void;onTable?:()=>void;detail?:boolean};
type Rect=readonly [number,number,number,number];
export function WatermarkInputs({g,onAct,onInspect,onZoom,onTable,detail=false,eye,scale}:{eye:ArchiveEye;scale:number}&WatermarkPresentation){
 if(!onAct&&!onInspect)return null;const t=watermarkTable,v=gatheringValues(g),taken=gatheringsTaken(g),selected=v.slice(1),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const rect=(r:Rect,z=.846,min=0):CSSProperties|null=>{const [x,y,w,h]=r,p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([x,y])=>archiveProjectEye([t.x+x,t.y+y,z],eye));if(p.some(a=>a[2]<=0))return null;const l=Math.min(...p.map(a=>a[0])),u=Math.min(...p.map(a=>a[1])),rw=Math.max(...p.map(a=>a[0]))-l,rh=Math.max(...p.map(a=>a[1]))-u;if(l+rw<0||u+rh<0||l>width/scale||u>height/scale)return null;return {left:(l+rw/2)*scale-Math.max(min,rw*scale)/2,top:(u+rh/2)*scale-Math.max(min,rh*scale)/2,width:Math.max(min,rw*scale),height:Math.max(min,rh*scale)};};
 const hit=(label:string,r:Rect,action:()=>void,z=.846,min=0)=>{const css=rect(r,z,min);if(css&&min===0){const [x,y,w,h]=r;const points=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([px,py])=>archiveProjectEye([t.x+px,t.y+py,z],eye));css.clipPath=`polygon(${points.map(p=>`${(p[0]*scale-Number(css.left))/Number(css.width)*100}% ${(p[1]*scale-Number(css.top))/Number(css.height)*100}%`).join(',')})`;}return css?<button className="env-screen-hit watermark-hit" key={label} aria-label={label} style={css} onClick={e=>{e.stopPropagation();action();}}>{css.clipPath?<svg className="watermark-hit-outline" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points={String(css.clipPath).slice(8,-1).replaceAll('%','')}/></svg>:null}</button>:null;};
 if(onInspect)return hit('透かしの作業台を調べる',[0,0,t.width,t.depth],onInspect,t.z,44);
 if(!onAct)return null;
 return <div className="envelope-hit-layer">
 {!detail?<>
 {candidatePlaces.map(([x,y],index)=>selected.includes(index)||v[0]===index?null:hit(`${index+1}組目の紙を透かす`,[x,y,.15,.20],()=>onAct({type:'p-gathering-probe',id:17,index}),.824+gatheringPairs[index].reduce<number>((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*.006,0))}
 {v[0]>=0?hit('光に載せた紙を近くで見る',[inspectionPlace[0],inspectionPlace[1],.15,.20],()=>onZoom?.(),.864,0):null}
 {taken?hit('紙束を整理布へ戻す',[-.035,.355,.84,.255],()=>onAct({type:'p-gathering-return',id:17}),.825,44):gatheringPlaces.map(([x,y],slot)=>selected[slot]<0&&v[0]<0?null:hit(selected[slot]<0?`${slot+1}番目の布へ紙を置く`:v[0]>=0?`${slot+1}番目の布の紙と入れ替える`:`${slot+1}番目の布の紙を調べる`,[x,y,.15,.20],()=>selected[slot]<0?onAct({type:'p-gathering-place',id:17,slot}):v[0]>=0?onAct({type:'p-gathering-place',id:17,slot}):(()=>{onAct({type:'p-gathering-probe',id:17,index:selected[slot]});})(),selected[slot]>=0?.824+gatheringPairs[selected[slot]].reduce<number>((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*.006:.824,0))}
 {!taken&&selected.every(n=>n>=0)?<button className="watermark-command" aria-label="六折をまとめて取る" style={(()=>{const p=archiveProjectEye([t.x+.39,t.y+.62,.824],eye);return {left:p[0]*scale-22,top:p[1]*scale-22};})()} onClick={()=>onAct({type:'p-gathering-take',id:17})}><Icon name="bag"/></button>:null}
 </>:null}
 {v[0]>=0?<div className="watermark-actions"><span role="status">{v[0]+1}組目を比較中</span><div><button onClick={()=>onAct({type:'p-gathering-turn',id:17,mode:'flip'})}>裏返す</button><button onClick={()=>onAct({type:'p-gathering-turn',id:17,mode:'rotate'})}>上下を反転</button>{!detail?<button onClick={()=>onZoom?.()}>比較を拡大</button>:null}{!taken&&selected.some(n=>n<0)?<button onClick={()=>{onAct({type:'p-gathering-place',id:17,slot:selected.findIndex(n=>n<0)});onTable?.();}}>布へ置く</button>:null}</div></div>:null}
 </div>;
}
