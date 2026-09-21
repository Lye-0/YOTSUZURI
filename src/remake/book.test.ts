import {describe,it,expect} from 'vitest';
import {initialBook,BOOK_ORDER,bookHeights,bookProfile,reconstructedBook} from './book';
import {paintedJoin} from './ForeedgeBook';
describe('一冊の実物とその小口',()=>{
it('束順と白紙が厚みを作り、見る向きで読み順が反転する',()=>{const b={...initialBook(),order:BOOK_ORDER,blanks:[1,4],side:1 as const,closed:true,clamped:true};expect(bookHeights(b)).toEqual([1,3,4,2,4,1]);expect(bookProfile({...b,side:0})).toEqual([1,4,2,4,3,1]);expect(reconstructedBook(b)).toBe(true);expect(reconstructedBook({...b,blanks:[]})).toBe(false);expect(reconstructedBook({...b,clamped:false})).toBe(false)});
it('同じ厚みの束を取り違えると、厚みだけではなく絵も違う',()=>{const b={...initialBook(),order:[3,1,5,0,4,2],blanks:[1,4],side:1 as const,closed:true,clamped:true};expect(bookHeights(b)).toEqual([1,3,4,2,4,1]);expect(reconstructedBook(b)).toBe(false);expect(paintedJoin(0)).not.toEqual(paintedJoin(1));});
it('端面の斜線が連続する並びは一通り',()=>{const permutations=(xs:number[]):number[][]=>xs.length?xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest])):[[]];const matching=permutations([0,1,2,3,4,5]).filter(order=>order.slice(1).every((id,i)=>Math.abs(paintedJoin(order[i])[1]-paintedJoin(id)[0])<.001));expect(matching).toEqual([BOOK_ORDER]);});
});
