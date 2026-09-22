import {it,expect} from 'vitest';
import {foldPages,folioMarks} from './folio';
it('入れ子と表裏の八通りが実際の頁順を変え、線上の読みが一つに決まる',()=>{const codes=[];for(let outer=0;outer<2;outer++)for(let a=0;a<2;a++)for(let b=0;b<2;b++){const pages=foldPages(outer,a,b);expect([...pages].sort()).toEqual([1,2,3,4,5,6,7,8]);codes.push(pages.filter((_,i)=>i%2===0).map(n=>folioMarks[n-1]).join(''))}expect(codes.filter(c=>c==='2031')).toHaveLength(1);expect(foldPages(1,0,0)).toEqual([1,2,3,4,5,6,7,8])});
