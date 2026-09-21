import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {BOOK_MASSES,bookBands,bookMass,scaleMass,scaleAngle,spineOpen,validWeighing,weighingValues} from './weighing';
const start=():World=>({...initial(),room:7,facing:3,focus:'object:19'});
const detach=(g:World,index:number)=>apply(g,{type:'p-weigh-detach',id:19,index}).world;
describe('付属物を除く本の計量',()=>{
 it('最も軽い完成品が空洞とは限らず、金具を外すと本体の差が分かる',()=>{
  let g=start();expect([0,1,2,3].map(i=>bookMass(g,i))).toEqual([8,10,10,14]);g=detach(g,1);expect(bookMass(g,2)).toBe(8);expect(bookBands(g,2)).toEqual([{index:2,slot:2}]);g=detach(g,2);expect(bookMass(g,2)).toBe(6);expect(BOOK_MASSES[0]).toBe(8);
 });
 it('実物を換え、金具を外すたびに同じ錘位置でも棹が動く',()=>{
  let g=apply(start(),{type:'p-weigh-place',id:19,object:2}).world;g=apply(g,{type:'p-weigh-rider',id:19,value:10}).world;expect(scaleAngle(g)).toBeCloseTo(0);g=detach(g,1);expect(scaleMass(g)).toBe(8);expect(scaleAngle(g)).toBeGreaterThan(0);
  g=apply(g,{type:'p-weigh-place',id:19,object:5}).world;expect(scaleMass(g)).toBe(2);g=apply(g,{type:'p-weigh-rider',id:19,value:2}).world;expect(scaleAngle(g)).toBeCloseTo(0);
  g=apply(g,{type:'p-weigh-attach',id:19,index:1,book:0,slot:1}).world;expect(weighingValues(g)[0]).toBe(-1);expect(bookMass(g,0)).toBe(10);expect(bookMass(g,2)).toBe(8);
 });
 it('金具の付け替えで複製せず、同じ位置に二つ置かない',()=>{
  let g=detach(start(),1);expect(apply(g,{type:'p-weigh-attach',id:19,index:1,book:1,slot:1}).world).toBe(g);g=apply(g,{type:'p-weigh-attach',id:19,index:1,book:1}).world;expect(bookBands(g,1)).toEqual([{index:0,slot:1},{index:1,slot:0}]);expect(validWeighing(weighingValues(g))).toBe(true);
  for(let i=0;i<6;i++)g=detach(g,i);expect(weighingValues(g).slice(2)).toEqual([-1,-1,-1,-1,-1,-1]);expect([0,1,2,3].reduce((sum,i)=>sum+bookMass(g,i),0)+6*2).toBe(42);
 });
 it('計量したという既読を条件にせず、取り出した木片の重さも引く',()=>{
  let g=detach(detach(start(),1),2);g=apply(g,{type:'p-weigh-spine',id:19,book:2}).world;expect(spineOpen(g)).toBe(true);g=apply(g,{type:'p-take',id:19,item:'wedge'}).world;expect(bookMass(g,2)).toBe(5);expect(g.inventory).toContain('wedge');expect(apply(g,{type:'p-take',id:19,item:'wedge'}).world).toBe(g);
  g=apply(g,{type:'select',item:'wedge'}).world;g=apply(g,{type:'p-weigh-return-wedge',id:19}).world;expect(bookMass(g,2)).toBe(6);g=apply(g,{type:'p-weigh-spine',id:19,book:2}).world;expect(apply(g,{type:'p-take',id:19,item:'wedge'}).world).toBe(g);
 });
 it('留め金具・皿・開いた背の物理的な干渉を保ち、途中保存を復元する',()=>{
  let g=start();expect(apply(g,{type:'p-weigh-spine',id:19,book:2}).world).toBe(g);g=detach(detach(g,1),2);g=apply(g,{type:'p-weigh-place',id:19,object:2}).world;expect(apply(g,{type:'p-weigh-spine',id:19,book:2}).world).toBe(g);g=apply(g,{type:'p-weigh-place',id:19,object:-1}).world;g=apply(g,{type:'p-weigh-spine',id:19,book:2}).world;
  expect(apply(g,{type:'p-weigh-place',id:19,object:2}).world).toBe(g);expect(apply(g,{type:'p-weigh-attach',id:19,index:1,book:2}).world).toBe(g);const saved=readSave(JSON.stringify(g))!;expect(weighingValues(saved)).toEqual(weighingValues(g));expect(spineOpen(saved)).toBe(true);
  const old=readSave(JSON.stringify({...start(),values:{19:[2]},solved:[19],collected:['wedge'],inventory:['wedge']}))!;expect(bookMass(old,2)).toBe(5);expect(spineOpen(old)).toBe(true);
 });
});
