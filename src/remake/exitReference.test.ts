import {describe,it,expect} from 'vitest';
import {initial,apply,type World} from './campaign';
import {paperMatchesExit,paperOnExit} from './exitReference';
describe('写しを現在の扉へ照合する',()=>{
 it('原型の方向を含めて変換を合成し、同じ接触面を二つの姿勢から読める',()=>{const g=initial();expect(paperMatchesExit({...g,itemValues:{tissue:[1,0,63,1,2]}})).toBe(true);expect(paperMatchesExit({...g,itemValues:{tissue:[1,2,63,1,0]}})).toBe(true);for(const t of [[0,0,63,1,2],[1,0,31,1,2],[1,0,63,0,2],[1,2,63,1,2]])expect(paperMatchesExit({...g,itemValues:{tissue:t}})).toBe(false)});
 it('写しが完成しただけでは照合完了とせず、扉で裏面を確認する',()=>{let g:World={...initial(),room:10,facing:3,inventory:['tissue'],selected:'tissue',itemValues:{tissue:[1,0,63,0,2]}};g=apply(g,{type:'exit-paper-place'}).world;expect(paperOnExit(g)).toBe(true);expect(g.inventory).toEqual([]);expect(g.solved).not.toContain(25);g=apply(g,{type:'p-rubbing-view',flip:true}).world;expect(g.solved).toContain(25);g=apply(g,{type:'exit-paper-take'}).world;expect(g.inventory).toEqual(['tissue']);expect(paperOnExit(g)).toBe(false)});
});
