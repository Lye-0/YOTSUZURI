import type {World} from './campaign';
import type {CampaignItem} from './catalog';
import {paperMatchesExit} from './exitReference';
export const masterPaperIndex=(g:World)=>g.placed[29]?.includes('tissue')?(g.values[29]?.[0]??0):-1;
export type MasterAction={type:'p-master-paper';id:29;index:number};
export function applyMasters(s:World,a:MasterAction|{type:'p-retrieve';id:number;item:CampaignItem}):{world:World;message?:string}{
 if(s.room!==10||s.facing!==0||s.focus!=='object:29')return{world:s};const g=structuredClone(s),onBench=masterPaperIndex(g)>=0;
 if(a.type==='p-retrieve'){if(!onBench||a.item!=='tissue')return{world:s};g.placed[29]=[];g.inventory.push('tissue');g.selected=null;}
 else{if(![0,1].includes(a.index))return{world:s};if(!onBench){if(g.selected!=='tissue'||!g.inventory.includes('tissue'))return{world:s};g.inventory=g.inventory.filter(n=>n!=='tissue');g.placed[29]=['tissue'];g.selected=null;}g.values[29]=[a.index];if(a.index===1&&paperMatchesExit(g)&&!g.solved.includes(29))g.solved.push(29);}
 return{world:g};
}
