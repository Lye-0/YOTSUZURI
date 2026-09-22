import {useLayoutEffect,useRef,useState,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {VaultShell} from './VaultShell';
import {RubbingWorld} from './RubbingWorld';
import {rubbingEye,rubbingPoint,tissueRect,type RubbingView} from './rubbingGeometry';
import {archiveProjectEye} from './archiveSpace';
import {tissueOnMould} from './rubbing';
import {Icon} from './Icons';
export function RubbingScene({g,act,view='all',onView}:{g:World;act?:(a:Action)=>void;view?:RubbingView;onView:(v:RubbingView)=>void}){
 const dragging=useRef(false),lastZone=useRef(-1),host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[tool,setTool]=useState<'charcoal'|'eraser'|null>(null),eye=rubbingEye(view),frame={width:1000,height:900},width=1000*scale,height=900*scale,onBench=g.placed[25]?.includes('tissue'),paper=tissueRect(g),onMould=tissueOnMould(g);
 useLayoutEffect(()=>{const update=()=>setScale(host.current!.clientWidth/1000);update();const r=new ResizeObserver(update);r.observe(host.current!);return()=>r.disconnect()},[]);
 const rect=(x:number,y:number,w:number,h:number,z=.831):CSSProperties=>{const ps=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(p=>archiveProjectEye(rubbingPoint([p[0],p[1],p[2]]),eye)),xs=ps.map(p=>p[0]*scale),ys=ps.map(p=>p[1]*scale),left=Math.min(...xs),top=Math.min(...ys),width=Math.max(...xs)-left,height=Math.max(...ys)-top;return{left,top,width,height,clipPath:`polygon(${xs.map((x,i)=>`${(x-left)/width*100}% ${(ys[i]-top)/height*100}%`).join(',')})`};};
 const command=(label:string,offset:number,icon:'eye'|'back'|'bag'|'right',run:()=>void)=><button className="watermark-command" aria-label={label} style={{left:width*.5+offset-22,top:view==='mould'?height*.60:height-95}} onClick={run}><Icon name={icon}/></button>;
 return <div ref={host} className="archive-view" role="group" aria-label="原型と保護紙"><WorldCamera {...{eye,frame,scale}}><VaultShell eye={eye}/><RubbingWorld g={g}/></WorldCamera>{act?<div className="envelope-hit-layer">
 {view==='all'?<><button className="env-screen-hit" aria-label="原型へ近づく" style={rect(.27,.20,.18,.16)} onClick={()=>onView('mould')}/>{onBench&&!onMould?<button className="env-screen-hit" aria-label="脇へ置いた保護紙を見る" style={rect(paper.x,paper.y,paper.width,paper.depth)} onClick={()=>onView('paper')}/>:null}</>:null}
 {view==='mould'?<>
 {!onBench?<button className="env-screen-hit" aria-label="原型へ保護紙を当てる" style={rect(.285,.2225,.15,.095)} onClick={()=>act({type:'p-place',id:25,target:'tissue'})}/>:null}
 {[['charcoal',.28,.405,.06,.02],['eraser',.40,.40,.04,.03]].map(([name,x,y,w,h])=><button key={name} className="env-screen-hit" aria-label={name==='charcoal'?'黒鉛を選ぶ':'練り消しを選ぶ'} aria-pressed={tool===name} style={{...rect(+x,+y,+w,+h),outline:tool===name?'1px solid #bfae87':undefined}} onClick={()=>setTool(tool===name?null:name as 'charcoal'|'eraser')}/>)}
 {!onMould?<>{command('原型を裏返す',-29,'eye',()=>act({type:'p-mould-turn',id:25,flip:true}))}{command('原型の向きを返す',29,'right',()=>act({type:'p-mould-turn',id:25}))}</>:null}
 {onMould?Array.from({length:6},(_,zone)=><button key={zone} className="env-screen-hit" aria-label={`保護紙の${zone+1}区画を擦る`} data-rub-zone={zone} style={{...rect(paper.x+zone%3*paper.width/3,paper.y+Math.floor(zone/3)*paper.depth/2,paper.width/3,paper.depth/2,paper.z),touchAction:'none'}} onPointerDown={e=>{if(!tool)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);dragging.current=true;lastZone.current=zone;act(tool==='charcoal'?{type:'p-rubbing-zone',id:25,zone}:{type:'p-rubbing-erase',id:25});}} onPointerMove={e=>{if(!dragging.current||tool!=='charcoal')return;const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-rub-zone]');if(!hit)return;const next=Number(hit.dataset.rubZone);if(next!==lastZone.current){lastZone.current=next;act({type:'p-rubbing-zone',id:25,zone:next});}}} onPointerUp={()=>{dragging.current=false}} onLostPointerCapture={()=>{dragging.current=false}} onClick={e=>{if(e.detail!==0)return;if(tool==='charcoal')act({type:'p-rubbing-zone',id:25,zone});else if(tool==='eraser')act({type:'p-rubbing-erase',id:25});}}/>):null}
 </>:null}
 {view==='paper'&&onBench?<>{command('保護紙を裏返す',-87,'eye',()=>act({type:'p-rubbing-view',flip:true}))}{command('保護紙を回す',-29,'right',()=>act({type:'p-rubbing-view'}))}</>:null}
 {onBench&&(view==='paper'&&g.flags['rubbing:inspection']||view==='mould'&&onMould)?<>{command(onMould?'保護紙を脇へ移す':'保護紙を原型へ戻す',view==='paper'?29:-29,'back',()=>{act({type:'p-rubbing-move',id:25});onView(onMould?'paper':'mould');})}{command('保護紙を持ち帰る',view==='paper'?87:29,'bag',()=>{act({type:'p-retrieve',id:25,item:'tissue'});onView('all');setTool(null)})}</>:null}
 </div>:null}</div>;
}
