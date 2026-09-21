import {describe,it,expect} from 'vitest';
import {apply,gateOpen,initial,readSave,value,type World} from './campaign';
const room=():World=>({...initial(),room:6,facing:1,started:true,visited:[0,3,6]});
const moved=()=>{let g=room();for(const [index,position] of [[2,0],[0,3],[3,2],[1,1]])g=apply(g,{type:'p-slide',index,position}).world;return g;};
describe('書架と戸の現在状態',()=>{
 it('未読の見取り図に依存せず、物理的な移動と戸の操作で通れる',()=>{
  let g=moved();expect(value(g,16)).toEqual([3,1,0,2]);expect(gateOpen(g,'shelves')).toBe(false);
  g=apply(g,{type:'archive-door'}).world;expect(gateOpen(g,'shelves')).toBe(true);expect(g.solved).toContain(16);
  const returned=apply({...g,room:8,facing:3},{type:'go',room:6});expect(returned.world.room).toBe(6);
  g=apply(g,{type:'p-slide',index:1,position:6}).world;expect(g.solved).toContain(16);expect(gateOpen(g,'shelves')).toBe(false);
  expect(apply({...g,room:8,facing:3},{type:'go',room:6}).world.room).toBe(8);
 });
 it('棚越しに隠れたノブを操作できず、細い隙間では戸が開いても通れない',()=>{
  const g=room();expect(apply(g,{type:'archive-door'}).world).toBe(g);
  const narrow={...moved(),values:{16:[3,2,0,2]}};const opened=apply(narrow,{type:'archive-door'}).world;
  expect(opened.flags['archive:door']).toBe(true);expect(gateOpen(opened,'shelves')).toBe(false);
 });
 it('途中位置と開いた戸を保存し、旧形式の到達済み保存も維持する',()=>{
  const g=apply(moved(),{type:'archive-door'}).world;const saved=readSave(JSON.stringify(g));expect(saved?.values[16]).toEqual(g.values[16]);expect(saved?.flags['archive:door']).toBe(true);
  const old=readSave(JSON.stringify({...g,values:{16:[4,0,2,1,3,1,2,0]},flags:{}}));expect(old&&gateOpen(old,'shelves')).toBe(true);
  const fresh=readSave(JSON.stringify({...room(),values:{16:[0,0,2,1,0,0,0,0]}}));expect(fresh&&value(fresh,16)).toEqual([0,6,2,4]);
 });
});
