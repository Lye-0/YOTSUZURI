import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {missingLeaves,studyOpen,studyUnderOpen,blankStudyValues,validBlankStudy} from './blankStudy';
const start=():World=>({...initial(),room:9,facing:3,focus:'object:23',inventory:['blanks'],selected:'blanks'});
describe('失われた葉と折り返された葉',()=>{
 it('折りを広げた全幅から欠損を区別し、未観察でも配置できる',()=>{
  expect(missingLeaves).toEqual([1,4]);let g=apply(start(),{type:'p-place',id:23}).world;
  g=apply(g,{type:'p-blank-mark',id:23,packet:0,slot:4}).world;g=apply(g,{type:'p-blank-mark',id:23,packet:1,slot:1}).world;
  expect(g.solved).toContain(23);expect(g.book.blanks).toEqual([]);expect(g.flags).toEqual(initial().flags);
 });
 it('誤配置も持ち帰って置き直せ、二枚が増殖しない',()=>{
  let g=apply(start(),{type:'p-place',id:23}).world;g=apply(g,{type:'p-blank-mark',id:23,packet:0,slot:0}).world;
  expect(apply(g,{type:'p-blank-mark',id:23,packet:1,slot:0}).world).toBe(g);
  g=apply(g,{type:'p-retrieve',id:23,item:'blanks'}).world;expect(g.inventory).toEqual(['blanks']);expect(g.itemValues.blanks).toEqual([0]);expect(g.placed[23]).toEqual([]);
  expect(apply(g,{type:'p-place',id:23}).world).toBe(g);g=apply(g,{type:'select',item:'blanks'}).world;g=apply(g,{type:'p-place',id:23}).world;
  expect(g.inventory).toEqual([]);expect(blankStudyValues(g)).toEqual([0,-1]);expect(g.solved).not.toContain(23);
 });
 it('折り返しの裏は主葉を開いてから触れ、途中状態が再開できる',()=>{
  let g=start();expect(apply(g,{type:'p-study-open',id:23,index:0,under:true}).world).toBe(g);
  g=apply(g,{type:'p-study-open',id:23,index:0}).world;g=apply(g,{type:'p-study-open',id:23,index:0,under:true}).world;
  g=readSave(JSON.stringify(g))!;expect(studyOpen(g,0)).toBe(true);expect(studyUnderOpen(g,0)).toBe(true);
  expect(apply({...g,room:8},{type:'p-study-open',id:23,index:0}).world.room).toBe(8);
 });
 it('旧選択を保持して二枚形式へ移行し、不正配置を拒む',()=>{
  expect(blankStudyValues(readSave(JSON.stringify({...start(),values:{23:[4]}}))!)).toEqual([4,-1]);
  expect(validBlankStudy([2,2])).toBe(false);expect(validBlankStudy([-1,-1])).toBe(true);
  const g=start();expect(apply(g,{type:'p-set',id:23,values:[1,4]}).world).toBe(g);
 });
});
