import type {World} from './campaign';
import {sameImpression,type Impression} from './printing';
export type PrintState={slot:0|1;layers:Impression[]};
export type PressAction={type:'p-press-select';id:12;slot:0|1}|{type:'p-print';id:12}|{type:'p-new-sheet';id:12}|{type:'p-take-print';id:12}|{type:'p-press-paper';id:12};
export const initialPrint=():PrintState=>({slot:0,layers:[]});
export function validPrint(p:unknown):p is PrintState{
 if(!p||typeof p!=='object')return false;const x=p as PrintState;
 return [0,1].includes(x.slot)&&Array.isArray(x.layers)&&x.layers.length<=2&&x.layers.every(l=>l&&Number.isInteger(l.plate)&&l.plate>=0&&l.plate<4&&Number.isInteger(l.rotation)&&l.rotation>=0&&l.rotation<4&&[0,1].includes(l.face)&&[0,1,2].includes(l.offset));
}
export const encodePrint=(layers:Impression[])=>layers.flatMap(l=>[l.plate,l.rotation,l.face,l.offset]);
export function decodePrint(values:number[]=[]):Impression[]{const layers:Impression[]=[];for(let i=0;i+3<values.length;i+=4)layers.push({plate:values[i],rotation:values[i+1],face:values[i+2],offset:values[i+3]});return layers;}
export function applyPress(s:World,a:PressAction):{world:World;message?:string}{
 if(s.room!==4||s.facing!==0||s.focus!=='object:12')return {world:s};
 const g=structuredClone(s);
 if(a.type==='p-press-paper'){if(!g.placed[12]?.includes('plates'))return {world:s};g.flags['press:paper-down']=!g.flags['press:paper-down'];return {world:g};}
 if(a.type==='p-press-select'){if(!g.placed[12]?.includes('plates')||g.flags['press:paper-down'])return {world:s};g.print.slot=a.slot;return {world:g};}
 if(a.type==='p-new-sheet'){g.print.layers=[];g.flags['press:paper-down']=false;return {world:g};}
 if(a.type==='p-take-print'){
  if(!g.print.layers.length)return {world:s};
  const previous=g.inventory.includes('proof')?decodePrint(g.itemValues.proof):[];
  g.itemValues.proof=encodePrint(g.print.layers);if(!g.inventory.includes('proof'))g.inventory.push('proof');if(!g.collected.includes('proof'))g.collected.push('proof');g.print.layers=previous;return {world:g};
 }
 if(!['plates','pin','weights','register'].every(n=>g.placed[12]?.some(x=>x===n)))return {world:s,message:'版を置き、紙を留める部品が要る。'};
 if(!g.flags['press:paper-down'])return {world:s,message:'紙を版に重ねる。'};
 if(g.print.layers.length===2)return {world:s,message:'新しい紙に換えて、刷り直せる。'};
 const ids=g.itemValues.plates??[],v=g.values[12]??[2,0,1,0];if(ids.length!==2)return {world:s};
 const layer:Impression={plate:ids[g.print.slot],rotation:v[g.print.slot],face:v[2],offset:v[3]};
 g.print.layers.push(layer);
 if(sameImpression(g.print.layers)&&!g.solved.includes(12))g.solved.push(12);
 return {world:g};
}
