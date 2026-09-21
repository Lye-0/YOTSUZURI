import {describe,it,expect} from 'vitest';
import {sealFragments,sealReceivers,sealCode,matchesSealCode} from './sealOwnership';
import {apply,initial,readSave,type World} from './campaign';
describe('封印の元の持ち主',()=>{
 it('印の残りと付着した木片は、片方だけでは決まらず、合わせると一意になる',()=>{
  for(const r of sealReceivers){expect(sealFragments.filter(f=>f.foot===r.foot)).toHaveLength(2);expect(sealFragments.filter(f=>f.chip===r.chip)).toHaveLength(2);expect(sealFragments.filter(f=>f.foot===r.foot&&f.chip===r.chip)).toHaveLength(1);}
  expect(sealCode).toEqual([2,0,3,1]);
 });
 it('今置かれている印を写した並びと、元の所有関係を区別する',()=>{
 expect(matchesSealCode([0,1,2,3])).toBe(false);expect(matchesSealCode(sealCode)).toBe(true);
  for(let i=0;i<4;i++)expect(Number(sealFragments[i].foot===sealReceivers[i].foot)+Number(sealFragments[i].chip===sealReceivers[i].chip)).toBe(1);
 });
 it('独立した輪は同じ印にも回せ、保存後も途中状態を失わない',()=>{
  const g:World={...initial(),room:5,facing:3,focus:'object:9'};
  const turned=apply(g,{type:'p-set',id:9,values:[1,1,1,1]}).world;
  expect(readSave(JSON.stringify(turned))?.values[9]).toEqual([1,1,1,1]);
  expect(apply(turned,{type:'p-open',id:9}).world.opened).not.toContain(9);
  const right=apply(turned,{type:'p-set',id:9,values:sealCode}).world;
  expect(apply(right,{type:'p-open',id:9}).world.opened).toContain(9);
  const changed=apply(right,{type:'p-set',id:9,values:[0,1,2,3]}).world;
  expect(apply(changed,{type:'p-open',id:9}).world.opened).not.toContain(9);
 });
});
