import {useState,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye,type ShelfPoint} from './archiveSpace';
import {cradleWorld} from './cradleGeometry';
import {cradleTaken,cradleBoardAngle,cradleValues,cradleWedgeVertices,cradleWedgeLift,cradleCornerHeight,CRADLE_THICKNESS as H} from './cradle';
import {Icon} from './Icons';
export type CradlePresentation={g:World;onAct?:(a:Action)=>void;onInspectCradle?:()=>void;cradleSide?:boolean;onCradleSide?:(side:boolean)=>void};
export function CradleInputs({g,onAct,onInspectCradle,cradleSide=false,onCradleSide,eye,scale}:CradlePresentation&{eye:ArchiveEye;scale:number}){
 const [selected,setSelected]=useState<'corner'|'wedge'|null>(null),v=cradleValues(g),parts=g.placed[21]??[],angle=cradleBoardAngle(g)*Math.PI/180,taken=cradleTaken(g),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const p=(point:ShelfPoint)=>{const a=archiveProjectEye(cradleWorld(point),eye);return [a[0]*scale,a[1]*scale,a[2]] as const;};
 const polygon=(points:readonly ShelfPoint[]):CSSProperties=>{const ps=points.map(p),x=Math.min(...ps.map(p=>p[0])),y=Math.min(...ps.map(p=>p[1])),w=Math.max(...ps.map(p=>p[0]))-x,h=Math.max(...ps.map(p=>p[1]))-y;return {left:x,top:y,width:w,height:h,clipPath:`polygon(${ps.map(p=>`${(p[0]-x)/w*100}% ${(p[1]-y)/h*100}%`).join(',')})`};};
 const command=(name:string,point:ShelfPoint,icon:'inspect'|'bag'|'back',action:()=>void)=>{const q=p(point);return <button key={name} className="watermark-command" aria-label={name} style={{left:Math.max(5,Math.min(width-49,q[0]-22)),top:Math.max(5,Math.min(height-85,q[1]-22))}} onClick={action}><Icon name={icon}/></button>;};
 if(onInspectCradle)return <button className="env-screen-hit" aria-label="二枚板の台を調べる" style={polygon([[0,0,.30],[.32,0,.30],[.32,.28,0],[0,.28,0]])} onClick={onInspectCradle}/>;
 if(!onAct||g.focus!=='object:21')return null;
 if(taken)return <button className="env-screen-hit" aria-label="支持具を作業台へ戻す" style={polygon([[0,0,.01],[.32,0,.01],[.32,.28,.01],[0,.28,.01]])} onClick={()=>onAct({type:'p-cradle-return',id:21})}/>;
 const raised=angle>=Math.PI/4,material=g.selected==='corner'||g.selected==='wedge';
 const top=(u:number,w:number):ShelfPoint=>[u,w*Math.cos(angle)-H*Math.sin(angle),H+w*Math.sin(angle)+H*Math.cos(angle)];
 return <div className="envelope-hit-layer">
 <button className="env-screen-hit" aria-label="上の板を起こす・下ろす" style={polygon([top(0,0),top(.32,0),top(.32,.28),top(0,.28)])} onClick={()=>{setSelected(null);onAct({type:'p-cradle-board',id:21});}}/>
 {raised&&material?<button className="env-screen-hit" aria-label="選んだ部品を板の内側へ置く" style={polygon([[0,.01,H],[.32,.01,H],[.32,.28,H],[0,.28,H]])} onClick={()=>{setSelected(null);onAct({type:'p-place',id:21});}}/>:null}
 {raised&&!material&&parts.includes('corner')?(()=>{const a=-v[1]*Math.PI/2,ca=Math.cos(a),sa=Math.sin(a),z=H+cradleCornerHeight(g),points=[[-.078,-.078],[-.045,-.078],[-.045,.045],[.078,.045],[.078,.078],[-.078,.078]].map(([x,y])=>[.16+x*ca+y*sa,.085-x*sa+y*ca,z] as ShelfPoint);return <button className="env-screen-hit" aria-label="角当てを選ぶ" style={polygon(points)} onClick={()=>setSelected('corner')}/>;})():null}
 {raised&&!material&&parts.includes('wedge')?<button className="env-screen-hit" aria-label="斜面の木片を選ぶ" style={polygon(cradleWedgeVertices(v).map(([x,y,z])=>[x,y,H+z+cradleWedgeLift(g)]))} onClick={()=>setSelected('wedge')}/>:null}
 {raised&&!material&&selected&&parts.includes(selected)?<>
 <button className="watermark-command" aria-label="選んだ部品を回す" style={{left:width*.5-22,top:height-130}} onClick={()=>onAct({type:'p-cradle-turn',id:21,item:selected})}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 13A11 11 0 1 1 7 24M6 13l-1-8m1 8 8-1"/></svg></button>
 <button className="watermark-command" aria-label="選んだ部品を手元へ戻す" style={{left:width*.5+36,top:height-130}} onClick={()=>{onAct({type:'p-retrieve',id:21,item:selected});setSelected(null);}}><Icon name="bag"/></button>
 {selected==='wedge'?<><button className="watermark-command" aria-label="木片を左へ寄せる" disabled={v[3]===0} style={{left:width*.5-138,top:height-130}} onClick={()=>onAct({type:'p-cradle-slide',id:21,position:v[3]-1})}><Icon name="left"/></button><button className="watermark-command" aria-label="木片を右へ寄せる" disabled={v[3]===2} style={{left:width*.5-80,top:height-130}} onClick={()=>onAct({type:'p-cradle-slide',id:21,position:v[3]+1})}><Icon name="right"/></button></>:null}
 </>:null}
 {!raised?command('板の間を横から見る',[.36,.18,.055],'inspect',()=>onCradleSide?.(!cradleSide)):null}
 {!v[0]?command('支持具を持ち上げる',[.16,.32,.02],'bag',()=>{setSelected(null);onAct({type:'p-cradle-take',id:21});}):null}
 </div>;
}
