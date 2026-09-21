import type {World} from './campaign';
import {archiveDoorHandle,archiveEye,archivePassable,archiveProjectEye,archiveRayClear,canMoveShelf,initialShelves} from './archiveSpace';
export type ArchiveAction={type:'p-slide';index:number;position:number}|{type:'archive-door'};
export const archiveValues=(g:World)=>g.values[16]??initialShelves();
export function applyArchive(s:World,a:ArchiveAction):{world:World;message?:string}{
 if(s.room!==6||s.focus!=='room')return {world:s};
 const values=archiveValues(s);
 if(a.type==='p-slide'){
  if(!canMoveShelf(values,a.index,a.position))return {world:s,message:'他の棚に当たる。'};
  const g=structuredClone(s);g.values[16]=values.map((v,i)=>i===a.index?a.position:v);
  if(g.flags['archive:door']&&archivePassable(g.values[16])&&!g.solved.includes(16))g.solved.push(16);
  return {world:g};
 }
 const eye=archiveEye(s.facing),point=archiveProjectEye(archiveDoorHandle,eye);
 if(point[2]<=0||point[0]<0||point[0]>1672||point[1]<0||point[1]>941||!archiveRayClear(values,archiveDoorHandle,-1,eye))return {world:s};
 const g=structuredClone(s);g.flags['archive:door']=!g.flags['archive:door'];
 if(g.flags['archive:door']&&archivePassable(values)&&!g.solved.includes(16))g.solved.push(16);
 return {world:g};
}
