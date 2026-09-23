import {paperOnExit,paperMatchesExit,paperAlignmentMessage} from './exitReference';
import type {World} from './campaign';
import type {CampaignItem} from './catalog';
export const initialRubbing=()=>[0,0];
export const rubbingValues=(g:World)=>g.values[25]??initialRubbing();
export const validRubbing=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===2&&[0,1].includes(v[0])&&Number.isInteger(v[1])&&[0,2].includes(v[1]);
/** Physical paper: contacted side, mould rotation, rubbed zones, viewed face, viewed rotation. */
export const blankRubbing=()=>[0,0,0,0,0];
export const tissueTrace=(g:World)=>g.itemValues.tissue??blankRubbing();
export const validTissueTrace=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===5&&v.every(Number.isInteger)&&[0,1].includes(v[0])&&[0,2].includes(v[1])&&v[2]>=0&&v[2]<64&&[0,1].includes(v[3])&&v[4]>=0&&v[4]<4;
export const tissueOnMould=(g:World)=>!!g.placed[25]?.includes('tissue')&&!g.flags['rubbing:inspection'];
export type RubbingAction={type:'p-mould-turn';id:25;flip?:boolean}|{type:'p-rubbing-zone';id:25;zone:number}|{type:'p-rubbing-erase';id:25}|{type:'p-rubbing-move';id:25}|{type:'p-rubbing-view';flip?:boolean};
export function applyRubbing(s:World,a:RubbingAction|{type:'p-place';id:number;target?:CampaignItem}|{type:'p-retrieve';id:number;item:CampaignItem}):{world:World;message?:string}{
 const active=s.room===9&&s.facing===0&&s.focus==='object:25',onBench=s.placed[25]?.includes('tissue');
 if(a.type==='p-rubbing-view'){
  if(!s.inventory.includes('tissue')&&!(s.room===10&&s.facing===3&&paperOnExit(s))&&!(s.room===10&&s.facing===0&&s.focus==='object:29'&&s.placed[29]?.includes('tissue'))&&!(active&&onBench&&s.flags['rubbing:inspection']))return{world:s};
  const g=structuredClone(s),t=[...tissueTrace(g)],i=a.flip?3:4;t[i]=(t[i]+1)%(a.flip?2:4);g.itemValues.tissue=t;if(paperOnExit(g)&&paperMatchesExit(g)&&!g.solved.includes(25))g.solved.push(25);if(g.placed[29]?.includes('tissue')&&g.values[29]?.[0]===1&&paperMatchesExit(g)&&!g.solved.includes(29))g.solved.push(29);return{world:g,message:paperOnExit(g)?paperAlignmentMessage(g):undefined};
 }
 if(!active)return{world:s};const g=structuredClone(s),v=[...rubbingValues(g)],t=[...tissueTrace(g)];
 if(a.type==='p-mould-turn'){
  if(tissueOnMould(g))return{world:s,message:'保護紙を脇へ移せば返せる。'};const i=a.flip?0:1;v[i]=(v[i]+(a.flip?1:2))%(a.flip?2:4);
 }else if(a.type==='p-place'){
  if(onBench||g.selected!=='tissue'||!g.inventory.includes('tissue')||a.target&&a.target!=='tissue')return{world:s};g.inventory=g.inventory.filter(n=>n!=='tissue');g.placed[25]=['tissue'];g.flags['rubbing:inspection']=false;g.selected=null;t[3]=0;t[4]=0;
 }else if(a.type==='p-retrieve'){
  if(!onBench||a.item!=='tissue')return{world:s};g.placed[25]=[];g.inventory.push('tissue');g.selected=null;
 }else if(a.type==='p-rubbing-move'){
  if(!onBench)return{world:s};g.flags['rubbing:inspection']=!g.flags['rubbing:inspection'];if(!g.flags['rubbing:inspection']){t[3]=0;t[4]=0;}
 }else if(a.type==='p-rubbing-erase'){
  if(!onBench||!t[2])return{world:s};t[2]=0;
 }else{
  if(!tissueOnMould(g)||!Number.isInteger(a.zone)||a.zone<0||a.zone>5)return{world:s};
  if(t[2]&&(t[0]!==v[0]||t[1]!==v[1]||t[3]!==0||t[4]!==0))return{world:s,message:'先の写しが残っている。'};
  if(t[2]&(1<<a.zone))return{world:s};t[0]=v[0];t[1]=v[1];t[2]|=1<<a.zone;t[3]=0;t[4]=0;

 }
 g.values[25]=v;g.itemValues.tissue=t;return{world:g};
}
