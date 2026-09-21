import {interlockMask} from './interlock';
import {threadPhoto,threadProgress} from './threading';
import {value,type World} from './campaign';
import {directions,rooms} from './catalog';
export const photoPath=(name:string,group='closeups')=>import.meta.env.BASE_URL+`remake/${group}/${name}.webp`;
export function mainPhoto(g:World):string{
const close=(n:string)=>photoPath(n),room=(n:string)=>photoPath(n,`scenes/${rooms[g.room].key}`);
if(g.room===0){if(g.focus==='room')return room(g.facing===0?'north-closed':g.facing===1?g.doorOpen?'east-open':'east-closed':directions[g.facing]);const names={box:g.boxOpen?'box-full':'box-closed',book:'book-open',lock:'lock-empty',notice:'notice',front:'front-chain',passage:'service-window','object:1':'p01-empty'};return close(names[g.focus as keyof typeof names]??'box-closed')}
if(g.focus==='room')return room(g.room===2&&g.facing===3?'west-empty':directions[g.facing]);
if(g.focus==='press-samples')return close('press-samples');
if(g.focus==='office-tickets')return close('office-tickets');
const id=+g.focus.slice(7),open=g.opened.includes(id),p=`p${String(id).padStart(2,'0')}`;
if([2,3,26].includes(id)){if(open&&id===2&&!g.collected.includes('receipts'))return close('p02-open-full');if(open&&id===3&&!g.collected.includes('folios'))return close('p03-open-full');return close(`${p}-${open?'open-empty':'closed'}`)}
if(id===27)return close('p27-close');
if(id===22)return close('p22-cradle');
if(id===9)return close('p09-cases-base');
if(id===11)return close('p11-closed');
if(id===13)return close(threadPhoto(g));
if(id===12)return close('p12-base');
if(id===10)return close('p10-closed');
if(id===8)return close('p08-base');
return close(id===4?open?'p04-open-empty':'p04-base':id===5?'p05-base':id===6?'p06-empty':`${p}-close`);
}
/** Decode every photographic layer before presenting a new frame. */
export function sceneFiles(g:World):string[]{
const files=[mainPhoto(g)],add=(n:string,group='closeups')=>files.push(photoPath(n,group));
for(const item of g.inventory){if(item==='proof'){add('print-paper','parts');continue;}if(item==='plates'){for(const i of g.itemValues.plates??[])add(`plate-${i}`,'parts');continue;}add(item==='register'?'paper-strip':item,'items');if(item==='folios')for(const n of ['folio-open','folio-folded','folio-book'])add(n,'items');if(item==='receipts')add('receipt-single','items')}
if(g.inventory.includes('keyparts')||g.focus==='object:26'&&g.opened.includes(26))for(const n of ['key-shaft','key-tooth','key-blade'])add(n,'parts');
if(g.focus==='object:9'||g.room===5&&g.facing===3&&g.focus==='room'){add('p09-cases-base');for(const i of [0,1,2,3])add(`seal-front-${i}`,'parts');for(const shape of ['angular','round'])add(`seal-back-${shape}`,'parts');if(g.opened.includes(9)){add('p09-open-empty');if(!g.collected.includes('corner'))add('corner','items');if(!g.collected.includes('threadchart'))add('threadchart','items');}}
if(g.room===3&&g.facing===3&&g.focus==='room')files.push(...sceneFiles({...g,room:5,facing:3,focus:'room'}));
if(g.room===5&&g.facing===1&&g.focus==='room')files.push(...sceneFiles({...g,room:3,facing:1,focus:'room'}));
if(g.room===4&&g.facing===3&&g.focus==='room')files.push(...sceneFiles({...g,room:3,facing:3,focus:'room'}));
if(g.room===4&&g.facing===2&&g.focus==='room')add('press-samples');
if(g.room===4&&g.facing===2&&(g.focus==='room'||g.focus==='object:11')){add('p11-closed');add('steel-pin','parts');if(interlockMask(g)!==7)add('p11-pulled');if(g.opened.includes(11)){add('p11-open-empty');if(!g.collected.includes('pin'))add('pin','items');}}
if(g.focus==='object:13'||g.room===5&&g.facing===0&&g.focus==='room'){const n=threadProgress(g);add(threadPhoto(g));add(n===5?'thread-anchor-empty':'thread-anchor-tied','parts');if(n<5){if(g.flags['thread:back'])add('p13-front');else if(n)add('p13-front-empty');}else{if(!g.collected.includes('needle'))add('needle','items');if(!g.collected.includes('thread'))add('thread','items');}}
if(g.focus==='object:12'||g.room===4&&g.facing===0&&g.focus==='room'){add('p12-empty-shelf');for(const n of ['print-paper','press-weight',...((g.itemValues.plates??[]).map(i=>`plate-${i}`))])add(n,'parts');add('pin','items');add('paper-strip','items')}
if(g.focus==='object:27'){add('steel-pin','parts');add('key-blade','parts');if(g.flags['attempt:27']&&value(g,27).every((n,i)=>n+[2,1,4][i]===5))add('p27-open')}
if(g.focus==='object:22')for(const n of ['book-edge-closed','book-edge-left','book-edge-right'])add(n,'parts');
if(g.room===3&&g.facing===1){if(g.focus==='room')add('east','scenes/press');for(const n of ['balance-beam','balance-pan','balance-weight-small','balance-weight-medium','balance-weight-large','balance-pin'])add(n,'parts');if(g.focus==='room')add('east-pin-clear','scenes/type');else add('p08-pin-clear');if(g.opened.includes(8)){add('weights','items');if(g.focus==='room')add('east-open','scenes/type');else add('p08-open-empty')}}
if(g.room===3&&g.facing===3){if(g.focus==='room')add('west','scenes/binding');add('p10-closed');for(const i of [0,1,2,3])add(`plate-${i}`,'parts');const open=[0,1,2,3].find(i=>g.flags[`drawer:10:${i}`]);if(open!==undefined)add(`p10-open-${open}`)}
if(g.room===0){
if(g.focus==='room'&&g.facing===0){add('north-notice','scenes/reception');if(g.bookOpen)add('north-book','scenes/reception');if(g.boxOpen){add('north-full','scenes/reception');if(g.keyTaken||g.cardTaken)add('north-empty','scenes/reception')}else if(g.latchUp)add('north-released','scenes/reception')}
if(g.focus==='room'&&g.facing===1&&!g.doorOpen&&g.keyInserted)add(g.doorUnlocked?'east-unlocked':'east-key','scenes/reception');
if(g.focus==='box'){if(g.boxOpen&&(g.keyTaken||g.cardTaken))add('box-empty');if(!g.boxOpen&&g.latchUp)add('box-released')}
if(g.focus==='lock'&&g.keyInserted)add(g.doorUnlocked?'lock-turned':'lock-key');
if(g.facing===2&&(g.focus==='room'||g.focus==='object:1')){add('p01-empty');add('p01-case');for(const n of ['card-diamond','card-moon'])add(n,'items')}
}
if(g.room===1){if(g.focus==='room'){if(g.facing===1){if(g.opened.includes(2)){add('east-drawer-open','scenes/office');add('receipts','items')}if(g.opened.includes(26))add('east-case-open','scenes/office')}if(g.facing===0&&g.opened.includes(3)){add('north-open','scenes/office');add('folios','items')}}if(g.focus==='object:26'&&g.opened.includes(26))add('keyparts','items')}
if(g.room===2){if(g.facing===0){if(g.focus==='room'||g.focus==='object:4'){add('ring-outer','parts');add('ring-inner','parts');if(g.opened.includes(4)){add('p04-open-full');if(g.focus==='room'){add('north-box-open','scenes/proof');add('knife','items');add('lens','items')}}}if(g.focus==='room'&&g.opened.includes(7))add('north-door-open','scenes/proof')}
if(g.focus==='object:5'||g.focus==='room'&&g.facing===1){add('paper-strip','items');if(g.focus==='object:5'&&g.flags['cut:5'])add('p05-empty-strip')}
if(g.focus==='object:6'||g.facing===3&&g.focus==='room')add('p06-loose');
}
return [...new Set(files)];
}
