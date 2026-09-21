import type {World} from './campaign';
import {canMoveRing,moveRing} from './linkedRings';
export type InterlockAction={type:'p-loop';id:11;index:number};
export const interlockMask=(g:World)=>g.values[11]?.[0]??7;
export function applyInterlock(s:World,a:InterlockAction):{world:World;message?:string}{
 if(s.room!==4||s.facing!==2||s.focus!=='object:11'||s.opened.includes(11))return {world:s};
 const mask=interlockMask(s);
 if(!canMoveRing(mask,a.index))return {world:s,message:'内側の留めが掛かっている。'};
 const g=structuredClone(s),next=moveRing(mask,a.index);g.values[11]=[next,0];
 if(next===0&&!g.solved.includes(11))g.solved.push(11);
 return {world:g};
}
