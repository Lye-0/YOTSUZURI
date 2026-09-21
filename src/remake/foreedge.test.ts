import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World,type Action} from './campaign';
import {foreedgeMounted,foreedgeHeight} from './foreedge';
const start=():World=>({...initial(),room:8,facing:2,focus:'object:22',flags:{'optics:guard':true},inventory:['gatherings','cradle'],itemValues:{gatherings:[0,1,2,3,4,5],cradle:[0,0,2,0]}});
const run=(g:World,...a:Action[])=>a.reduce((g,a)=>apply(g,a).world,g);
describe('同じ小口の束と支持具の所在',()=>{
 it('先に置いた紙束を、後から置いた支持具へ勝手に移さない',()=>{
  let g=run(start(),{type:'select',item:'gatherings'},{type:'p-place',id:22},{type:'select',item:'cradle'},{type:'p-place',id:22});expect(foreedgeMounted(g)).toBe(false);expect(g.placed[22]).toEqual(['gatherings','cradle']);
  expect(apply(g,{type:'p-set',id:22,values:[3,0,5,1,4,2,2]}).world).toBe(g);expect(foreedgeMounted(readSave(JSON.stringify(g))!)).toBe(false);
  g=run(g,{type:'p-retrieve',id:22,item:'gatherings'},{type:'select',item:'gatherings'},{type:'p-place',id:22});expect(foreedgeMounted(g)).toBe(true);expect(g.values[22][6]).toBe(1);
 });
 it('束が載る支持具は下から引き抜けず、紙の並びは持ち上げても残る',()=>{
  let g=run(start(),{type:'select',item:'cradle'},{type:'p-place',id:22},{type:'select',item:'gatherings'},{type:'p-place',id:22},{type:'p-set',id:22,values:[3,0,5,1,4,2,2]});expect(g.solved).toContain(22);expect(apply(g,{type:'p-retrieve',id:22,item:'cradle'}).world).toBe(g);
  g=run(g,{type:'p-retrieve',id:22,item:'gatherings'},{type:'p-retrieve',id:22,item:'cradle'});expect(g.inventory).toEqual(['gatherings','cradle']);expect(g.book.order).toEqual([3,0,5,1,4,2]);expect(foreedgeMounted(g)).toBe(false);
 });
 it('書庫と同じ厚みを使い、混じった紙も現在の原紙のまま判定する',()=>{
  expect(foreedgeHeight(start())).toBeCloseTo(.078);let g=start();g.itemValues.gatherings=[0,1,6,7,2,3];expect(foreedgeHeight(g)).toBeCloseTo(.054);g=run(g,{type:'select',item:'cradle'},{type:'p-place',id:22},{type:'select',item:'gatherings'},{type:'p-place',id:22},{type:'p-set',id:22,values:[3,0,5,1,4,2,2]});expect(g.solved).not.toContain(22);
 });
});
