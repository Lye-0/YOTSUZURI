export type Book={version:2;order:number[];blanks:number[];side:0|1;closed:boolean;clamped:boolean;sewn:boolean};
export const BOOK_UNIT=.006;
export const BOOK_ORDER=[3,0,5,1,4,2];
export const BUNDLE_THICKNESS=[2,2,1,1,3,4,2,1,1,3];
export const initialBook=():Book=>({version:2,order:[0,1,2,3,4,5],blanks:[],side:1,closed:false,clamped:false,sewn:false});
export const validOrder=(order:unknown):order is number[]=>Array.isArray(order)&&order.length===6&&new Set(order).size===6&&order.every(n=>Number.isInteger(n)&&n>=0&&n<6);
export const validBlanks=(blanks:unknown):blanks is number[]=>Array.isArray(blanks)&&blanks.length<=2&&new Set(blanks).size===blanks.length&&blanks.every(n=>Number.isInteger(n)&&n>=0&&n<6);
export const validBook=(b:unknown):b is Book=>!!b&&typeof b==='object'&&(b as Book).version===2&&validOrder((b as Book).order)&&validBlanks((b as Book).blanks)&&[0,1].includes((b as Book).side)&&typeof (b as Book).closed==='boolean'&&typeof (b as Book).clamped==='boolean'&&typeof (b as Book).sewn==='boolean';
export function restoreBook(raw:unknown,worked=false):Book|null{if(!raw||typeof raw!=='object')return null;const b=raw as Book;if(b.version===2)return validBook(b)?b:null;if(!validOrder(b.order)||!Array.isArray(b.blanks)||b.blanks.length>2||b.blanks.some(n=>!Number.isInteger(n)||n<0||n>6)||![0,1].includes(b.side))return null;const next={...b,version:2 as const,blanks:[...new Set(b.blanks.map(n=>n===6?5:n))],side:worked?b.side:1 as const,sewn:worked&&b.clamped};return validBook(next)?next:null;}
export const correctBookOrder=(order:number[],sources:number[]=[0,1,2,3,4,5])=>order.length===6&&order.every((id,i)=>sources[id]===BOOK_ORDER[i]);
export const bookHeights=(b:Book,sources:number[]=[0,1,2,3,4,5])=>b.order.map((id,i)=>BUNDLE_THICKNESS[sources[id]]+(b.blanks.includes(i)?1:0));
export const bookProfile=(b:Book,sources:number[]=[0,1,2,3,4,5])=>b.side?bookHeights(b,sources):bookHeights(b,sources).reverse();
export const reconstructedBook=(b:Book,sources:number[]=[0,1,2,3,4,5])=>b.closed&&b.sewn&&b.side===1&&correctBookOrder(b.order,sources)&&b.blanks.length===2&&b.blanks.includes(1)&&b.blanks.includes(4);
