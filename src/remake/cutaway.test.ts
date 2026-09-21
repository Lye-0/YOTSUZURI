import {describe,it,expect} from 'vitest';
import {initial,apply,readSave,type World} from './campaign';
import {cutawayAligned,cutawayOpen} from './cutaway';
const start=():World=>({...initial(),room:9,facing:0,focus:'object:27'});
describe('受け側を補う断面模型',()=>{
 it('各受け側の長さを補う一組だけが継ぎ目に合い、手動で引く',()=>{
  const matches=[];for(let a=1;a<=4;a++)for(let b=1;b<=4;b++)for(let c=1;c<=4;c++)if(cutawayAligned({...start(),values:{27:[a,b,c]}}))matches.push([a,b,c]);expect(matches).toEqual([[3,4,1]]);
  let g={...start(),values:{27:[3,4,1]}} as World;expect(cutawayOpen(g)).toBe(false);g=apply(g,{type:'p-cutaway-bolt',id:27}).world;expect(cutawayOpen(g)).toBe(true);
 });
 it('引出し中のピンは動かせず、戻してから再調整する',()=>{
  let g=apply({...start(),values:{27:[3,4,1]}},{type:'p-cutaway-bolt',id:27}).world;
  expect(apply(g,{type:'p-cutaway-screw',id:27,index:0}).world).toBe(g);g=readSave(JSON.stringify(g))!;expect(cutawayOpen(g)).toBe(true);
  g=apply(g,{type:'p-cutaway-bolt',id:27}).world;g=apply(g,{type:'p-cutaway-screw',id:27,index:0}).world;
  expect(g.values[27]).toEqual([4,4,1]);expect(cutawayAligned(g)).toBe(false);expect(cutawayOpen(apply(g,{type:'p-cutaway-bolt',id:27}).world)).toBe(false);
 });
});
