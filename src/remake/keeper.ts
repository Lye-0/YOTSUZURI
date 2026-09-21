import type {World} from './campaign';
export type KeeperAction={type:'p-keeper-slide';id:15;index:number;position:number}|{type:'p-keeper-pull'|'p-keeper-return';id:15;index:number}|{type:'p-keeper-leaf';id:15};
export const initialKeeper=()=>[0,1,2,0,0,0];
export const keeperValues=(g:World)=>g.values[15]??initialKeeper();
export function validKeeper(v:unknown):v is number[]{if(!Array.isArray(v)||v.length!==6||v.some(n=>!Number.isInteger(n)))return false;if(v.slice(0,3).some(n=>n<0||n>2)||v.slice(3).some(n=>n<0||n>1))return false;const positions=v.slice(0,3).filter((_,i)=>!v[i+3]);return new Set(positions).size===positions.length;}
export const keeperClear=(g:World)=>keeperValues(g).slice(3).every(Boolean);
export function applyKeeper(s:World,a:KeeperAction):{world:World;message?:string}{
 if(s.room!==3||s.facing!==0||s.focus!=='object:15'||s.opened.includes(15))return {world:s};
 const g=structuredClone(s),v=[...keeperValues(s)];
 if(a.type==='p-keeper-leaf'){
  if(!keeperClear(s))return {world:s,message:'頭が、溝の縁に掛かっている。'};
  g.flags['keeper:leaf']=!g.flags['keeper:leaf'];return {world:g};
 }
 if(g.flags['keeper:leaf']||!Number.isInteger(a.index)||a.index<0||a.index>2)return {world:s};
 const i=a.index,occupied=(position:number)=>v.slice(0,3).some((p,j)=>j!==i&&!v[j+3]&&p===position);
 if(a.type==='p-keeper-slide'){
  if(v[i+3]||!Number.isInteger(a.position)||a.position<0||a.position>2||Math.abs(a.position-v[i])!==1)return {world:s};
  if(occupied(a.position))return {world:s,message:'隣の留めに当たっている。'};
  v[i]=a.position;
 }else if(a.type==='p-keeper-pull'){
  if(v[i+3])return {world:s};
  if(v[i]!==1)return {world:s,message:'頭が、溝の縁に掛かっている。'};
  v[i+3]=1;
 }else{
  if(!v[i+3]||occupied(1))return {world:s};v[i]=1;v[i+3]=0;
 }
 g.values[15]=v;
 if(v.slice(3).every(Boolean)&&!g.solved.includes(15))g.solved.push(15);
 return {world:g};
}
