import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World,type Action} from './campaign';
import {foreedgeMounted,foreedgeHeight} from './foreedge';
const start=():World=>({...initial(),room:8,facing:2,focus:'object:22',flags:{'optics:guard':true},inventory:['gatherings','cradle'],itemValues:{gatherings:[0,1,2,3,4,5],cradle:[0,0,2,0]}});
const run=(g:World,...a:Action[])=>a.reduce((g,a)=>apply(g,a).world,g);
describe('同じ小口の束と支持具の所在',()=>{
 it('どちらを先に置いても紙束が載り、並びと紙種を保持して傾けられる',()=>{
  for(const items of [['gatherings','cradle'],['cradle','gatherings']] as const){let g=start();g.book.order=[3,0,5,1,4,2];for(const item of items)g=run(g,{type:'select',item},{type:'p-place',id:22});expect(foreedgeMounted(g)).toBe(true);expect(g.book.order).toEqual([3,0,5,1,4,2]);expect(g.itemValues.gatherings).toEqual([0,1,2,3,4,5]);g=apply(g,{type:'p-set',id:22,values:[...g.book.order,2]}).world;expect(g.values[22][6]).toBe(2);}
 });
 it('旧セーブの載せ直し待ちを解消するが、片方だけの設置は動かさない',()=>{const g=start();g.inventory=[];g.placed[22]=['gatherings','cradle'];g.flags['foreedge:mounted']=false;expect(foreedgeMounted(readSave(JSON.stringify(g))!)).toBe(true);for(const items of [['gatherings'],['cradle'],[]] as World['inventory'][]){g.placed[22]=items;expect(foreedgeMounted(readSave(JSON.stringify(g))!)).toBe(false)}});
 it('束が載る支持具は下から引き抜けず、紙の並びは持ち上げても残る',()=>{
  let g=run(start(),{type:'select',item:'cradle'},{type:'p-place',id:22},{type:'select',item:'gatherings'},{type:'p-place',id:22},{type:'p-set',id:22,values:[3,0,5,1,4,2,2]});expect(g.solved).toContain(22);expect(apply(g,{type:'p-retrieve',id:22,item:'cradle'}).world).toBe(g);
  g=run(g,{type:'p-retrieve',id:22,item:'gatherings'},{type:'p-retrieve',id:22,item:'cradle'});expect(g.inventory).toEqual(['gatherings','cradle']);expect(g.book.order).toEqual([3,0,5,1,4,2]);expect(foreedgeMounted(g)).toBe(false);
 });
 it('書庫と同じ厚みを使い、混じった紙も現在の原紙のまま判定する',()=>{
  expect(foreedgeHeight(start())).toBeCloseTo(.078);let g=start();g.itemValues.gatherings=[0,1,6,7,2,3];expect(foreedgeHeight(g)).toBeCloseTo(.054);g=run(g,{type:'select',item:'cradle'},{type:'p-place',id:22},{type:'select',item:'gatherings'},{type:'p-place',id:22},{type:'p-set',id:22,values:[3,0,5,1,4,2,2]});expect(g.solved).not.toContain(22);
 });
});
