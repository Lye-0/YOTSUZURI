import type {World} from './campaign';
export const frameSize={width:.36,depth:.30,rail:.03,thickness:.018};
export const frameRails=[{length:.36,ends:[1,1]},{length:.30,ends:[0,1]},{length:.36,ends:[0,0]},{length:.30,ends:[1,0]}] as const;
export const initialJoinery=()=>[-1,-1,-1,-1,0,0,0,0,0,1,0,1];
export const joineryValues=(g:World)=>g.values[24]??initialJoinery();
export const validJoinery=(v:unknown):v is number[]=>Array.isArray(v)&&v.length===12&&v.every(Number.isInteger)&&v.slice(0,4).every(n=>n>=-1&&n<4)&&new Set(v.slice(0,4).filter(n=>n>=0)).size===v.slice(0,4).filter(n=>n>=0).length&&v.slice(4,8).every(n=>n>=0&&n<4)&&v.slice(8).every(n=>n===0||n===1);
/** The two half laps must occupy opposite halves of the same corner. */
export function railEnds(v:readonly number[],piece:number,slot:number){const r=frameRails[piece],forward=v[piece+4]===slot,ends=forward?r.ends:[r.ends[1],r.ends[0]];return ends.map(n=>n^v[piece+8]);}
export type JoineryFailure='length'|'direction'|'overlap'|'gap'|'invalid';
export function joineryFailure(v:readonly number[]):JoineryFailure|null{
 if(!validJoinery(v))return 'invalid';
 for(let i=0;i<4;i++){const slot=v[i];if(slot<0)continue;if(Math.abs(frameRails[i].length-(slot%2?.30:.36))>.0001)return 'length';if(v[i+4]%2!==slot%2)return 'direction';}
 for(let i=0;i<4;i++){const slot=v[i];if(slot<0)continue;const next=v.slice(0,4).indexOf((slot+1)%4);if(next>=0){const height=railEnds(v,i,slot)[1]+railEnds(v,next,(slot+1)%4)[0];if(height!==1)return height>1?'overlap':'gap';}}
 return null;
}
export const joineryFits=(v:readonly number[])=>joineryFailure(v)===null;
export const joineryFailureText:Record<JoineryFailure,string>={length:'木片の長さが溝と合わない。',direction:'木片の向きが溝と合わない。',overlap:'端がぶつかり、角が浮く。',gap:'端の重なりに隙間が残る。',invalid:'そこには置けない。'};

export const joineryReady=(g:World)=>joineryValues(g).slice(0,4).every(n=>n>=0)&&joineryFits(joineryValues(g));
export const frameTaken=(g:World)=>g.inventory.includes('frame')||Object.values(g.placed).some(a=>a.includes('frame'));
export type JoineryAction={type:'p-frame-place';id:24;piece:number;slot:number}|{type:'p-frame-turn';id:24;piece:number;flip?:boolean}|{type:'p-frame-remove';id:24;piece:number}|{type:'p-frame-take';id:24}|{type:'p-frame-return';id:24};
export function applyJoinery(s:World,a:JoineryAction|{type:'p-take';id:number;item:string}):{world:World;message?:string}{
 if(s.room!==9||s.facing!==1||s.focus!=='object:24')return{world:s};const g=structuredClone(s),v=[...joineryValues(g)],taken=frameTaken(g);
 if(a.type==='p-take'){
  if(a.item!=='returnrecord'||g.collected.includes('returnrecord'))return{world:s};g.inventory.push('returnrecord');g.collected.push('returnrecord');g.selected=null;
 }else if(a.type==='p-frame-return'){
  if(g.selected!=='frame'||!g.inventory.includes('frame'))return{world:s};g.inventory=g.inventory.filter(n=>n!=='frame');g.collected=g.collected.filter(n=>n!=='frame');g.values[24]=validJoinery(g.itemValues.frame)?[...g.itemValues.frame]:[0,1,2,3,0,1,2,3,0,0,0,0];g.selected=null;return{world:g};
 }else if(taken)return{world:s};
 else if(a.type==='p-frame-take'){
  if(!joineryReady(g))return{world:s,message:'継ぎ目が離れる。'};g.inventory.push('frame');if(!g.collected.includes('frame'))g.collected.push('frame');g.itemValues.frame=[...v];g.selected=null;if(!g.solved.includes(24))g.solved.push(24);
 }else{
  if(!Number.isInteger(a.piece)||a.piece<0||a.piece>3)return{world:s};
  if(a.type==='p-frame-remove')v[a.piece]=-1;
  else if(a.type==='p-frame-turn'){const i=a.piece+(a.flip?8:4);v[i]=(v[i]+1)%(a.flip?2:4);}
  else{if(!Number.isInteger(a.slot)||a.slot<0||a.slot>3||v.slice(0,4).some((n,i)=>i!==a.piece&&n===a.slot))return{world:s};v[a.piece]=a.slot;}
  const failure=joineryFailure(v);if(failure)return{world:s,message:joineryFailureText[failure]};
 }
 g.values[24]=v;return{world:g};
}
