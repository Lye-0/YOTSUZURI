import type {World} from './campaign';
import type {CampaignItem} from './catalog';
export const BOOK_MASSES=[8,8,6,8] as const;
export const BAND_MASS=2;
// Pan (-1/0..3 books/4..9 loose saddles), rider, then six bindings: -1 loose or book*3+slot.
export const initialWeighing=()=>[-1,0,4,6,8,9,10,11];
export const weighingValues=(g:World)=>g.values[19]??initialWeighing();
export function validWeighing(v:unknown):v is number[]{return Array.isArray(v)&&v.length===8&&Number.isInteger(v[0])&&v[0]>=-1&&v[0]<=9&&Number.isInteger(v[1])&&v[1]>=0&&v[1]<=16&&v.slice(2).every(n=>Number.isInteger(n)&&n>=-1&&n<12)&&new Set(v.slice(2).filter(n=>n>=0)).size===v.slice(2).filter(n=>n>=0).length&&(v[0]<4||v[v[0]-4+2]===-1);}
export const bookBands=(g:World,book:number)=>weighingValues(g).slice(2).flatMap((place,index)=>place>=0&&Math.floor(place/3)===book?[{index,slot:place%3}]:[]);
export const bookMass=(g:World,book:number)=>BOOK_MASSES[book]+bookBands(g,book).length*BAND_MASS-(book===2&&g.collected.includes('wedge')?1:0);
export const scaleMass=(g:World)=>{const p=weighingValues(g)[0];return p<0?0:p<4?bookMass(g,p):BAND_MASS;};
export const scaleAngle=(g:World)=>-Math.max(-15,Math.min(15,(scaleMass(g)-weighingValues(g)[1])*1.1));
export const spineOpen=(g:World)=>!!g.flags['weighing:spine'];
export type WeighingAction={type:'p-weigh-place';id:19;object:number}|{type:'p-weigh-rider';id:19;value:number}|{type:'p-weigh-detach';id:19;index:number}|{type:'p-weigh-attach';id:19;index:number;book:number;slot?:number}|{type:'p-weigh-spine';id:19;book:number}|{type:'p-weigh-return-wedge';id:19};
export function applyWeighing(s:World,a:WeighingAction|{type:'p-take';id:number;item:CampaignItem}):{world:World;message?:string}{
 if(s.room!==7||s.focus!=='object:19')return {world:s};const g=structuredClone(s),v=[...weighingValues(g)];
 if(a.type==='p-weigh-place'){
  if(!Number.isInteger(a.object)||a.object< -1||a.object>9||a.object===v[0])return {world:s};
  if(a.object>=4&&v[a.object-4+2]!==-1)return {world:s,message:'本に留まっている。'};
  if(a.object===2&&spineOpen(g))return {world:s,message:'背を閉じれば皿に載る。'};
  v[0]=a.object;
 }else if(a.type==='p-weigh-rider'){
  if(!Number.isInteger(a.value)||a.value<0||a.value>16||a.value===v[1])return {world:s};v[1]=a.value;
 }else if(a.type==='p-weigh-detach'){
  if(!Number.isInteger(a.index)||a.index<0||a.index>=6||v[a.index+2]<0)return {world:s};v[a.index+2]=-1;
 }else if(a.type==='p-weigh-attach'){
  if(!Number.isInteger(a.index)||a.index<0||a.index>=6||!Number.isInteger(a.book)||a.book<0||a.book>3||v[a.index+2]!==-1)return {world:s};
  if(a.book===2&&spineOpen(g))return {world:s,message:'背を閉じれば留められる。'};
  const slots=bookBands(g,a.book).map(b=>b.slot),slot=a.slot??[1,0,2].find(n=>!slots.includes(n));
  if(slot===undefined||!Number.isInteger(slot)||slot<0||slot>2||slots.includes(slot))return {world:s,message:'そこには留めがある。'};
  v[a.index+2]=a.book*3+slot;if(v[0]===a.index+4)v[0]=-1;
 }else if(a.type==='p-weigh-spine'){
  if(!Number.isInteger(a.book)||a.book<0||a.book>3)return {world:s};
  if(bookBands(g,a.book).length)return {world:s,message:'金具が背を押さえている。'};
  if(v[0]===a.book)return {world:s,message:'本を台へ戻せば、背を引ける。'};
  if(a.book!==2)return {world:s,message:'背は動かない。'};
  g.flags['weighing:spine']=!spineOpen(g);if(spineOpen(g)){if(!g.solved.includes(19))g.solved.push(19);if(!g.opened.includes(19))g.opened.push(19);}
 }else if(a.type==='p-weigh-return-wedge'){
  if(!spineOpen(g)||g.selected!=='wedge'||!g.inventory.includes('wedge'))return {world:s};g.inventory=g.inventory.filter(n=>n!=='wedge');g.collected=g.collected.filter(n=>n!=='wedge');g.selected=null;
 }else{
  if(a.id!==19||a.item!=='wedge'||!spineOpen(g)||g.collected.includes('wedge')||g.inventory.includes('wedge'))return {world:s};g.inventory.push('wedge');g.collected.push('wedge');g.selected=null;
 }
 g.values[19]=v;return {world:g};
}
