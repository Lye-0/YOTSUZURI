import type {World,Action} from './campaign';
import {archiveValues} from './archive';
import {archiveProjectEye,archivePassable,archiveDoorBackPoint,archiveRoom,shelfRect,type ArchiveEye} from './archiveSpace';
export type RepairTravelPresentation={g:World;onAct?:(a:Action)=>void;onArchive?:()=>void};
export function RepairPortals({g,onAct,onArchive,eye,scale}:RepairTravelPresentation&{eye:ArchiveEye;scale:number}){
 if(!onArchive||g.room!==8||g.facing!==3||g.focus!=='room')return null;
 const values=archiveValues(g),open=!!g.flags['archive:door'],handle=archiveProjectEye(archiveDoorBackPoint(open),eye),start=Math.max(archiveRoom.eastDoor[0],shelfRect(values,1).y+shelfRect(values,1).depth),ps=[[4.22,start,2.08],[4.22,archiveRoom.eastDoor[1],2.08],[4.22,archiveRoom.eastDoor[1],0],[4.22,start,0]].map(p=>archiveProjectEye([p[0],p[1],p[2]],eye));
 const x=Math.min(...ps.map(p=>p[0])),y=Math.min(...ps.map(p=>p[1])),w=Math.max(...ps.map(p=>p[0]))-x,h=Math.max(...ps.map(p=>p[1]))-y;
 return <>{open&&archivePassable(values)?<button className="archive-portal" aria-label="東書庫へ戻る" style={{position:'absolute',left:x*scale,top:y*scale,width:w*scale,height:h*scale,clipPath:`polygon(${ps.map(p=>`${(p[0]-x)/w*100}% ${(p[1]-y)/h*100}%`).join(',')})`}} onClick={onArchive}/>:null}{onAct&&handle[2]>0?<button className="archive-handle" aria-label={open?'書庫の戸を閉じる':'書庫の戸を開く'} style={{left:handle[0]*scale-22,top:handle[1]*scale-22,zIndex:3}} onClick={()=>onAct({type:'archive-door'})}/>:null}</>;
}
