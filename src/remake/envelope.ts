import type {World} from './campaign';
import type {CampaignItem} from './catalog';
// Face (back/front), loosened gum, unfolded flaps (right/lower/upper), inner sleeve extension.
export const initialEnvelope=()=>[0,0,0,0];
export const envelopeValues=(g:World)=>g.values[18]??initialEnvelope();
export function validEnvelope(v:unknown):v is number[]{return Array.isArray(v)&&v.length===4&&[0,1].includes(v[0])&&[0,1].includes(v[1])&&[0,1,3,7].includes(v[2])&&[0,1,2].includes(v[3])&&(!v[0]||v[2]===0&&v[3]===0)&&(v[2]<3||v[1]===1)&&(v[3]===0||v[2]===7);}
export const envelopeExposed=(g:World)=>{const v=envelopeValues(g);return v[0]===0&&v[2]===7&&v[3]>0;};
export type EnvelopeAction={type:'p-envelope-turn'|'p-envelope-loosen';id:18}|{type:'p-envelope-flap';id:18;index:number}|{type:'p-envelope-slide';id:18;direction:-1|1};
export function applyEnvelope(s:World,a:EnvelopeAction|{type:'p-take';id:number;item:CampaignItem}):{world:World;message?:string}{
 if(s.room!==6||s.focus!=='object:18')return {world:s};
 const v=[...envelopeValues(s)],g=structuredClone(s);
 if(a.type==='p-take'){
  if(a.id!==18||!['tissue','blanks'].includes(a.item)||!envelopeExposed(s)||g.collected.includes(a.item))return {world:s};
  g.inventory.push(a.item);g.collected.push(a.item);return {world:g};
 }
 if(a.type==='p-envelope-turn'){
  if(v[2]||v[3])return {world:s,message:'折り返しを畳めば裏返せる。'};v[0]=v[0]?0:1;
 }else{
  if(v[0])return {world:s};
  if(a.type==='p-envelope-loosen'){
   if(v[1])return {world:s};
   if(g.selected!=='knife'||!g.inventory.includes('knife'))return {world:s,message:g.selected?'この道具は隙間へ入らない。':'糊付けされた縁がある。'};
   v[1]=1;g.selected=null;
  }else if(a.type==='p-envelope-flap'){
   if(!Number.isInteger(a.index)||a.index<0||a.index>2)return {world:s};
   if(v[3])return {world:s,message:'内袋が出ている。'};
   const bit=1<<a.index;
   if(v[2]&bit){if(v[2]&~((bit<<1)-1))return {world:s,message:'先に、内側の折り返しを畳める。'};v[2]&=~bit;}
   else{if((v[2]&(bit-1))!==bit-1)return {world:s,message:'別の折り返しが押さえている。'};if(a.index===1&&!v[1])return {world:s,message:'糊が残っている。'};v[2]|=bit;}
  }else if(a.type==='p-envelope-slide'){
   if(v[2]!==7||![-1,1].includes(a.direction))return {world:s};
   const next=v[3]-a.direction;if(next<0||next>2)return {world:s,message:'その向きには動かない。'};v[3]=next;
  }
 }
 g.values[18]=v;
 if(envelopeExposed(g)){if(!g.solved.includes(18))g.solved.push(18);if(!g.opened.includes(18))g.opened.push(18);}
 return {world:g};
}
