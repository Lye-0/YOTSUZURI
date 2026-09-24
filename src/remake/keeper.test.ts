import {printLockCode} from './evidenceLocks';
import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {keeperValues,keeperClear,validKeeper} from './keeper';
const start=():World=>({...initial(),room:3,facing:0,focus:'object:15'});
describe('中央の逃げ口を通る三つの留め',()=>{
 it('頭が通る開口と、現在の部品同士の接触で制約する',()=>{
  const g=start();expect(apply(g,{type:'p-keeper-pull',id:15,index:0}).world).toBe(g);
  expect(apply(g,{type:'p-keeper-slide',id:15,index:0,position:1}).world).toBe(g);
  const center=apply(g,{type:'p-keeper-pull',id:15,index:1}).world;
  expect(keeperValues(center)).toEqual([0,1,2,0,1,0]);
  expect(apply(center,{type:'p-keeper-slide',id:15,index:0,position:2}).world).toBe(center);
 });
 it('中央を外した後は上下どちらからでも開けられ、戻すこともできる',()=>{
  for(const order of [[0,2],[2,0]]){let g=apply(start(),{type:'p-keeper-pull',id:15,index:1}).world;
   for(const index of order){g=apply(g,{type:'p-keeper-slide',id:15,index,position:1}).world;g=apply(g,{type:'p-keeper-pull',id:15,index}).world;}
   expect(keeperClear(g)).toBe(true);expect(apply(g,{type:'p-open',id:15}).world.opened).not.toContain(15);
   const undone=apply(g,{type:'p-keeper-return',id:15,index:0}).world;
   expect(keeperClear(undone)).toBe(false);expect(apply(undone,{type:'p-keeper-leaf',id:15}).world.flags['keeper:leaf']).not.toBe(true);
   for(let index=0;index<6;index++)for(let n=0;n<printLockCode[index];n++)g=apply(g,{type:'p-keeper-setting',id:15,index}).world;
   g=apply(g,{type:'p-keeper-leaf',id:15}).world;expect(apply(g,{type:'p-open',id:15}).world.opened).toContain(15);
  }
 });
 it('途中状態を保存し、不可能な重なりを受け入れない',()=>{
  let g=apply(start(),{type:'p-keeper-pull',id:15,index:1}).world;g=apply(g,{type:'p-keeper-slide',id:15,index:2,position:1}).world;
  expect(keeperValues(readSave(JSON.stringify(g))!)).toEqual([0,1,1,0,1,0]);
  expect(validKeeper([1,1,2,0,0,0])).toBe(false);
  expect(apply(g,{type:'p-release',id:15,index:0}).world).toBe(g);
 });
});
