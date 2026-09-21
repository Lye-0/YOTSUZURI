import {separateTarget} from './screenTargets';
import type {Action,World} from './campaign';
import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import {repairPanels,panelUncovered,secretDoor,secretOpening} from './repairNorth';
import {panelKnobPoint,panelCoverPoint} from './repairNorthGeometry';
export type RepairNorthPresentation={g:World;onAct?:(a:Action)=>void;panelIndex?:number;onInspectPanel?:(index:number)=>void;onVault?:()=>void};
export function RepairNorthInputs({g,onAct,panelIndex,onInspectPanel,onVault,eye,scale}:RepairNorthPresentation&{eye:ArchiveEye;scale:number}){
 if(g.facing!==0||g.room!==8)return null;
 const rect=(x:number,y:number,w:number,h:number)=>{const ps=[[x,y,h],[x+w,y,h],[x+w,y,0],[x,y,0]].map(p=>archiveProjectEye([p[0],p[1],p[2]],eye));if(ps.some(p=>p[2]<=0))return null;const l=Math.min(...ps.map(p=>p[0])),t=Math.min(...ps.map(p=>p[1])),r=Math.max(...ps.map(p=>p[0])),b=Math.max(...ps.map(p=>p[1]));return{left:l*scale,top:t*scale,width:(r-l)*scale,height:(b-t)*scale,clipPath:`polygon(${ps.map(p=>`${(p[0]-l)/(r-l)*100}% ${(p[1]-t)/(b-t)*100}%`).join(',')})`};};
 if(panelIndex===undefined)return <>{repairPanels.map((panel,index)=>{if(index===1&&g.flags.secret){const box=rect(secretOpening.x,0,secretOpening.width,secretOpening.height);const knob=archiveProjectEye(panelKnobPoint(1,true),eye);return <div key={index} style={{display:'contents'}}>{box&&onVault?<button className="archive-portal" aria-label="原型庫へ進む" style={{position:'absolute',...box}} onClick={onVault}/>:null}{onAct&&knob[2]>0?<button className="env-screen-hit" aria-label="開いた戸の取っ手を回す" style={{left:knob[0]*scale-22,top:knob[1]*scale-22,width:44,height:44,zIndex:2,clipPath:box?separateTarget([knob[0]*scale,knob[1]*scale],[[box.left+box.width/2,box.top+box.height/2]]):undefined}} onClick={()=>onAct({type:'repair-panel-door',index:1})}/>:null}</div>;}const box=rect(panel.x,.04,1,2.1);return box&&onInspectPanel?<button key={index} className="env-screen-hit" aria-label={`${['左','中央','右'][index]}の木板を調べる`} style={box} onClick={()=>onInspectPanel(index)}/>:null;})}</>;
 if(!onAct)return null;const uncovered=panelUncovered(g,panelIndex),cover=archiveProjectEye(panelCoverPoint(panelIndex,uncovered),eye),knob=archiveProjectEye(panelKnobPoint(panelIndex,panelIndex===1&&!!g.flags.secret),eye);
 return <>
 <button className="env-screen-hit" aria-label={uncovered?'外した覆いを戻す':'取っ手の覆いを外す'} style={{left:cover[0]*scale-22,top:cover[1]*scale-(uncovered?35:60),width:44,height:uncovered?70:120}} onClick={()=>onAct({type:'repair-trim',index:panelIndex})}/>
 {uncovered?<button className="env-screen-hit" aria-label="木板の取っ手を回す" style={{left:knob[0]*scale-22,top:knob[1]*scale-22,width:44,height:44}} onClick={()=>onAct({type:'repair-panel-door',index:panelIndex})}/>:null}
 </>;
}
