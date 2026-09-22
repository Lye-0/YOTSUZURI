import type {World} from './campaign';
import type {CampaignItem} from './catalog';
import {validOrder,reconstructedBook,BOOK_UNIT,bookHeights,bookProfile} from './book';
import {gatheringSources} from './gatherings';
import {clampValues,clampFits} from './clamp';
import {keyOpens} from './numericRules';
export const finalPlaced=(g:World,item:CampaignItem)=>!!g.placed[30]?.includes(item);
export const frameAtPress=(g:World)=>finalPlaced(g,'frame')&&finalPlaced(g,'clamp')&&g.flags['book:frame-mounted']!==false;
export const bookAtPress=(g:World)=>finalPlaced(g,'gatherings')&&finalPlaced(g,'clamp')&&g.flags['book:papers-mounted']!==false&&(g.flags['book:papers-mounted']===true||frameAtPress(g)||g.book.sewn||g.book.clamped);
export const finalBookHeight=(g:World)=>bookHeights(g.book,gatheringSources(g)).reduce((a,b)=>a+b,0)*BOOK_UNIT;
export const finalPlatenHeight=(g:World)=>clampValues(g)[3]?.19:bookAtPress(g)&&g.book.closed?.02+finalBookHeight(g):frameAtPress(g)&&!clampFits(clampValues(g))?.038:.0205;
export type BindingAction={type:'p-book-order';id:30;order:number[]}|{type:'p-book-blank';id:30;position:number}|{type:'p-book-key-fix'|'p-book-key-release'|'p-book-side'|'p-book-close'|'p-book-clamp'|'p-book-sew'|'p-book-unpick';id:30}|{type:'p-book-mount';id:30;item:'frame'|'gatherings'}|{type:'p-place';id:30;target?:CampaignItem}|{type:'p-retrieve';id:30;item:CampaignItem}|{type:'p-set';id:30;values:number[]}|{type:'p-test';id:30};
export function isBindingAction(a:{type:string}):a is BindingAction{return 'id'in a&&a.id===30&&(a.type.startsWith('p-book-')||['p-place','p-retrieve','p-set','p-test'].includes(a.type));}
const required:CampaignItem[]=['gatherings','blanks','needle','thread','frame','clamp','keyparts'];
export function applyBinding(s:World,a:BindingAction):{world:World;message?:string}{
 if(s.room!==10||s.facing!==3||s.focus!=='object:30')return{world:s};const g=structuredClone(s),v=[...clampValues(g)],materials=g.placed[30]??[],has=(n:CampaignItem)=>!!g.placed[30]?.includes(n),locked=g.book.clamped||g.book.sewn;
 const solve=()=>{if(has('gatherings')&&has('blanks')&&has('thread')&&reconstructedBook(g.book,gatheringSources(g))&&has('keyparts')&&keyOpens(g.values[30]??[1,1,1,1,1,1])&&!g.solved.includes(30))g.solved.push(30)};
 switch(a.type){
 case'p-place':{const item=g.selected;if(!item||!required.includes(item)||a.target&&a.target!==item||!g.inventory.includes(item)||has(item))return{world:s};g.inventory=g.inventory.filter(n=>n!==item);g.placed[30]=[...materials,item];g.selected=null;
  if(item==='frame')g.flags['book:frame-mounted']=has('clamp')&&!!v[3];
  if(item==='gatherings'){g.flags['book:papers-mounted']=frameAtPress(g)&&!!v[3];g.book.closed=false;g.book.clamped=false;g.book.sewn=false;}
  if(item==='keyparts')g.values[30]=[...(g.itemValues.keyparts??[1,1,1,1,1,1])];break;}
 case'p-book-mount':{
  if(!has(a.item))return{world:s};if(!has('clamp'))return{world:s,message:'締め具を置く台がある。'};if(!v[3])return{world:s,message:'押さえ板を上げると動かせる。'};
  if(a.item==='frame'){g.flags['book:frame-mounted']=!frameAtPress(g);}
  else{if(!bookAtPress(g)&&!frameAtPress(g))return{world:s,message:'枠がまだ載っていない。'};g.flags['book:papers-mounted']=!bookAtPress(g);if(!g.book.sewn)g.book.closed=false;}break;}
 case'p-book-order':if(!has('gatherings')||locked||!validOrder(a.order))return{world:s};g.book.blanks=g.book.blanks.map(i=>a.order.indexOf(g.book.order[i]));g.book.order=[...a.order];g.book.closed=false;break;
 case'p-book-blank':if(!has('gatherings')||!has('blanks')||locked||!Number.isInteger(a.position)||a.position<0||a.position>5)return{world:s};if(g.book.blanks.includes(a.position))g.book.blanks=g.book.blanks.filter(n=>n!==a.position);else if(g.book.blanks.length<2)g.book.blanks.push(a.position);else return{world:s,message:'白紙は二つとも束の中にある。'};g.book.closed=false;break;
 case'p-book-side':if(!has('gatherings')||g.book.clamped)return{world:s};g.book.side=g.book.side?0:1;break;
 case'p-book-close':if(!has('gatherings')||locked)return{world:s};g.book.closed=!g.book.closed;break;
 case'p-book-clamp':
  if(!has('clamp'))return{world:s};if(!v[3]){v[3]=1;g.book.clamped=false;if(!g.book.sewn)g.book.closed=false;}
  else{if(has('gatherings')&&bookAtPress(g)){if(!g.book.closed)return{world:s,message:'束が広がっている。'};if(!frameAtPress(g))return{world:s,message:'枠を合わせてから押さえる。'};if(!clampFits(v))return{world:s,message:'押さえ板の受け座がずれている。'};g.book.clamped=true;}v[3]=0;}
  g.values[28]=v;break;
 case'p-book-key-release':if(!has('keyparts'))return{world:s};g.flags['key:fixed']=false;break;
 case'p-book-key-fix':{
  if(!has('keyparts'))return{world:s,message:'鍵部品を受け台に置く。'};
  if(!has('gatherings')||!g.book.closed||!g.book.sewn)return{world:s,message:'綴じて閉じた本を、歯合わせの型として使う。'};
  if(g.book.clamped||bookAtPress(g))return{world:s,message:'押さえ板を上げ、綴じた本を手前の受け台へ移す。'};
  const profile=bookProfile(g.book,gatheringSources(g));
  if(profile.some(n=>n<1||n>4))return{world:s,message:'本の段差が歯の可動範囲に収まらない。束を確認できる。'};
  g.values[30]=profile.map(n=>5-n);g.itemValues.keyparts=[...g.values[30]];g.flags['key:fixed']=true;break;
 }
 case'p-book-sew':
  if(!has('gatherings'))return{world:s,message:'綴じる紙束を台に置く。'};
  if(!has('thread'))return{world:s,message:'麻糸を作業台に置く。'};
  if(!g.book.closed)return{world:s,message:'束を閉じて重ねる。'};
  if(!has('clamp')||!bookAtPress(g))return{world:s,message:'紙束を締め具に載せる。'};
  if(!clampFits(v))return{world:s,message:'カムを回して押さえ板の受け座を合わせる。'};
  if(!g.book.clamped)return{world:s,message:'上の取っ手で押さえ板を下ろす。'};
  if(!has('needle')){if(g.selected!=='needle'||!g.inventory.includes('needle'))return{world:s,message:'綴じ針を使う。'};g.inventory=g.inventory.filter(n=>n!=='needle');g.placed[30]=[...materials,'needle'];g.selected=null;}
  g.book.sewn=true;break;
 case'p-book-unpick':if(!g.book.sewn||g.book.clamped)return{world:s};if(!has('needle')&&!(g.selected==='needle'&&g.inventory.includes('needle')))return{world:s,message:'綴じ針を使う。'};g.book.sewn=false;break;
 case'p-retrieve':
  if(!has(a.item))return{world:s};if(g.book.clamped&&['frame','gatherings','blanks','clamp'].includes(a.item))return{world:s,message:'押さえ板が下りている。'};
  if(g.book.sewn&&['gatherings','blanks','thread'].includes(a.item))return{world:s,message:'糸をほどくと束を分けられる。'};
  if(a.item==='clamp'&&(bookAtPress(g)||frameAtPress(g)))return{world:s,message:'上の物を先に脇へ移せる。'};
  g.placed[30]=materials.filter(n=>n!==a.item);g.inventory.push(a.item);g.selected=null;
  if(a.item==='keyparts')g.itemValues.keyparts=[...(g.values[30]??[1,1,1,1,1,1])];
  if(a.item==='frame')g.flags['book:frame-mounted']=false;
  if(a.item==='gatherings'){g.flags['book:papers-mounted']=false;g.book.blanks=[];g.book.closed=false;g.book.side=1;}
  if(a.item==='blanks')g.book.blanks=[];break;
 case'p-set':if(g.flags['key:fixed'])return{world:s,message:'固定ねじを緩めると調整できる。'};if(!has('keyparts')||a.values.length!==6||a.values.some(n=>!Number.isInteger(n)||n<1||n>4))return{world:s};g.values[30]=[...a.values];break;
 case'p-test':break;
 }
 solve();return{world:g};
}
