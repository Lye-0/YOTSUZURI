import {apply as applyReception,initial as initialReception,readSave as readReception,type World as Reception,type Action as ReceptionAction,type Facing,type Focus as ReceptionFocus} from './model';
import {fresh as oldInitial,initials,validValue,solvedValue,canSlide,keyOpens,type Game as LogicalGame} from '../engine';
import {objectById,portals,itemNames,type CampaignItem,type Portal} from './catalog';
export type Focus=ReceptionFocus|`object:${number}`|'office-tickets';
export type World=Omit<Reception,'version'|'focus'|'inventory'|'selected'>&{version:3;room:number;focus:Focus;inventory:CampaignItem[];selected:CampaignItem|null;visited:number[];lastFacing:Record<number,Facing>;values:Record<number,number[]>;sequences:Record<number,number[]>;solved:number[];opened:number[];collected:CampaignItem[];placed:Record<number,CampaignItem[]>;flags:Record<string,boolean>;notes:string[];itemValues:Record<string,number[]>;finished:boolean};
export const SAVE='yotsuzuri:remake:v3';
export const initial=():World=>({...initialReception(),version:3,room:0,visited:[0],lastFacing:{0:0},values:{},sequences:{},solved:[],opened:[],collected:[],placed:{},flags:{},notes:[],itemValues:{},finished:false});
export type Action=Exclude<ReceptionAction,{type:'focus'}|{type:'select'}>|{type:'focus';focus:Focus}|{type:'select';item:CampaignItem}|{type:'go';room:number;map?:boolean}|{type:'p-set';id:number;values:number[]}|{type:'p-button';id:number;button:number}|{type:'p-release';id:number;index:number}|{type:'p-slide';index:number;position:number}|{type:'p-test';id:number}|{type:'p-open';id:number}|{type:'p-take';id:number;item:CampaignItem}|{type:'p-place';id:number}|{type:'p-retrieve';id:number;item:CampaignItem}|{type:'observe';note:string}|{type:'item-arrange';item:CampaignItem;values:number[]}|{type:'secret'}|{type:'exit-insert'}|{type:'exit-turn'}|{type:'exit-open'}|{type:'finish'};
export const value=(g:World,id:number)=>g.values[id]??initials[id];
export const placed=(g:World,id:number,item:CampaignItem)=>g.placed[id]?.includes(item)??false;
export function gateOpen(g:World,gate?:Portal['gate']){if(!gate)return true;switch(gate){case'office':return g.doorOpen;case'workshop':return g.opened.includes(7);case'archive':return g.opened.includes(15);case'shelves':return value(g,16)[0]===4&&g.solved.includes(16);case'secret':return !!g.flags.secret;}}
export function route(g:World,to:number){const queue:[number,number[]][]=[[g.room,[]]],seen=new Set([g.room]);while(queue.length){const [n,path]=queue.shift()!;if(n===to)return path;for(const p of portals.filter(p=>p.from===n&&gateOpen(g,p.gate)))if(!seen.has(p.to)){seen.add(p.to);queue.push([p.to,[...path,p.to]])}}return null;}
function logical(g:World):LogicalGame{return {...oldInitial(),started:true,room:g.room,values:g.values,sequences:g.sequences,solved:g.solved,opened:g.opened,inventory:[...g.inventory,...Object.values(g.placed).flat()],collected:g.collected,secretOpen:!!g.flags.secret};}
const hasMaterials=(g:World,id:number)=>objectById(id)!.physical.every(n=>placed(g,id,n));
export function apply(s:World,a:Action):{world:World;message?:string}{
const g=structuredClone(s);let message:string|undefined;
const active=(id:number)=>{const o=objectById(id);return !!o&&g.room===o.room&&g.facing===o.facing&&g.focus===`object:${id}`};
const solve=(id:number)=>{if(hasMaterials(g,id)&&solvedValue(logical(g),id)&&!g.solved.includes(id))g.solved.push(id)};
if(a.type==='go'){const p=portals.find(p=>p.from===g.room&&p.facing===g.facing&&p.to===a.room);if(a.map?(!g.visited.includes(a.room)||!route(g,a.room)):(!p||!gateOpen(g,p.gate)))return {world:s,message:'まだ通れない。'};g.lastFacing[g.room]=g.facing;g.room=a.room;g.facing=a.map?(g.lastFacing[a.room]??0):p!.facing;g.focus='room';g.selected=null;if(!g.visited.includes(g.room))g.visited.push(g.room);return{world:g};}
if(a.type==='focus'&&a.focus.startsWith('object:')){const id=+a.focus.slice(7),o=objectById(id);if(!o||o.room!==g.room||o.facing!==g.facing)return{world:s};g.focus=a.focus;g.selected=null;return{world:g};}
if(a.type==='focus'&&a.focus==='office-tickets'){if(g.room!==1||g.facing!==0)return{world:s};g.focus=a.focus;g.selected=null;return{world:g};}
if(a.type==='select'){if(g.inventory.includes(a.item))g.selected=g.selected===a.item?null:a.item;return{world:g};}
if(a.type==='observe'){if(!g.notes.includes(a.note))g.notes.push(a.note);return{world:g};}
if(a.type==='item-arrange'){if(!g.inventory.includes(a.item)||a.values.length>16||a.values.some(n=>!Number.isInteger(n)||n<0||n>12))return{world:s};g.itemValues[a.item]=a.values;return{world:g};}
if(a.type.startsWith('p-')){
const id='id'in a?a.id:16;if(!active(id))return{world:s};const o=objectById(id)!;
switch(a.type){
case'p-set':if(!validValue(id,a.values))return{world:s};g.values[id]=a.values;if(![5,6,10,12,17,19,21,22,23,25,27,29,30].includes(id))solve(id);break;
case'p-button':if(![7,13].includes(id)||a.button<0||a.button>(id===7?3:5))return{world:s};g.sequences[id]=[...(g.sequences[id]??[]),a.button].slice(-4);solve(id);break;
case'p-release':{const v=[...value(g,id)],order=id===1?[1,3,0,2]:id===15?[1,2,0]:[2,0,1];if(![1,15,18].includes(id)||a.index<0||a.index>=v.length)return{world:s};if(order.find(i=>!v[i])!==a.index)return{world:s,message:'重なった縁に掛かっている。'};v[a.index]=1;g.values[id]=v;solve(id);break;}
case'p-slide':{const v=[...value(g,16)];if(!canSlide(v,a.index,a.position))return{world:s,message:'棚が当たって動かない。'};v[a.index]=a.position;g.values[16]=v;solve(16);break;}
case'p-test':if(!hasMaterials(g,id))return{world:s,message:'部品がまだ揃っていない。'};solve(id);g.flags[`attempt:${id}`]=true;break;
case'p-open':if(!g.solved.includes(id))return{world:s,message:'留め金が掛かっている。'};if(!g.opened.includes(id))g.opened.push(id);break;
case'p-take':if(!o.rewards.includes(a.item)||!g.solved.includes(id)||(o.box&&!g.opened.includes(id))||g.collected.includes(a.item))return{world:s};g.inventory.push(a.item);g.collected.push(a.item);if(id===21)g.placed[id]=[];break;
case'p-place':if(!g.selected||!o.physical.includes(g.selected)||placed(g,id,g.selected))return{world:s,message:g.selected?'形が合わない。':undefined};g.placed[id]=[...(g.placed[id]??[]),g.selected];g.inventory=g.inventory.filter(n=>n!==g.selected);g.selected=null;break;
case'p-retrieve':if(!placed(g,id,a.item))return{world:s};g.placed[id]=g.placed[id].filter(n=>n!==a.item);g.inventory.push(a.item);g.selected=null;if(id===30&&a.item==='keyparts')g.itemValues.keyparts=[...value(g,30)];break;
}
return{world:g,message};
}
if(a.type==='secret'){if(g.room===8&&g.facing===0)g.flags.secret=true;return{world:g};}
if(a.type==='exit-insert'){if(g.room!==10||g.facing!==3||!g.solved.includes(30)||g.selected!=='keyparts')return{world:s,message:'鍵穴の肩が欠けている。'};g.inventory=g.inventory.filter(n=>n!=='keyparts');g.selected=null;g.flags.exitKey=true;return{world:g};}
if(a.type==='exit-turn'){if(g.room===10&&g.facing===3&&g.flags.exitKey&&keyOpens(g.itemValues.keyparts??value(g,30)))g.flags.exitUnlocked=true;return{world:g};}
if(a.type==='exit-open'){if(g.room===10&&g.facing===3&&g.flags.exitUnlocked)g.flags.exitOpen=true;return{world:g};}
if(a.type==='finish'){if(g.room===10&&g.flags.exitOpen)g.finished=true;return{world:g};}
// The approved reception interactions remain the same, under one campaign save.
if(g.room!==0&&!['turn','back','settings','start'].includes(a.type))return{world:s};
const base=applyReception({...g,version:2,focus:g.focus as ReceptionFocus,inventory:g.inventory as Reception['inventory'],selected:g.selected as Reception['selected']},a as ReceptionAction);
return{world:{...g,...base.world,version:3,inventory:base.world.inventory as CampaignItem[],selected:base.world.selected as CampaignItem|null},message:base.message};
}
export function readSave(raw:string|null):World|null{try{const g=JSON.parse(raw??'null');if(!g)return null;if(g.version===2){const r=readReception(raw);return r?{...initial(),...r,version:3}:null;}if(g.version!==3||!Number.isInteger(g.room)||g.room<0||g.room>10||![0,1,2,3].includes(g.facing))return null;if(!Array.isArray(g.inventory)||g.inventory.some((n:string)=>!Object.hasOwn(itemNames,n))||new Set(g.inventory).size!==g.inventory.length)return null;for(const k of ['visited','solved','opened','collected','notes'])if(!Array.isArray(g[k]))return null;for(const k of ['values','sequences','placed','flags','itemValues','lastFacing'])if(!g[k]||typeof g[k]!=='object'||Array.isArray(g[k]))return null;for(const [k,v]of Object.entries(g.values))if(!validValue(+k,v as number[]))return null;return{...initial(),...g,selected:null};}catch{return null}}
