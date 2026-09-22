import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World,type Action} from './campaign';
const run=(s:World,...a:Action[])=>a.reduce((g,a)=>apply(g,a).world,s);
const ready=():World=>({...initial(),room:4,facing:0,focus:'object:12',placed:{12:['plates','pin','weights','register']},values:{12:[0,0,0,1]},itemValues:{plates:[0,3]}});
describe('刷った紙の保存と交換',()=>{
 it('裏面に完成済みの旧セーブも取得時に認め、刷った面を手元で見せる',()=>{
  const g=ready();g.values[12]=[0,0,1,1];g.print.layers=[{plate:0,rotation:0,face:1,offset:1},{plate:3,rotation:0,face:1,offset:1}];
  const result=run(readSave(JSON.stringify(g))!,{type:'p-take-print',id:12});
  expect(result.solved).toContain(12);expect(result.flags['view:proof']).toBe(true);expect(result.itemValues.proof).toEqual([0,0,1,1,3,0,1,1]);
 });
 it('版を動かした後も前の刷り跡を保持して二度目を重ねる',()=>{
  let g=run(ready(),{type:'p-press-paper',id:12},{type:'p-print',id:12},{type:'p-press-paper',id:12},{type:'p-set',id:12,values:[2,0,0,1]});
  g=readSave(JSON.stringify(g))!;
  expect(g.print.layers[0].rotation).toBe(0);
  g=run(g,{type:'p-press-select',id:12,slot:1},{type:'p-press-paper',id:12},{type:'p-print',id:12});
  expect(g.solved).toContain(12);expect(g.print.layers.map(l=>l.rotation)).toEqual([0,0]);
 });
 it('誤った試し刷りも取り出せて、後で新しい刷り紙と交換できる',()=>{
  let g=run(ready(),{type:'p-set',id:12,values:[1,0,1,0]},{type:'p-press-paper',id:12},{type:'p-print',id:12},{type:'p-press-paper',id:12},{type:'p-take-print',id:12});
  const wrong=[...g.itemValues.proof];expect(g.inventory).toEqual(['proof']);expect(g.solved).not.toContain(12);
  g=run(g,{type:'p-set',id:12,values:[0,0,0,1]},{type:'p-press-paper',id:12},{type:'p-print',id:12},{type:'p-press-paper',id:12},{type:'p-press-select',id:12,slot:1},{type:'p-press-paper',id:12},{type:'p-print',id:12},{type:'p-press-paper',id:12},{type:'p-take-print',id:12});
  expect(g.inventory).toEqual(['proof']);expect(g.itemValues.proof).toEqual([0,0,0,1,3,0,0,1]);expect(g.print.layers[0]).toMatchObject({rotation:wrong[1],face:wrong[2]});
 });
});
