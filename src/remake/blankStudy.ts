import type {World} from './campaign';
import type {CampaignItem} from './catalog';
export const studySpecimens=[
 {base:.025,extension:.075,paper:'plain'},
 {base:.022,extension:0,paper:'plain',stub:'cut'},
 {base:.10,extension:0,paper:'deckled'},
 {base:.10,extension:0,paper:'plain'},
 {base:.026,extension:0,paper:'foxed',stub:'torn'},
 {base:.035,extension:.065,paper:'foxed'},
] as const;
export const missingLeaves=studySpecimens.flatMap((s,i)=>s.base+s.extension<.099?[i]:[]);
export const initialBlankStudy=()=>[-1,-1];
export const blankStudyValues=(g:World)=>g.values[23]??initialBlankStudy();
export const validBlankStudy=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===2&&v.every(n=>Number.isInteger(n)&&n>=-1&&n<6)&&(v[0]===-1||v[0]!==v[1]);
export const validBlankMarks=(v:unknown):v is number[]=>Array.isArray(v)&&v.length<=2&&v.every(n=>Number.isInteger(n)&&n>=0&&n<6)&&new Set(v).size===v.length;
export const studyOpen=(g:World,i:number)=>!!g.flags[`leaf:open:${i}`];
export const studyUnderOpen=(g:World,i:number)=>!!g.flags[`leaf:under:${i}`];
export type BlankStudyAction={type:'p-study-open';id:23;index:number;under?:boolean}|{type:'p-blank-mark';id:23;packet:number;slot:number};
export function applyBlankStudy(s:World,a:BlankStudyAction|{type:'p-place';id:number;target?:CampaignItem}|{type:'p-retrieve';id:number;item:CampaignItem}):{world:World;message?:string}{
 if(s.room!==9||s.facing!==3||s.focus!=='object:23')return{world:s};
 const g=structuredClone(s),v=[...blankStudyValues(g)],has=g.placed[23]?.includes('blanks');
 if(a.type==='p-study-open'){
  if(!Number.isInteger(a.index)||a.index<0||a.index>=6)return{world:s};
  if(a.under&&(!studyOpen(g,a.index)||!studySpecimens[a.index].extension))return{world:s};
  const key=`leaf:${a.under?'under':'open'}:${a.index}`;g.flags[key]=!g.flags[key];
 }else if(a.type==='p-place'){
  if(has||g.selected!=='blanks'||!g.inventory.includes('blanks')||a.target&&a.target!=='blanks')return{world:s};
  g.inventory=g.inventory.filter(n=>n!=='blanks');g.placed[23]=['blanks'];g.selected=null;
 }else if(a.type==='p-retrieve'){
  if(!has||a.item!=='blanks')return{world:s};g.placed[23]=[];g.inventory.push('blanks');g.itemValues.blanks=v.filter(n=>n>=0);g.selected=null;
 }else{
  if(!has||![0,1].includes(a.packet)||!Number.isInteger(a.slot)||a.slot< -1||a.slot>5||a.slot>=0&&v[1-a.packet]===a.slot)return{world:s};
  v[a.packet]=a.slot;
 }
 g.values[23]=v;
 if(has&&missingLeaves.every(i=>v.includes(i))&&!g.solved.includes(23))g.solved.push(23);
 return{world:g};
}
