import {useRef,type CSSProperties} from 'react';
import type {EnvelopeArtProps} from './EnvelopeArt';
import {envelopeOrigin} from './envelopeGeometry';
import {envelopeValues,initialEnvelope} from './envelope';
import {archiveProjectEye,archiveRayClear,type ArchiveEye,type ShelfState} from './archiveSpace';
type Rect=readonly [number,number,number,number];
export function EnvelopeHotspots({g,onAct,onInspect,onInspectContents,contents=false,eye,scale,values}:{eye:ArchiveEye;scale:number;values:ShelfState}&EnvelopeArtProps){
 const drag=useRef<number|null>(null);if(!onAct&&!onInspect)return null;
 const v=g?envelopeValues(g):initialEnvelope(),[ox,oy,oz]=envelopeOrigin(values),W=.43,H=.28,extension=v[3]*.1;
 const style=(rect:Rect,expand=false):CSSProperties|null=>{const [x,y,w,h]=rect,points=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(([x,y])=>archiveProjectEye([ox+x,oy+y,oz],eye));if(points.some(p=>p[2]<=0))return null;const left=Math.min(...points.map(p=>p[0])),top=Math.min(...points.map(p=>p[1])),width=Math.max(...points.map(p=>p[0]))-left,height=Math.max(...points.map(p=>p[1]))-top;if(left+width<0||top+height<0||left>eye.centerX*2||top>eye.centerY*2)return null;
  return expand?{left:(left+width/2)*scale-Math.max(44,width*scale)/2,top:(top+height/2)*scale-22,width:Math.max(44,width*scale),height:44}:{left:left*scale,top:top*scale,width:width*scale,height:height*scale,clipPath:`polygon(${points.map(p=>`${(p[0]-left)/width*100}% ${(p[1]-top)/height*100}%`).join(',')})`};};
 const hit=(label:string,rect:Rect,action:()=>void,expand=false)=>{const css=style(rect,expand);return css?<button key={label} className="env-screen-hit" aria-label={label} style={css} onClick={e=>{e.stopPropagation();action();}}/>:null;};
 if(onInspect){const target=[ox+W/2,oy+H/2,oz] as const;return archiveRayClear(values,target,2,eye)?hit('封筒を調べる',[0,0,W,H],onInspect,true):null;}
 if(!onAct||v[0])return null;
 const flap=(index:number)=>onAct(index===1&&!(v[2]&2)&&g?.selected==='knife'?{type:'p-envelope-loosen',id:18}:{type:'p-envelope-flap',id:18,index});
 const bodyStyle=style([-extension-.016,.105,.04,.07],true);
 return <div className="envelope-hit-layer">
 {!contents?<>
 {hit(v[2]&1?'右の折り返しを畳む':'右の折り返しを開く',v[2]&1?[W,0,.13,H]:[W*.7,0,W*.3,H],()=>flap(0))}
 {hit(v[2]&2?'下の折り返しを畳む':'下の折り返しを開く',v[2]&2?[0,H,W,.14]:[0,H*.53,W*(v[2]&1?1:.7),H*.47],()=>flap(1))}
 {hit(v[2]&4?'上の折り返しを畳む':'上の折り返しを開く',v[2]&4?[0,-.28,W,.28]:[0,0,W*(v[2]&1?1:.7),H*(v[2]&2?1:.53)],()=>flap(2))}
 {v[2]===7&&bodyStyle?<div className="env-screen-drag" style={bodyStyle} onPointerDown={e=>{drag.current=e.clientX;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerCancel={()=>{drag.current=null;}} onPointerUp={e=>{if(drag.current===null)return;const delta=e.clientX-drag.current;drag.current=null;if(Math.abs(delta)>14)onAct({type:'p-envelope-slide',id:18,direction:delta<0?-1:1});}}/>:null}
 </>:null}
 {v[2]===7&&extension>0?[{id:'tissue' as const,rect:[-extension+.025,.016,.15,.095] as Rect},{id:'blanks' as const,rect:[-extension+.035,.13,.13,.135] as Rect}].filter(item=>!g?.collected.includes(item.id)).map(item=>{const [x,y,w,h]=item.rect;return hit(contents?(item.id==='tissue'?'薄い保護紙を取る':'白紙の束を取る'):(item.id==='tissue'?'内袋の薄紙を近くで見る':'内袋の白紙を近くで見る'),[x,y,Math.min(w,-x),h],()=>contents?onAct({type:'p-take',id:18,item:item.id}):onInspectContents?.());}):null}
 </div>;
}
