import {useLayoutEffect,useRef,useState,useEffect,type CSSProperties} from 'react';
import type {World,Action} from './campaign';
import {WorldCamera} from './WorldCamera';
import {VaultShell} from './VaultShell';
import {RubbingWorld} from './RubbingWorld';
import {rubbingEye,rubbingPoint,tissueRect,type RubbingView} from './rubbingGeometry';
import {archiveProjectEye} from './archiveSpace';
import {tissueTrace,tissueOnMould} from './rubbing';
import {betweenQuads,project,type Quad} from './projective';
export function RubbingScene({g,act,view='all',onView}:{g:World;act?:(a:Action)=>void;view?:RubbingView;onView:(v:RubbingView)=>void}){
 const [busy,setBusy]=useState(false),timer=useRef<ReturnType<typeof setTimeout>|null>(null);useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 const dragging=useRef(false),lastZone=useRef(-1),host=useRef<HTMLDivElement>(null),[scale,setScale]=useState(1),[tool,setTool]=useState<'charcoal'|'eraser'|null>(null),eye=rubbingEye(view),frame={width:1000,height:900},onBench=g.placed[25]?.includes('tissue'),paper=tissueRect(g),onMould=tissueOnMould(g);
 useLayoutEffect(()=>{const update=()=>setScale(host.current!.clientWidth/1000);update();const r=new ResizeObserver(update);r.observe(host.current!);return()=>r.disconnect()},[]);
 const rect=(x:number,y:number,w:number,h:number,z=.831):CSSProperties=>{const ps=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(p=>archiveProjectEye(rubbingPoint([p[0],p[1],p[2]]),eye)),xs=ps.map(p=>p[0]*scale),ys=ps.map(p=>p[1]*scale),left=Math.min(...xs),top=Math.min(...ys),width=Math.max(...xs)-left,height=Math.max(...ys)-top;return{left,top,width,height,clipPath:`polygon(${xs.map((x,i)=>`${(x-left)/width*100}% ${(ys[i]-top)/height*100}%`).join(',')})`};};
 const command=(label:string,run:()=>void)=><button disabled={busy} onClick={run}>{label}</button>;
 const shiftPaper=()=>{setTool(null);setBusy(true);act?.({type:'p-rubbing-move',id:25});timer.current=setTimeout(()=>{setBusy(false);timer.current=null},g.reducedMotion?0:480)};
 const paperPoints=[[paper.x,paper.y],[paper.x+paper.width,paper.y],[paper.x+paper.width,paper.y+paper.depth],[paper.x,paper.y+paper.depth]].map(([x,y])=>{const p=archiveProjectEye(rubbingPoint([x,y,paper.z]),eye);return [p[0]*scale,p[1]*scale] as const;}) as unknown as Quad;
 const inverse=betweenQuads(paperPoints,[[0,0],[1,0],[1,1],[0,1]]);
 const rubAt=(x:number,y:number)=>{if(!act||!tool||busy)return;const b=host.current!.getBoundingClientRect(),[u,v]=project([x-b.left,y-b.top],inverse);if(u<0||u>1||v<0||v>1)return;const zone=Math.min(2,Math.floor(u*3))+Math.min(1,Math.floor(v*2))*3;if(zone!==lastZone.current){lastZone.current=zone;act(tool==='charcoal'?{type:'p-rubbing-zone',id:25,zone}:{type:'p-rubbing-erase',id:25});}};

 return <div ref={host} className="archive-view" role="group" aria-label="原型と保護紙"><WorldCamera {...{eye,frame,scale}}><VaultShell eye={eye}/><RubbingWorld g={g}/></WorldCamera>{act?<div className="envelope-hit-layer">
 {view==='all'?<><button className="env-screen-hit" aria-label="原型へ近づく" style={rect(.27,.20,.18,.16)} onClick={()=>onView('mould')}/>{onBench&&!onMould?<button className="env-screen-hit" aria-label="脇へ置いた保護紙を見る" style={rect(paper.x,paper.y,paper.width,paper.depth)} onClick={()=>onView('paper')}/>:null}</>:null}
 {view!=='all'?<>
 {!onBench?<button className="env-screen-hit" aria-label="原型へ保護紙を当てる" style={rect(.285,.2225,.15,.095)} onClick={()=>act({type:'p-place',id:25,target:'tissue'})}/>:null}
 {[['charcoal',.28,.405,.06,.02],['eraser',.40,.40,.04,.03]].map(([name,x,y,w,h])=><button key={name} className="env-screen-hit" aria-label={name==='charcoal'?'黒鉛を選ぶ':'練り消しを選ぶ'} aria-pressed={tool===name} style={{...rect(+x,+y,+w,+h),outline:tool===name?'1px solid #bfae87':undefined}} onClick={()=>setTool(tool===name?null:name as 'charcoal'|'eraser')}/>)}
 {onMould?<button className="env-screen-hit rubbing-surface" aria-label="保護紙を擦る" disabled={busy} style={{...rect(paper.x,paper.y,paper.width,paper.depth,paper.z),touchAction:'none'}} onPointerDown={e=>{if(!tool)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);dragging.current=true;lastZone.current=-1;rubAt(e.clientX,e.clientY)}} onPointerMove={e=>{if(dragging.current)rubAt(e.clientX,e.clientY)}} onPointerUp={()=>{dragging.current=false}} onPointerCancel={()=>{dragging.current=false}} onLostPointerCapture={()=>{dragging.current=false}} onClick={e=>{if(e.detail===0&&tool){const zone=[0,1,2,3,4,5].find(i=>!(tissueTrace(g)[2]&(1<<i)));if(tool==='eraser')act({type:'p-rubbing-erase',id:25});else if(zone!==undefined)act({type:'p-rubbing-zone',id:25,zone});}}}/>:null}
 {!onMould&&view==='paper'?<button className="env-screen-hit" aria-label="原型を調べる" style={rect(.30,.23,.12,.08,.829)} onClick={()=>onView('mould')}/>:null}
 {onBench&&!onMould?<button className="env-screen-hit" aria-label={tool==='eraser'?'保護紙の写しを消す':'脇の保護紙を調べる'} style={rect(paper.x,paper.y,paper.width,paper.depth,paper.z)} onClick={()=>tool==='eraser'?act({type:'p-rubbing-erase',id:25}):onView('paper')}/>:null}

 </>:null}
 {view!=='all'?<div className="rubbing-actions">{tool?<small role="status">{tool==='charcoal'?'黒鉛':'練り消し'}を使用中</small>:null}<div>
 {view==='mould'&&!onMould?<>{command('型を裏返す',()=>act({type:'p-mould-turn',id:25,flip:true}))}{command('型を180度回す',()=>act({type:'p-mould-turn',id:25}))}</>:null}
 {view==='paper'&&onBench&&!onMould?<>{command('紙を裏返す',()=>act({type:'p-rubbing-view',flip:true}))}{command('紙を90度回す',()=>act({type:'p-rubbing-view'}))}</>:null}
 {onBench?<>{command(onMould?'紙を脇へ置く':'紙を型へ戻す',shiftPaper)}{command('紙を持ち帰る',()=>{act({type:'p-retrieve',id:25,item:'tissue'});setTool(null);onView('mould')} )}</>:null}
 </div></div>:null}
 </div>:null}</div>;
}
