import {describe,it,expect} from 'vitest';
import {initial,apply,readSave,route} from './campaign';
describe('序盤から観察できる搬出間',()=>{
 it('戸を開いてから通り、謎の既読を要求しない',()=>{let g={...initial(),facing:3 as const};expect(apply(g,{type:'go',room:10}).world).toBe(g);g=apply(g,{type:'loading-entry'}).world as typeof g;const inside=apply(g,{type:'go',room:10}).world;expect(inside.room).toBe(10);expect(inside.facing).toBe(3);expect(inside.visited).toContain(10);expect(inside.solved).toEqual([])});
 it('反対側で閉めた戸も同じ状態として保存し、閉じた道を地図移動しない',()=>{let g={...initial(),room:10,facing:1 as const,visited:[0,10],flags:{'loading:entry':true}};g=apply(g,{type:'loading-entry'}).world as typeof g;expect(route(g,0)).toBeNull();const saved=readSave(JSON.stringify(g))!;expect(saved.flags['loading:entry']).toBe(false);const open=apply(saved,{type:'loading-entry'}).world;expect(apply(open,{type:'go',room:0}).world.facing).toBe(1)});
});
