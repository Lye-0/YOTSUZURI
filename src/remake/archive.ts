import type {World} from './campaign';
import {archiveDoorPoint,archiveDoorBackPoint,archiveEye,archivePassable,archiveProjectEye,archiveRayClear,canMoveShelf,initialShelves} from './archiveSpace';
import {repairEye} from './repairSpace';
export type ArchiveAction={type:'p-slide';index:number;position:number}|{type:'archive-door'};
export const archiveValues=(g:World)=>g.values[16]??initialShelves();
export function applyArchive(s:World,a:ArchiveAction):{world:World;message?:string}{
 if(![6,8].includes(s.room)||s.focus!=='room')return {world:s};
 const values=archiveValues(s);
 if(a.type==='p-slide'){
  if(s.room!==6)return{world:s};
  if(!canMoveShelf(values,a.index,a.position))return {world:s,message:'他の棚に当たる。'};
  const g=structuredClone(s);g.flags['archive:layout2']=true;g.values[16]=values.map((v,i)=>i===a.index?a.position:v);
  if(g.flags['archive:door']&&archivePassable(g.values[16])&&!g.solved.includes(16))g.solved.push(16);
  return {world:g};
 }
 if(s.room===8&&s.facing!==3)return{world:s};
 const eye=s.room===8?repairEye(s.facing):archiveEye(s.facing),handle=s.room===8?archiveDoorBackPoint(!!s.flags['archive:door']):archiveDoorPoint(!!s.flags['archive:door']),point=archiveProjectEye(handle,eye);
 if(point[2]<=0||point[0]<0||point[0]>1672||point[1]<0||point[1]>941||!archiveRayClear(values,handle,-1,eye))return {world:s};
 const g=structuredClone(s);g.flags['archive:door']=!g.flags['archive:door'];
 if(g.flags['archive:door']&&archivePassable(values)&&!g.solved.includes(16))g.solved.push(16);
 return {world:g};
}
