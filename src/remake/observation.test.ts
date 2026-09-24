import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,route,type World} from './campaign';
describe('観察と再訪',()=>{
 it('紙の裏面や単体の観察方向を保存し、未所持品は変更しない',()=>{const g:World={...initial(),inventory:['proof','returnrecord']};const shown=apply(g,{type:'item-view',item:'proof'}).world;expect(shown.flags['view:proof']).toBe(true);expect(readSave(JSON.stringify(shown))?.flags['view:proof']).toBe(true);expect(apply(shown,{type:'item-view',item:'clamp'}).world).toBe(shown);expect(shown.itemValues).toEqual(g.itemValues)});
 it('封印の裏面を閉じて再訪しても保持する',()=>{const g:World={...initial(),room:5,facing:3,focus:'object:9'};const flipped=apply(g,{type:'p-seal-flip',id:9,index:2}).world;const saved=readSave(JSON.stringify(apply(flipped,{type:'back'}).world))!;expect(saved.flags['seal:back:2']).toBe(true);expect(apply(initial(),{type:'p-seal-flip',id:9,index:2}).world).toEqual(initial())});
 it('訪問済みの部屋でも現在閉じた戸や未訪問の経路を越えて移動しない',()=>{const g:World={...initial(),room:9,visited:[0,5,6,8,9],opened:[15,7],flags:{secret:true,'archive:door':true},values:{16:[0,2,0,0]}};expect(route(g,5)).toBeNull();expect(route({...g,visited:[...g.visited,3]},5)).toEqual([8,6,3,5]);expect(route({...g,flags:{...g.flags,'archive:door':false}},6)).toBeNull()});
});
