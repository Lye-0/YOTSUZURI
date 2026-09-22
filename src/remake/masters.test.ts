import {describe,it,expect} from 'vitest';
import {initial,apply,type World,readSave} from './campaign';
import {masterPaperIndex} from './masters';
describe('二つの原型と現在の修理箇所',()=>{
 it('同じ写しを二枚の間で移し、正しい基準面と現在の原型を合わせる',()=>{let g:World={...initial(),room:10,facing:0,focus:'object:29',inventory:['tissue'],selected:'tissue',itemValues:{tissue:[1,0,63,1,2]}};g=apply(g,{type:'p-master-paper',id:29,index:0}).world;expect(g.solved).not.toContain(29);expect(g.inventory).toEqual([]);g=apply(g,{type:'p-master-paper',id:29,index:1}).world;expect(g.solved).toContain(29);expect(masterPaperIndex(g)).toBe(1);g=readSave(JSON.stringify(g))!;g=apply(g,{type:'p-retrieve',id:29,item:'tissue'}).world;expect(g.inventory).toEqual(['tissue']);expect(masterPaperIndex(g)).toBe(-1)});
 it('扉に残した紙が原型台へ複製されない',()=>{const g:World={...initial(),room:10,facing:0,focus:'object:29',placed:{31:['tissue']},itemValues:{tissue:[1,0,63,1,2]}};expect(apply(g,{type:'p-master-paper',id:29,index:1}).world).toBe(g)});
});
