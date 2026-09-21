import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {trimSeams,originalSeam,trimFits,initialTrim} from './trimming';
const start=():World=>({...initial(),room:5,facing:2,focus:'object:14'});
describe('断裁片の両面照合',()=>{
 it('片面だけでは二候補が残り、両面の切り口がつながる紙は一枚',()=>{
  for(const face of ['front','back'] as const)expect(trimSeams.filter(s=>JSON.stringify(s[face])===JSON.stringify(originalSeam[face]))).toHaveLength(2);
  const fits=[];for(let i=0;i<3;i++)for(let rotation=0;rotation<2;rotation++){const v=initialTrim();v[0]=i;v[i+1]=rotation;if(trimFits(v))fits.push([i,rotation]);}expect(fits).toEqual([[2,0]]);
 });
 it('未解読の組み合わせも持ち出せ、戻して組み替えられる',()=>{
  let g=apply(start(),{type:'p-trim-place',id:14,index:0}).world;g=apply(g,{type:'p-trim-take',id:14}).world;
  expect(g.inventory).toContain('oldplan');expect(g.solved).not.toContain(14);
  expect(apply(g,{type:'p-trim-take',id:14}).world.inventory.filter(n=>n==='oldplan')).toHaveLength(1);
  g=readSave(JSON.stringify(g))!;g=apply(g,{type:'select',item:'oldplan'}).world;g=apply(g,{type:'p-trim-return',id:14}).world;
  expect(g.flags['trim:taken']).toBe(false);expect(g.inventory).not.toContain('oldplan');
  g=apply(g,{type:'p-trim-remove',id:14}).world;g=apply(g,{type:'p-trim-place',id:14,index:2}).world;g=apply(g,{type:'p-trim-rotate',id:14,index:2}).world;expect(g.solved).toContain(14);
 });
 it('観察履歴を要求せず、両面を裏へ返した状態でも保持する',()=>{
  let g=start();for(const a of [{type:'p-trim-place',id:14,index:2},{type:'p-trim-rotate',id:14,index:2},{type:'p-trim-flip',id:14,index:-1},{type:'p-trim-flip',id:14,index:2}] as const)g=apply(g,a).world;
  expect(trimFits(g.values[14])).toBe(true);expect(readSave(JSON.stringify(g))?.values[14]).toEqual(g.values[14]);
 });
 it('図面を手元で返している間も、残った紙片の観察状態を失わない',()=>{
  let g=apply(start(),{type:'p-trim-place',id:14,index:2}).world;g=apply(g,{type:'p-trim-rotate',id:14,index:2}).world;g=apply(g,{type:'p-trim-take',id:14}).world;
  g=apply(g,{type:'p-trim-flip',id:14,index:0}).world;
  const held=[...g.itemValues.oldplan];held[4]=1;held[7]=1;g=apply(g,{type:'item-arrange',item:'oldplan',values:held}).world;
  g=apply(g,{type:'select',item:'oldplan'}).world;g=apply(g,{type:'p-trim-return',id:14}).world;
  expect(g.values[14][5]).toBe(1);expect(g.values[14][4]).toBe(1);expect(g.values[14][7]).toBe(1);expect(g.inventory).not.toContain('oldplan');
 });
});
