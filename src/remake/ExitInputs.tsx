import {separateTarget} from './screenTargets';
import type {World,Action} from './campaign';
import {archiveProjectEye,type ArchiveEye,type ShelfPoint} from './archiveSpace';
import {exitKeyhole,exitPull,exitLocalPoint} from './exitGeometry';
import {loadingExit} from './loadingSpace';
import {paperOnExit} from './exitReference';
import {Icon} from './Icons';
export function ExitInputs({g,act,eye,scale,close,onInspect,onClose}:{g:World;act:(a:Action)=>void;eye:ArchiveEye;scale:number;close:boolean;onInspect:()=>void;onClose:()=>void}){if(g.facing!==3||g.focus!=='room')return null;const open=!!g.flags.exitOpen,point=(p:ShelfPoint)=>{const q=archiveProjectEye(p,eye);return[q[0]*scale,q[1]*scale,q[2]] as const},lock=point(exitKeyhole(open)),pull=point(exitPull(open)),key=point(exitLocalPoint([-.82,.135,.94],open)),width=eye.centerX*2*scale,height=eye.centerY*2*scale;
 const hit=(label:string,p:readonly number[],run:()=>void,size=44,clip?:string)=>p[2]>.05?<button className="env-screen-hit" aria-label={label} style={{left:p[0]-size/2,top:p[1]-size/2,width:size,height:size,zIndex:3,clipPath:clip}} onClick={run}/>:null;
 const command=(label:string,offset:number,icon:'eye'|'right'|'bag',run:()=>void)=><button className="watermark-command" aria-label={label} style={{left:width/2+offset-22,top:height-120}} onClick={run}><Icon name={icon}/></button>;
 if(!close){const ps=([[loadingExit.x,loadingExit.end,2.1],exitLocalPoint([-(loadingExit.end-loadingExit.start),.04,2.1],true),exitLocalPoint([-(loadingExit.end-loadingExit.start),.04,0],true),[loadingExit.x,loadingExit.end,0]] as ShelfPoint[]).map(point),left=Math.min(...ps.map(p=>p[0])),top=Math.min(...ps.map(p=>p[1])),w=Math.max(...ps.map(p=>p[0]))-left,h=Math.max(...ps.map(p=>p[1]))-top;return <>
 {open?<button className="env-screen-hit" aria-label="外へ出る" style={{left,top,width:w,height:h,clipPath:`polygon(${ps.map(p=>`${(p[0]-left)/w*100}% ${(p[1]-top)/h*100}%`).join(',')})`}} onClick={()=>act({type:'finish'})}/>:hit('裏口の金具を調べる',lock,onInspect,60)}
 {open?hit('裏口の戸を閉じる',pull,()=>act({type:'exit-close'}),44,separateTarget([pull[0],pull[1]],[[left+w/2,top+h/2]])):null}
 </>;}
 return <>
 {paperOnExit(g)?<>{command('扉に当てた保護紙を裏返す',-58,'eye',()=>act({type:'p-rubbing-view',flip:true}))}{command('扉に当てた保護紙を回す',0,'right',()=>act({type:'p-rubbing-view'}))}{command('扉から保護紙を取り戻す',58,'bag',()=>act({type:'exit-paper-take'}))}</>:g.flags.exitKey?<>{hit('差した鍵を回す',key,()=>act({type:'exit-turn'}),60)}{command('差した鍵を抜く',0,'bag',()=>act({type:'exit-remove'}))}</>:hit(g.selected==='tissue'?'扉の金具に保護紙を重ねる':'裏口の鍵穴',lock,()=>act({type:g.selected==='tissue'?'exit-paper-place':'exit-insert'}),60)}
 {hit('裏口の取っ手を回す',pull,()=>{act({type:'exit-open'});if(g.flags.exitUnlocked)onClose()},50)}
 </>;}
