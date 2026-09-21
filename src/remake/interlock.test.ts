import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {interlockMask} from './interlock';
describe('留め輪の連動箱',()=>{
 it('一度戻す動作を含めて解放し、保存から途中へ戻れる',()=>{
  let g:World={...initial(),room:4,facing:2,focus:'object:11'};
  g=apply(g,{type:'p-loop',id:11,index:0}).world;g=apply(g,{type:'p-loop',id:11,index:2}).world;
  expect(interlockMask(g)).toBe(2);
  expect(interlockMask(apply(g,{type:'p-loop',id:11,index:1}).world)).toBe(2);
  g=readSave(JSON.stringify(g))!;
  for(const index of [0,1,0])g=apply(g,{type:'p-loop',id:11,index}).world;
  expect(interlockMask(g)).toBe(0);
  g=apply(g,{type:'p-open',id:11}).world;g=apply(g,{type:'p-take',id:11,item:'pin'}).world;
  expect(g.inventory).toContain('pin');
 });
 it('解けた履歴だけでは、戻した留めの掛かった蓋を開けない',()=>{
  const g:World={...initial(),room:4,facing:2,focus:'object:11',solved:[11],values:{11:[1,0]}};
  expect(apply(g,{type:'p-open',id:11}).world.opened).not.toContain(11);
 });
});
