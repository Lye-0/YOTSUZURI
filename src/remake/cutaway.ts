import type {World} from './campaign';
export const cutawayReceivers=[2,1,4] as const;
export const cutawayValues=(g:World)=>g.values[27]??[1,1,1];
export const cutawayAligned=(g:World)=>cutawayValues(g).every((n,i)=>n+cutawayReceivers[i]===5);
export const cutawayOpen=(g:World)=>!!g.flags['cutaway:bolt'];
export type CutawayAction={type:'p-cutaway-screw';id:27;index:number}|{type:'p-cutaway-bolt';id:27};
export function applyCutaway(s:World,a:CutawayAction):{world:World;message?:string}{
 if(s.room!==9||s.facing!==0||s.focus!=='object:27')return{world:s};const g=structuredClone(s);
 if(a.type==='p-cutaway-screw'){
  if(!Number.isInteger(a.index)||a.index<0||a.index>2)return{world:s};if(cutawayOpen(g))return{world:s,message:'先に取っ手を戻す。'};
  const v=[...cutawayValues(g)];v[a.index]=v[a.index]%4+1;g.values[27]=v;g.flags['attempt:27']=false;
 }else if(cutawayOpen(g))g.flags['cutaway:bolt']=false;
 else{g.flags['attempt:27']=true;if(!cutawayAligned(g))return{world:g,message:'まだ引けない。'};g.flags['cutaway:bolt']=true;if(!g.solved.includes(27))g.solved.push(27);}
 return{world:g};
}
