import type {World} from './campaign';
export type PlateAction={type:'p-drawer';id:10;index:number}|{type:'p-plate';id:10;index:number};
export const plateIds=(g:World)=>g.inventory.includes('plates')||g.placed[12]?.includes('plates')?g.itemValues.plates??[]:[];
export function applyPlates(s:World,a:PlateAction):{world:World;message?:string}{
 if(s.room!==3||s.facing!==3||s.focus!=='object:10'||!Number.isInteger(a.index)||a.index<0||a.index>3)return {world:s};
 const g=structuredClone(s),key=`drawer:10:${a.index}`;
 if(a.type==='p-drawer'){
  const wasOpen=g.flags[key];
  for(let i=0;i<4;i++)g.flags[`drawer:10:${i}`]=false;
  g.flags[key]=!wasOpen;
  return {world:g};
 }
 if(!g.flags[key])return {world:s};
 const ids=plateIds(g);
 if(ids.includes(a.index)){
  if(!g.inventory.includes('plates')||g.selected!=='plates')return {world:s};
  g.itemValues.plates=ids.filter(n=>n!==a.index);
  if(!g.itemValues.plates.length){g.inventory=g.inventory.filter(n=>n!=='plates');g.collected=g.collected.filter(n=>n!=='plates');g.selected=null;}
 }else{
  if(g.placed[12]?.includes('plates'))return {world:s,message:'持ち出した版は、刷り機に置いてある。'};
  if(ids.length===2)return {world:s,message:'二枚を持っている。先に引出しへ戻せる。'};
  g.itemValues.plates=[...ids,a.index];
  if(!g.inventory.includes('plates'))g.inventory.push('plates');
  if(!g.collected.includes('plates'))g.collected.push('plates');
  g.selected=null;
 }
 g.values[10]=[...g.itemValues.plates];
 if(g.values[10].includes(0)&&g.values[10].includes(3)&&!g.solved.includes(10))g.solved.push(10);
 return {world:g};
}
