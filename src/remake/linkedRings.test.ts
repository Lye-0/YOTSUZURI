import {describe,it,expect} from 'vitest';
import {canMoveRing,moveRing} from './linkedRings';
describe('三環の可逆な拘束',()=>{
 it('全状態が行き戻りでき、初期状態から最短五手で外せる',()=>{
  const queue:[number,number[]][]=[[7,[]]],seen=new Set([7]);let solution:number[]=[];
  while(queue.length){const [mask,path]=queue.shift()!;if(mask===0&&!solution.length)solution=path;for(let i=0;i<3;i++)if(canMoveRing(mask,i)){const next=moveRing(mask,i);expect(canMoveRing(next,i)).toBe(true);expect(moveRing(next,i)).toBe(mask);if(!seen.has(next)){seen.add(next);queue.push([next,[...path,i]]);}}}
  expect(seen.size).toBe(8);expect(solution).toEqual([0,2,0,1,0]);
 });
});
