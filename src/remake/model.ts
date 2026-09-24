export type Facing=0|1|2|3;
export type Item='key'|'card';
export type Focus='room'|'box'|'book'|'lock'|'notice'|'front'|'passage';
export type World={version:2;started:boolean;facing:Facing;focus:Focus;latchUp:boolean;boxOpen:boolean;keyTaken:boolean;cardTaken:boolean;keyInserted:boolean;doorUnlocked:boolean;doorOpen:boolean;bookOpen:boolean;selected:Item|null;inventory:Item[];outlines:boolean;reducedMotion:boolean;brightness:number};
export const SAVE='yotsuzuri:remake:r01:v2';
export const initial=():World=>({version:2,started:false,facing:0,focus:'room',latchUp:false,boxOpen:false,keyTaken:false,cardTaken:false,keyInserted:false,doorUnlocked:false,doorOpen:false,bookOpen:false,selected:null,inventory:[],outlines:false,reducedMotion:false,brightness:1});
export type Action={type:'start'}|{type:'turn';delta:1|-1}|{type:'focus';focus:Focus}|{type:'back'}|{type:'latch'}|{type:'lid'}|{type:'take';item:Item}|{type:'select';item:Item}|{type:'keyhole'}|{type:'turn-key'}|{type:'door'}|{type:'book'}|{type:'settings';key:'outlines'|'reducedMotion'|'brightness';value:boolean|number};
export function apply(s:World,a:Action):{world:World;message?:string}{const g=structuredClone(s);let message:string|undefined;
switch(a.type){
case 'start':g.started=true;break;
case 'turn':if(g.focus!=='room')return {world:s};g.facing=((g.facing+a.delta+4)%4) as Facing;g.selected=null;break;
case 'focus':{const facing:Partial<Record<Focus,Facing>>={box:0,book:0,notice:0,lock:1,front:2,passage:3};if(a.focus!=='room'&&facing[a.focus]!==g.facing)return{world:s};}g.focus=a.focus;g.selected=null;if(a.focus==='book')g.bookOpen=true;break;
case 'back':g.focus='room';g.selected=null;break;
case 'select':if(!g.inventory.includes(a.item))return {world:s};g.selected=g.selected===a.item?null:a.item;break;
case 'latch':if(g.focus!=='box'||g.boxOpen)return {world:s};g.latchUp=!g.latchUp;break;
case 'lid':if(g.focus!=='box')return {world:s};if(!g.latchUp)return{world:s,message:'留め金が掛かっている。'};g.boxOpen=!g.boxOpen;break;
case 'take':if(g.focus!=='box'||!g.boxOpen||g[a.item==='key'?'keyTaken':'cardTaken'])return {world:s};g[a.item==='key'?'keyTaken':'cardTaken']=true;g.inventory.push(a.item);g.selected=null;break;
case 'keyhole':if(g.focus!=='lock')return{world:s};if(g.keyInserted)break;if(g.selected==='key'&&g.inventory.includes('key')){g.inventory=g.inventory.filter(x=>x!=='key');g.keyInserted=true;g.selected=null;}else message=g.selected?'形が合わない。':'古い鍵穴がある。';break;
case 'turn-key':if(g.focus!=='lock'||!g.keyInserted)return{world:s};g.doorUnlocked=true;break;
case 'door':if(g.facing!==1)return{world:s};if(!g.doorUnlocked){g.focus='lock';g.selected=null;message='錠が掛かっている。';}else{g.doorOpen=!g.doorOpen;g.focus='room';g.selected=null;}break;
case 'book':g.bookOpen=!g.bookOpen;if(!g.bookOpen)g.focus='room';break;
case 'settings':if(a.key==='brightness')g.brightness=Math.max(.75,Math.min(1.4,Number(a.value)||1));else g[a.key]=a.value===true;break;
}
return {world:g,message};}
export const boxState=(g:World)=>!g.boxOpen?(g.latchUp?'released':'closed'):g.keyTaken?(g.cardTaken?'empty':'card'):(g.cardTaken?'key':'full');
export const sceneName=(g:World)=>g.facing===0?'north-'+boxState(g):g.facing===1?'east-'+(g.doorOpen?'open':g.keyInserted?(g.doorUnlocked?'unlocked':'key'):'closed'):g.facing===2?'south':'west';
export function readSave(raw:string|null):World|null{try{const v=JSON.parse(raw??'null');if(!v||v.version!==2||![0,1,2,3].includes(v.facing)||!['room','box','book','lock','notice','front','passage'].includes(v.focus))return null;for(const k of ['started','latchUp','boxOpen','keyTaken','cardTaken','keyInserted','doorUnlocked','doorOpen','bookOpen','outlines','reducedMotion'])if(typeof v[k]!=='boolean')return null;if(!Array.isArray(v.inventory)||v.inventory.some((x:unknown)=>!['key','card'].includes(x as string))||new Set(v.inventory).size!==v.inventory.length)return null;if(v.boxOpen&&!v.latchUp||v.keyInserted&&!v.keyTaken||v.doorUnlocked&&!v.keyInserted||v.doorOpen&&!v.doorUnlocked)return null;if(v.inventory.includes('key')!== (v.keyTaken&&!v.keyInserted)||v.inventory.includes('card')!==v.cardTaken)return null;return {...v,selected:null,brightness:Math.max(.75,Math.min(1.4,Number(v.brightness)||1))};}catch{return null}}
