import {describe,it,expect} from 'vitest';
import {initial,apply,type World} from './campaign';
import {paperMatchesExit,paperOnExit} from './exitReference';
describe('写しを現在の扉へ照合する',()=>{
 it('原型の方向を含めて変換を合成し、同じ接触面を二つの姿勢から読める',()=>{const g=initial();expect(paperMatchesExit({...g,itemValues:{tissue:[1,0,63,1,2]}})).toBe(true);expect(paperMatchesExit({...g,itemValues:{tissue:[1,2,63,1,0]}})).toBe(true);for(const t of [[0,0,63,1,2],[1,0,31,1,2],[1,0,63,0,2],[1,2,63,1,2]])expect(paperMatchesExit({...g,itemValues:{tissue:t}})).toBe(false)});
 it('写しが完成しただけでは照合完了とせず、扉で裏面を確認する',()=>{let g:World={...initial(),room:10,facing:3,inventory:['tissue'],selected:'tissue',itemValues:{tissue:[1,0,63,0,2]}};g=apply(g,{type:'exit-paper-place'}).world;expect(paperOnExit(g)).toBe(true);expect(g.inventory).toEqual([]);expect(g.solved).not.toContain(25);g=apply(g,{type:'p-rubbing-view',flip:true}).world;expect(g.solved).toContain(25);g=apply(g,{type:'exit-paper-take'}).world;expect(g.inventory).toEqual(['tissue']);expect(paperOnExit(g)).toBe(false)});
});

it('どちらの原型面からの写しでも、同じ外形と二穴が重なる姿勢を認める',()=>{const matches=[];for(const source of [0,1])for(const mould of [0,2])for(const face of [0,1])for(let rotation=0;rotation<4;rotation++){const t=[source,mould,63,face,rotation];if(paperMatchesExit({...initial(),itemValues:{tissue:t}}))matches.push(t);}expect(matches).toEqual([[0,0,63,0,2],[0,2,63,0,0],[1,0,63,1,2],[1,2,63,1,0]]);});
it('交差線のある保存済みの写しを消さずに扉と原型へ照合できる',()=>{let g:World={...initial(),room:10,facing:3,inventory:['tissue'],selected:'tissue',itemValues:{tissue:[0,0,63,0,2]}};g=apply(g,{type:'exit-paper-place'}).world;expect(g.solved).toContain(25);g=apply(g,{type:'exit-paper-take'}).world;g={...g,facing:0,focus:'object:29',selected:'tissue'};g=apply(g,{type:'p-master-paper',id:29,index:1}).world;expect(g.solved).toContain(29);expect(g.itemValues.tissue).toEqual([0,0,63,0,2]);});
