import {it,expect} from 'vitest';
import {foldPages,folioMarks} from './folio';
it('入れ子と表裏の八通りが実際の頁順を変え、線上の読みが一つに決まる',()=>{const codes=[];for(let outer=0;outer<2;outer++)for(let a=0;a<2;a++)for(let b=0;b<2;b++){const pages=foldPages(outer,a,b);expect([...pages].sort()).toEqual([1,2,3,4,5,6,7,8]);codes.push(pages.filter((_,i)=>i%2===0).map(n=>folioMarks[n-1]).join(''))}expect(codes.filter(c=>c==='2031')).toHaveLength(1);expect(foldPages(1,0,0)).toEqual([1,2,3,4,5,6,7,8])});
import {folioFaces,foldedPages} from './folio';
it('山折りした月の紙の裏は同じ面の菱形で、内側の丸へ飛ばない',()=>{
 expect(folioFaces[1][1]).toEqual([4,5]);
 expect(foldedPages(1,1,0)).toEqual([5,6,3,4]);
 expect(folioMarks[foldedPages(1,1,0)[0]-1]).toBe(3);
 expect(foldedPages(1,1,1)[0]).toBe(4);
 expect(folioMarks[foldedPages(1,1,1)[0]-1]).toBe(2);
});
it('両方の面の折り紙は表裏・入れ子でも同じ八面を保持する',()=>{
 for(let face=0;face<2;face++)for(let sheet=0;sheet<2;sheet++){
  const front=foldedPages(sheet,face),back=foldedPages(sheet,face,1);
  expect(front[0]).toBe(folioFaces[sheet][face][1]);expect(back[0]).toBe(folioFaces[sheet][face][0]);expect(back).toEqual([...front].reverse());
 }
 for(let outer=0;outer<2;outer++)for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let back=0;back<2;back++)expect([...foldPages(outer,a,b,back,back)].sort()).toEqual([1,2,3,4,5,6,7,8]);
 expect(foldPages(1,0,0,1,1)).toEqual([8,7,6,5,4,3,2,1]);
});

it('折った裏表も含めた同じ綴じ側の組合せで正しい線の読みが一つに決まる',()=>{const codes=[];for(let outer=0;outer<2;outer++)for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let back=0;back<2;back++)codes.push(foldPages(outer,a,b,back,back).filter((_,i)=>i%2===0).map(n=>folioMarks[n-1]).join(''));expect(codes.filter(c=>c==='2031')).toHaveLength(1);});
