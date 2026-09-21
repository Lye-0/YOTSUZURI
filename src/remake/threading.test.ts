import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {applyThread,threadOrder,threadProgress,threadBackLinks} from './threading';
describe('表の綴じと裏の連結をほどく',()=>{
 it('一続きの糸の自由端から、実際の裏側の連結を逆にたどる',()=>{
  expect(threadOrder).toEqual([2,4,1,3,0]);
  for(let i=0;i<4;i++)expect(threadBackLinks.some(([a,b])=>a===threadOrder[i+1]&&b===threadOrder[i])).toBe(true);
 });
 it('見本を持っていなくても操作でき、誤操作で途中のほどけた状態を失わない',()=>{
  let g:World={...initial(),room:5,facing:0,focus:'object:13'};
  g=applyThread(g,{type:'p-thread-pull',id:13,station:2}).world;
  g=applyThread(g,{type:'p-thread-pull',id:13,station:0}).world;
  expect(threadProgress(g)).toBe(1);
  g=readSave(JSON.stringify(g))!;
  for(const station of threadOrder.slice(1))g=applyThread(g,{type:'p-thread-pull',id:13,station}).world;
 expect(g.solved).toContain(13);expect(threadProgress(g)).toBe(5);
 });
 it('針だけを取って再開しても糸は残り、両方とも重複取得しない',()=>{
  let g:World={...initial(),room:5,facing:0,focus:'object:13'};
  for(const station of threadOrder)g=apply(g,{type:'p-thread-pull',id:13,station}).world;
  g=apply(g,{type:'p-take',id:13,item:'needle'}).world;g=readSave(JSON.stringify(g))!;
  expect(g.inventory).toEqual(['needle']);expect(g.collected).not.toContain('thread');
  g=apply(g,{type:'p-take',id:13,item:'needle'}).world;g=apply(g,{type:'p-take',id:13,item:'thread'}).world;
  expect(g.inventory).toEqual(['needle','thread']);
 });
});
