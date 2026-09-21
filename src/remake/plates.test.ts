import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World,type Action} from './campaign';
const run=(s:World,...actions:Action[])=>actions.reduce((g,a)=>apply(g,a).world,s);
const start=():World=>({...initial(),room:3,facing:3,focus:'object:10'});
describe('原版の持ち出しと交換',()=>{
 it('誤った二枚も持ち出せ、再開後に一枚ずつ交換できる',()=>{
  let g=run(start(),{type:'p-drawer',id:10,index:1},{type:'p-plate',id:10,index:1},{type:'p-drawer',id:10,index:2},{type:'p-plate',id:10,index:2});
  expect(g.itemValues.plates).toEqual([1,2]);expect(g.solved).not.toContain(10);expect(g.inventory).toEqual(['plates']);
  g=readSave(JSON.stringify(g))!;
  g=run(g,{type:'select',item:'plates'},{type:'p-plate',id:10,index:2},{type:'p-drawer',id:10,index:3},{type:'p-plate',id:10,index:3});
  expect(g.itemValues.plates).toEqual([1,3]);expect(g.inventory).toEqual(['plates']);
 });
 it('閉じた引出しから取れず、刷り機に置いた版を重複取得しない',()=>{
  expect(run(start(),{type:'p-plate',id:10,index:0}).inventory).toEqual([]);
  const g:World={...start(),placed:{12:['plates']},itemValues:{plates:[0,3]},flags:{'drawer:10:0':true}};
  expect(run(g,{type:'p-plate',id:10,index:0}).inventory).toEqual([]);
 });
 it('正解履歴があっても現在の二枚が違えば刷り上がりは完成しない',()=>{
  const g:World={...initial(),room:4,facing:0,focus:'object:12',placed:{12:['plates','pin','weights','register']},values:{12:[0,0,0,1]},itemValues:{plates:[1,2]},solved:[10]};
  const printing:Action[]=[{type:'p-press-paper',id:12},{type:'p-print',id:12},{type:'p-press-paper',id:12},{type:'p-press-select',id:12,slot:1},{type:'p-press-paper',id:12},{type:'p-print',id:12}];
  expect(run(g,...printing).solved).not.toContain(12);
  expect(run({...g,itemValues:{plates:[0,3]}},...printing).solved).toContain(12);
 });
});
