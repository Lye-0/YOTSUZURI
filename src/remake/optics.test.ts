import {describe,it,expect} from 'vitest';
import {initial,readSave,type World} from './campaign';
import {applyOptics,traceLight,initialOptics} from './optics';
describe('遮光板を迂回する二つの反射片',()=>{
 it('最初に当たる面で遮り、反射後も同じ幾何から追跡する',()=>{
  const answers:number[][]=[];for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let r=0;r<2;r++)for(let s=0;s<2;s++)if(traceLight([a,b,r,s]).lit)answers.push([a,b,r,s]);
  expect(answers).toEqual([[3,3,0,0]]);expect(traceLight([3,3,0,0]).mirrors).toEqual([0,1]);expect(traceLight(initialOptics()).lit).toBe(false);
  expect(traceLight([0,0,0,0]).points.at(-1)?.[1]).toBeCloseTo(.58);expect(traceLight([1,1,0,0]).points.at(-1)?.[1]).toBeCloseTo(.42);expect(traceLight([2,2,0,0]).points.at(-1)?.[1]).toBeCloseTo(.69);
 });
 it('照らしただけで台を開けず、留めを操作し、載せた物には閉じない',()=>{
  const s:World={...initial(),room:8,facing:2,focus:'object:20',values:{20:[3,3,0,0]}};
  expect(s.flags['optics:guard']).toBeUndefined();let g=applyOptics(s,{type:'p-optical-guard',id:20}).world;expect(g.flags['optics:guard']).toBe(true);
  g=applyOptics(g,{type:'p-mirror-turn',id:20,index:0}).world;expect(g.flags['optics:guard']).toBe(true);expect(traceLight(g.values[20]).lit).toBe(false);
  g={...g,placed:{22:['gatherings']}};expect(applyOptics(g,{type:'p-optical-guard',id:20}).world).toBe(g);g={...g,placed:{}};g=applyOptics(g,{type:'p-optical-guard',id:20}).world;expect(g.flags['optics:guard']).toBe(false);
  expect(applyOptics(g,{type:'p-optical-guard',id:20}).world).toBe(g);
 });
 it('途中の光路と開いた棒を別々に保存し、旧版の値を移行する',()=>{
  const g:World={...initial(),room:8,facing:2,focus:'object:20',values:{20:[2,1,0,1]},flags:{'optics:guard':true}};
  const saved=readSave(JSON.stringify(g))!;expect(saved.values[20]).toEqual([2,1,0,1]);expect(saved.flags['optics:guard']).toBe(true);expect(traceLight(saved.values[20]).lit).toBe(false);
  const migrated=readSave(JSON.stringify({...g,values:{20:[0,0]},solved:[20]}))!;expect(migrated.values[20]).toEqual([3,3,0,0]);expect(migrated.flags['optics:guard']).toBe(true);
 });
});
