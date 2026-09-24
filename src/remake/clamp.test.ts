import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {clampFits,platenPose,clampPlatenHeight,clampTaken} from './clamp';
const start=():World=>({...initial(),room:5,facing:1,focus:'object:28',inventory:['frame'],selected:'frame',itemValues:{frame:[0,1,2,3,0,1,2,3,0,0,0,0]}});
describe('偏心カムの共通接線で板を枠へ合わせる',()=>{
 it('番号列ではなく四隅の実位置を検査し、同じ位置を作る二姿勢を許す',()=>{
  const fits=[];for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)if(clampFits([a,b,c,1]))fits.push([a,b,c]);expect(fits).toEqual([[2,0,0],[2,0,2]]);
  expect(platenPose([2,0,0,1]).x).toBeCloseTo(.072);expect(platenPose([2,0,0,1]).y).toBeCloseTo(.072);
 });
 it('外れた板は枠の縁に止まり、下りたままカムをすり抜けない',()=>{
  let g=apply(start(),{type:'p-place',id:28}).world;g=apply(g,{type:'p-clamp-height',id:28}).world;expect(clampPlatenHeight(g)).toBe(.038);
  expect(apply(g,{type:'p-clamp-turn',id:28,index:0}).world).toBe(g);g=apply(g,{type:'p-clamp-height',id:28}).world;
  for(let i=0;i<2;i++)g=apply(g,{type:'p-clamp-turn',id:28,index:0}).world;g=apply(g,{type:'p-clamp-turn',id:28,index:2}).world;g=apply(g,{type:'p-clamp-height',id:28}).world;
  expect(clampPlatenHeight(g)).toBe(.0205);expect(g.solved).toContain(28);expect(readSave(JSON.stringify(g))?.values[28]).toEqual([2,0,2,0]);
 });
 it('同じ枠を取り出して締め具を持ち運び、姿勢を保持して台へ戻せる',()=>{
  let g=apply(start(),{type:'p-place',id:28}).world;expect(apply(g,{type:'p-clamp-take',id:28}).world).toBe(g);g=apply(g,{type:'p-retrieve',id:28,item:'frame'}).world;g=apply(g,{type:'p-clamp-take',id:28}).world;
  expect(g.inventory).toEqual(['frame','clamp']);expect(clampTaken(g)).toBe(true);g=apply(g,{type:'select',item:'clamp'}).world;g=apply(g,{type:'p-clamp-return',id:28}).world;expect(g.inventory).toEqual(['frame']);expect(clampTaken(g)).toBe(false);
 });
});
