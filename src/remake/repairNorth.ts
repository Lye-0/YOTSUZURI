import {lockMatches,turnLock,panelLockCode} from './evidenceLocks';
import type {World} from './campaign';
export const repairPanels=[{x:4.7,id:'panel-three-straps'},{x:5.8,id:'panel-target'},{x:6.9,id:'panel-left-split'}] as const;
export const secretDoor={x:5.8,y:.04,width:1,height:2.1};
export const secretOpening={x:5.85,y:0,width:.92,height:2.05};
export const panelKnob={u:(718-194)/630,z:2.1*(1-(901-7)/1508)};
export const coverBoard={u:.40,width:.30,height:.44,top:1.15};
export const panelUncovered=(g:World,index:number)=>!!g.flags[`repair:trim:${index}`];
export type RepairNorthAction={type:'repair-setting';index:number;row:number}|{type:'repair-trim';index:number}|{type:'repair-panel-door';index:number};
export function applyRepairNorth(s:World,a:RepairNorthAction):{world:World;message?:string}{
 if(s.room!==8||s.facing!==0||!Number.isInteger(a.index)||a.index<0||a.index>2)return{world:s};
 const g=structuredClone(s),uncovered=panelUncovered(g,a.index);
 if(a.type==='repair-setting'){if(!uncovered||!Number.isInteger(a.row)||a.row<0||a.row>5||g.flags.secret)return{world:s};turnLock(g.flags,`repair:setting:${a.index}`,a.row);return{world:g};}
 if(a.type==='repair-trim'){
  if(uncovered){if(a.index===1&&g.flags.secret)return{world:s,message:'戸を閉じれば戻せる。'};g.flags[`repair:trim:${a.index}`]=false;}
  else{if(g.selected!=='knife'||!g.inventory.includes('knife'))return{world:s,message:g.selected?'この厚みでは入らない。':'縁に細い隙間がある。'};g.flags[`repair:trim:${a.index}`]=true;g.selected=null;}
 }else{
  if(!uncovered)return{world:s};if(a.index!==1)return{world:s,message:'奥で固定されている。'};if(!g.flags.secret&&!g.flags['repair:released']&&!lockMatches(g.flags,`repair:setting:${a.index}`,panelLockCode))return{world:s,message:'六段の留めが掛かっている。小口の絵に同じ機構が描かれている。'};g.flags['repair:released']=true;g.flags.secret=!g.flags.secret;g.focus='room';
 }
 return{world:g};
}
