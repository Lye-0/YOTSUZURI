import {useState,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import {studyPoint,studyHinge,blankPosition} from './studyGeometry';
import {studySpecimens,studyOpen,studyUnderOpen,blankStudyValues} from './blankStudy';
import {Icon} from './Icons';
export function BlankStudyInputs({g,act,eye,scale,index,onInspect}:{g:World;act:(a:Action)=>void;eye:ArchiveEye;scale:number;index?:number;onInspect:(i:number)=>void}){
 const [packet,setPacket]=useState<number|null>(null),has=g.placed[23]?.includes('blanks'),v=blankStudyValues(g),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const rect=(x:number,y:number,w:number,h:number,z=.83):CSSProperties=>{const ps=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(p=>archiveProjectEye(studyPoint([p[0],p[1],p[2]]),eye)),xs=ps.map(p=>p[0]*scale),ys=ps.map(p=>p[1]*scale),left=Math.min(...xs),top=Math.min(...ys),width=Math.max(...xs)-left,height=Math.max(...ys)-top;return{left,top,width,height,clipPath:`polygon(${xs.map((x,i)=>`${(x-left)/width*100}% ${(ys[i]-top)/height*100}%`).join(',')})`};};
 const hit=(label:string,x:number,y:number,w:number,h:number,fn:()=>void,selected=false)=><button key={label} className="env-screen-hit" aria-label={label} aria-pressed={selected||undefined} style={{...rect(x,y,w,h),outline:selected?'1px solid #c4b68f':undefined}} onClick={fn}/>;
 if(index!==undefined){const s=studySpecimens[index],open=studyOpen(g,index),under=studyUnderOpen(g,index),x=studyHinge(index);return <div className="envelope-hit-layer">
 {hit(open?'主葉を閉じる':'主葉を開く',open?x:x-.10,.03,.10,.15,()=>act({type:'p-study-open',id:23,index}))}
 {open&&s.extension?hit(under?'折り返しを戻す':'内側の折り返しを広げる',under?x-.10:x-s.base,.03,s.extension,.15,()=>act({type:'p-study-open',id:23,index,under:true})):null}
 </div>;}
 return <div className="envelope-hit-layer">
 {studySpecimens.map((_,i)=>hit(`標本${i+1}を調べる`,studyHinge(i)-.10,.015,.21,.19,()=>{setPacket(null);onInspect(i)}))}
 {!has?hit('白紙の束を作業台へ置く',.18,.24,1.3,.36,()=>act({type:'p-place',id:23,target:'blanks'})):null}
 {has?v.map((slot,i)=>{const [x,y]=blankPosition(slot,i);return hit(`白紙${i+1}を選ぶ`,x,y,.20,.15,()=>setPacket(packet===i?null:i),packet===i)}):null}
 {has&&packet!==null?studySpecimens.map((_,i)=>v[1-packet]===i?null:hit(`白紙を標本${i+1}の前へ置く`,studyHinge(i)-.105,.24,.21,.165,()=>{act({type:'p-blank-mark',id:23,packet,slot:i});setPacket(null)})):null}
 {has&&packet!==null?<button className="watermark-command" aria-label="選んだ白紙を手前へ戻す" style={{left:width*.5-80,top:height-125}} onClick={()=>{act({type:'p-blank-mark',id:23,packet,slot:-1});setPacket(null)}}><Icon name="back"/></button>:null}
 {has?<button className="watermark-command" aria-label="白紙二枚をまとめて持ち帰る" style={{left:width*.5+36,top:height-125}} onClick={()=>{act({type:'p-retrieve',id:23,item:'blanks'});setPacket(null)}}><Icon name="bag"/></button>:null}
 </div>;
}
