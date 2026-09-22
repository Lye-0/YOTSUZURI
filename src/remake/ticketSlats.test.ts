import {describe,it,expect} from 'vitest';
import {ticketBlockers,ticketCanLift} from './ticketSlats';
import {apply,initial,readSave,type World} from './campaign';
describe('写真に重なる留め具と、手前に抜ける板',()=>{
 it('自由な板を先に外す全ての順序で、同じ二枚の札へ到達する',()=>{const orders:number[][]=[];function search(v:number[],order:number[]){if(order.length===4){orders.push(order);return}for(let i=0;i<4;i++)if(ticketCanLift(v,i)){const next=[...v];next[i]=1;search(next,[...order,i])}}search([0,0,0,0],[]);expect(orders).toEqual([[0,1,3,2],[0,3,1,2],[3,0,1,2]]);});
 it('一方だけ外しても三枚目を押さえるもう一方の舌が残る',()=>{expect(ticketBlockers([0,0,0,0],2)).toEqual([1,3]);expect(ticketBlockers([1,1,0,0],2)).toEqual([3]);expect(ticketCanLift([1,1,0,1],2)).toBe(true)});
 it('引っ掛かった板は動かず、途中保存から残った留め具を引き継ぐ',()=>{let g:World={...initial(),facing:2,focus:'object:1'};expect(apply(g,{type:'p-release',id:1,index:2}).world).toBe(g);g=apply(g,{type:'p-release',id:1,index:3}).world;g=readSave(JSON.stringify(g))!;expect(g.values[1]).toEqual([0,0,0,1]);expect(apply(g,{type:'p-release',id:1,index:1}).world).toBe(g);for(const index of[0,1,2])g=apply(g,{type:'p-release',id:1,index}).world;expect(g.solved).toContain(1);expect(g.inventory).toEqual([]);g=apply(g,{type:'p-take',id:1,item:'card-diamond'}).world;expect(g.inventory).toEqual(['card-diamond']);});
});
