import {panelLockCode} from './evidenceLocks';
import {describe,it,expect} from 'vitest';
import {initial,type World} from './campaign';
import {applyRepairNorth} from './repairNorth';
const start=():World=>({...initial(),room:8,facing:0,inventory:['knife'],selected:'knife'});
describe('補修した木板の実物の覆い',()=>{
 it('小口の既読や正解を要求せず、覆いを外してから戸を開く',()=>{
  let g=start();expect(applyRepairNorth(g,{type:'repair-panel-door',index:1}).world).toBe(g);g=applyRepairNorth(g,{type:'repair-trim',index:1}).world;expect(g.inventory).toEqual(['knife']);expect(g.selected).toBeNull();expect(applyRepairNorth(g,{type:'repair-panel-door',index:1}).world.flags.secret).not.toBe(true);for(let row=0;row<6;row++)for(let n=0;n<panelLockCode[row];n++)g=applyRepairNorth(g,{type:'repair-setting',index:1,row}).world;g=applyRepairNorth(g,{type:'repair-panel-door',index:1}).world;expect(g.flags.secret).toBe(true);expect(g.solved).not.toContain(22);
  expect(applyRepairNorth(g,{type:'repair-trim',index:1}).world).toBe(g);g=applyRepairNorth(g,{type:'repair-panel-door',index:1}).world;g=applyRepairNorth(g,{type:'repair-trim',index:1}).world;expect(g.flags.secret).toBe(false);expect(g.flags['repair:trim:1']).toBe(false);
 });
 it('他の板も実際に調べられるが、同じ取っ手の画像で通路を開かない',()=>{
  for(const index of [0,2]){let g=applyRepairNorth(start(),{type:'repair-trim',index}).world;expect(g.flags[`repair:trim:${index}`]).toBe(true);expect(applyRepairNorth(g,{type:'repair-panel-door',index}).world).toBe(g);}
  expect(applyRepairNorth({...start(),selected:null},{type:'repair-trim',index:1}).world.flags).toEqual(initial().flags);
 });
});
it('指定した目盛りへ直接動かし、同じ位置を押しても進まない',()=>{let g=applyRepairNorth(start(),{type:'repair-trim',index:1}).world;g=applyRepairNorth(g,{type:'repair-setting',index:1,row:2,position:2}).world;expect(g.flags['repair:setting:1:2:2']).toBe(true);g=applyRepairNorth(g,{type:'repair-setting',index:1,row:2,position:2}).world;expect(g.flags['repair:setting:1:2:2']).toBe(true);expect(applyRepairNorth(g,{type:'repair-setting',index:1,row:2,position:4}).world).toBe(g);});
