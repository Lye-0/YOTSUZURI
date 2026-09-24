import {describe,it,expect} from 'vitest';
import {initial,apply,readSave,type World} from './campaign';
import {tissueTrace,tissueOnMould} from './rubbing';
const start=():World=>({...initial(),room:9,facing:0,focus:'object:25',inventory:['tissue'],selected:'tissue'});
describe('接触した面を残す保護紙',()=>{
 it('途中の写しを同じ紙として持ち出し、戻して完成できる',()=>{
  let g=apply(start(),{type:'p-mould-turn',id:25,flip:true}).world;g=apply(g,{type:'p-place',id:25}).world;
  for(const zone of [0,2,4])g=apply(g,{type:'p-rubbing-zone',id:25,zone}).world;
  g=apply(g,{type:'p-retrieve',id:25,item:'tissue'}).world;g=readSave(JSON.stringify(g))!;expect(tissueTrace(g)).toEqual([1,0,21,0,0]);expect(g.inventory).toEqual(['tissue']);
  g=apply(g,{type:'select',item:'tissue'}).world;g=apply(g,{type:'p-place',id:25}).world;for(const zone of [1,3,5])g=apply(g,{type:'p-rubbing-zone',id:25,zone}).world;
  expect(tissueTrace(g)[2]).toBe(63);expect(g.solved).not.toContain(25);
 });
 it('紙を載せたまま原型を返さず、誤写しは消して試し直せる',()=>{
  let g=apply(start(),{type:'p-place',id:25}).world;expect(apply(g,{type:'p-mould-turn',id:25,flip:true}).world).toBe(g);
  g=apply(g,{type:'p-rubbing-zone',id:25,zone:1}).world;g=apply(g,{type:'p-rubbing-move',id:25}).world;expect(tissueOnMould(g)).toBe(false);
  g=apply(g,{type:'p-mould-turn',id:25,flip:true}).world;g=apply(g,{type:'p-rubbing-move',id:25}).world;expect(apply(g,{type:'p-rubbing-zone',id:25,zone:0}).world).toBe(g);
  g=apply(g,{type:'p-rubbing-erase',id:25}).world;g=apply(g,{type:'p-rubbing-zone',id:25,zone:0}).world;expect(tissueTrace(g)).toEqual([1,0,1,0,0]);
 });
 it('裏返した観察でも接触した面と部分模様を改変しない',()=>{
  let g=apply(start(),{type:'p-place',id:25}).world;g=apply(g,{type:'p-rubbing-zone',id:25,zone:5}).world;g=apply(g,{type:'p-retrieve',id:25,item:'tissue'}).world;
  g=apply(g,{type:'p-rubbing-view',flip:true}).world;g=apply(g,{type:'p-rubbing-view'}).world;expect(tissueTrace(g)).toEqual([0,0,32,1,1]);
 });
});
