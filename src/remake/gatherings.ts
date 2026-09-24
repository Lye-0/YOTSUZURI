import type {World} from './campaign';
import {initialBook} from './book';
export const gatheringPairs=[[0,1],[6,7],[2,3],[8,9],[4,5]] as const;
export const originalSources=[0,1,2,3,4,5];
export const paperStocks=[{hand:1,y:.72},{hand:1,y:.28},{hand:1,y:.72},{hand:-1,y:.72},{hand:1,y:.72}] as const;
export const initialGatherings=()=>[-1,-1,-1,-1];
export const gatheringValues=(g:World)=>g.values[17]??initialGatherings();
export const gatheringSources=(g:World)=>g.itemValues.gatherings??originalSources;
export const gatheringsTaken=(g:World)=>!!g.flags['gatherings:taken']||g.inventory.includes('gatherings')||Object.values(g.placed).some(items=>items.includes('gatherings'));
export const gatheringPose=(g:World,index:number)=>({flip:g.flags[`gathering:flip:${index}`]??index===2,rotate:g.flags[`gathering:rotate:${index}`]??index===4});
export function validGatherings(v:unknown):v is number[]{return Array.isArray(v)&&v.length===4&&v.every(n=>Number.isInteger(n)&&n>=-1&&n<5)&&new Set(v.filter(n=>n>=0)).size===v.filter(n=>n>=0).length;}
export function validGatheringSources(v:unknown):v is number[]{return Array.isArray(v)&&v.length===6&&new Set(v).size===6&&v.every(n=>Number.isInteger(n)&&n>=0&&n<10);}
export function paperObservation(index:number,flip:boolean,rotate:boolean){const stock=paperStocks[index],transform=([x,y]:readonly number[])=>{if(flip)x=1-x;if(rotate){x=1-x;y=1-y;}return [x,y];};return {fold:transform([0,.5]),notch:transform([1,1]),mark:transform([.68,stock.y]),hand:stock.hand*(flip?-1:1)*(rotate?-1:1)};}
export const matchesOriginalStock=(index:number)=>paperStocks[index]?.hand===1&&paperStocks[index]?.y===.72;
export type GatheringAction={type:'p-gathering-move';id:17;index:number;destination:'light'|'home'|0|1|2}|{type:'p-gathering-probe';id:17;index:number}|{type:'p-gathering-turn';id:17;mode:'flip'|'rotate'}|{type:'p-gathering-place';id:17;slot:number}|{type:'p-gathering-take'|'p-gathering-return';id:17};
export function applyGatherings(s:World,a:GatheringAction):{world:World;message?:string}{
 if(s.room!==7||s.focus!=='object:17')return {world:s};const g=structuredClone(s),v=[...gatheringValues(g)],taken=gatheringsTaken(g);
 if(a.type==='p-gathering-move'){
  const i=a.index,d=a.destination;if(!Number.isInteger(i)||i<0||i>4||taken&&v.slice(1).includes(i))return {world:s};
  if(d==='light'&&v[0]>=0&&v[0]!==i)return {world:s,message:'光の台の紙を先に戻せる。'};
  if(typeof d==='number'&&(!Number.isInteger(d)||d<0||d>2||taken||v[d+1]>=0&&v[d+1]!==i))return {world:s};
  for(let j=0;j<4;j++)if(v[j]===i)v[j]=-1;
  if(d==='light')v[0]=i;else if(typeof d==='number')v[d+1]=i;
 }else if(a.type==='p-gathering-probe'){
  if(!Number.isInteger(a.index)||a.index< -1||a.index>4||taken&&v.slice(1).includes(a.index)||v[0]===a.index)return {world:s};
  for(let i=1;i<4;i++)if(v[i]===a.index)v[i]=-1;v[0]=a.index;
 }else if(a.type==='p-gathering-turn'){
  if(v[0]<0)return {world:s};const pose=gatheringPose(g,v[0]);g.flags[`gathering:${a.mode}:${v[0]}`]=!pose[a.mode];
 }else if(a.type==='p-gathering-place'){
  if(taken||!Number.isInteger(a.slot)||a.slot<0||a.slot>2||v[0]<0)return {world:s};
  // Swapping with an occupied place keeps both real pairs accounted for.
  g.flags[`gathering:flip:${v[0]}`]=false;g.flags[`gathering:rotate:${v[0]}`]=false;
  [v[0],v[a.slot+1]]=[v[a.slot+1],v[0]];
 }else if(a.type==='p-gathering-return'){
  if(!taken)return {world:s};if(!g.inventory.includes('gatherings'))return {world:s,message:'紙束は別の場所にある。'};if(g.selected!=='gatherings')return {world:s,message:'手元の紙束を選んで戻せる。'};
  g.inventory=g.inventory.filter(n=>n!=='gatherings');g.collected=g.collected.filter(n=>n!=='gatherings');g.flags['gatherings:taken']=false;g.selected=null;
 }else{
  if(taken||v.slice(1).some(n=>n<0))return {world:s,message:'六折をまとめる場所がある。'};
  const sources=v.slice(1).flatMap(i=>[...gatheringPairs[i]]),previous=g.itemValues.gatherings;
  if(!previous||sources.some((n,i)=>n!==previous[i]))g.book=initialBook();
  g.itemValues.gatherings=sources;g.flags['gatherings:taken']=true;g.inventory.push('gatherings');if(!g.collected.includes('gatherings'))g.collected.push('gatherings');g.selected=null;
  if(v.slice(1).every(matchesOriginalStock)&&!g.solved.includes(17))g.solved.push(17);
 }
 g.flags['gatherings:layout']=true;g.values[17]=v;return {world:g};
}
