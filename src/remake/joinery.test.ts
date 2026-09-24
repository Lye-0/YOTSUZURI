import {describe,it,expect} from 'vitest';
import {initial,apply,type World,readSave} from './campaign';
import {joineryFits,joineryReady,joineryValues,joineryFailure} from './joinery';
const assembled=[0,1,2,3,0,1,2,3,0,0,0,0];
const start=():World=>({...initial(),room:9,facing:1,focus:'object:24'});
describe('四片の継ぎ枠',()=>{
 it('長さ・向き・接合する上下半分を現在の実物から判定する',()=>{
  expect(joineryFits(assembled)).toBe(true);const wrong=[...assembled];wrong[8]=1;expect(joineryFits(wrong)).toBe(false);
  const alternate=[2,3,0,1,2,3,0,1,0,0,0,0];expect(joineryFits(alternate)).toBe(true);
  expect(joineryReady({...start(),values:{24:assembled}})).toBe(true);
 });
 it('途中で回転・裏返し・取り外しができ、保存で形を保持する',()=>{
  let g=start();for(let i=0;i<2;i++)g=apply(g,{type:'p-frame-turn',id:24,piece:0}).world;g=apply(g,{type:'p-frame-place',id:24,piece:0,slot:0}).world;
  expect(joineryValues(g)[0]).toBe(0);g=readSave(JSON.stringify(g))!;expect(joineryValues(g)[4]).toBe(2);
  g=apply(g,{type:'p-frame-remove',id:24,piece:0}).world;expect(joineryValues(g)[0]).toBe(-1);
 });
 it('同じ枠を持ち出して戻し、記録は同じ作業台から別に拾う',()=>{
  let g:World={...start(),values:{24:assembled}};
  g=apply(g,{type:'p-frame-take',id:24}).world;expect(g.inventory).toEqual(['frame']);expect(g.itemValues.frame).toEqual(assembled);
  g=apply(g,{type:'p-take',id:24,item:'returnrecord'}).world;expect(g.inventory).toEqual(['frame','returnrecord']);
  g=apply(g,{type:'select',item:'frame'}).world;g=apply(g,{type:'p-frame-return',id:24}).world;expect(g.inventory).toEqual(['returnrecord']);expect(joineryReady(g)).toBe(true);
 });
});

it('最初の配置でも長さと向きの不適合を切欠きの衝突から区別する',()=>{const base=joineryValues(start());let v=[...base];v[0]=1;expect(joineryFailure(v)).toBe('length');v=[...base];v[0]=0;v[4]=1;expect(joineryFailure(v)).toBe('direction');v=[...assembled];v[8]=1;expect(joineryFailure(v)).toBe('gap');v=[...assembled];v[10]=1;expect(joineryFailure(v)).toBe('overlap');expect(apply(start(),{type:'p-frame-place',id:24,piece:0,slot:1}).message).toContain('長さ')});
