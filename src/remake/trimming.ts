import type {World} from './campaign';
/** These are ink crossings at the cut edge, shared by the renderer and fit test. */
export const trimSeams=[
 {front:[90,188,250,310,410],back:[132,245,371]},
 {front:[90,202,250,310,410],back:[132,227,371]},
 {front:[90,188,250,310,410],back:[132,227,371]},
];
export const originalSeam={front:[90,188,250,310,410],back:[132,227,371]};
export const initialTrim=()=>[-1,1,0,1,0,0,0,0];
export const trimValues=(g:World)=>g.values[14]??initialTrim();
export function validTrim(v:unknown):v is number[]{return Array.isArray(v)&&v.length===8&&Number.isInteger(v[0])&&v[0]>=-1&&v[0]<=2&&v.slice(1).every(n=>n===0||n===1);}
export function trimFits(v:number[]){const id=v[0];if(id<0||!trimSeams[id]||v[id+1]!==0||v[4]!==v[id+5])return false;return (['front','back'] as const).every(face=>trimSeams[id][face].every((n,i)=>n===originalSeam[face][i]));}
export type TrimAction={type:'p-trim-place'|'p-trim-rotate';id:14;index:number}|{type:'p-trim-flip';id:14;index:number}|{type:'p-trim-remove'|'p-trim-take'|'p-trim-return';id:14};
export function applyTrim(s:World,a:TrimAction):{world:World;message?:string}{
 if(s.room!==5||s.facing!==2||s.focus!=='object:14')return {world:s};
 const g=structuredClone(s),v=[...trimValues(g)];
 if(a.type==='p-trim-return'){
  if(g.selected!=='oldplan'||!g.inventory.includes('oldplan'))return {world:s};
  const saved=g.itemValues.oldplan;if(!validTrim(saved))return {world:s};
  v[0]=saved[0];v[4]=saved[4];v[saved[0]+1]=saved[saved[0]+1];v[saved[0]+5]=saved[saved[0]+5];g.values[14]=v;g.inventory=g.inventory.filter(n=>n!=='oldplan');g.collected=g.collected.filter(n=>n!=='oldplan');g.flags['trim:taken']=false;g.selected=null;return {world:g};
 }
 if(g.flags['trim:taken']&&(!('index'in a)||!['p-trim-flip','p-trim-rotate'].includes(a.type)||a.index<0||a.index===v[0]))return {world:s};
 if(a.type==='p-trim-take'){
  if(v[0]<0||g.inventory.includes('oldplan'))return {world:s};
  g.inventory.push('oldplan');if(!g.collected.includes('oldplan'))g.collected.push('oldplan');g.itemValues.oldplan=[...v];g.flags['trim:taken']=true;g.selected=null;
 }else if(a.type==='p-trim-remove')v[0]=-1;
 else if(a.type==='p-trim-flip'){
  if(!Number.isInteger(a.index)||a.index< -1||a.index>2)return {world:s};
  const slot=a.index===-1?4:a.index+5;v[slot]=v[slot]?0:1;
 }else{
  if(!('index'in a))return {world:s};
  if(!Number.isInteger(a.index)||a.index<0||a.index>2)return {world:s};
  if(a.type==='p-trim-place'){if(v[0]>=0&&v[0]!==a.index)return {world:s,message:'先の紙片が重なっている。'};v[0]=a.index;}else v[a.index+1]=v[a.index+1]?0:1;
 }
 g.values[14]=v;if(trimFits(v)&&!g.solved.includes(14))g.solved.push(14);
 return {world:g};
}
