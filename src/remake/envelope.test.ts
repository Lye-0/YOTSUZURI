import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type Action,type World} from './campaign';
import {envelopeExposed,envelopeValues,validEnvelope} from './envelope';
const start=():World=>({...initial(),room:6,facing:0,focus:'object:18',inventory:['knife']});
const flap=(index:number):Action=>({type:'p-envelope-flap',id:18,index});
function open(){let g=start();for(const a of [flap(0),{type:'select',item:'knife'},{type:'p-envelope-loosen',id:18},flap(1),flap(2),{type:'p-envelope-slide',id:18,direction:-1},{type:'p-envelope-slide',id:18,direction:-1}] as Action[])g=apply(g,a).world;return g;}
describe('封筒の折り返しと内袋',()=>{
 it('上に重なった紙と糊を別々に扱い、ナイフは失われない',()=>{
  let g=start();expect(apply(g,flap(1)).world).toBe(g);g=apply(g,flap(0)).world;expect(apply(g,flap(1)).world).toBe(g);
  g=apply(g,{type:'select',item:'knife'}).world;g=apply(g,{type:'p-envelope-loosen',id:18}).world;expect(g.inventory).toContain('knife');expect(g.selected).toBeNull();
  g=apply(g,flap(1)).world;expect(envelopeValues(g)[2]).toBe(3);expect(validEnvelope(envelopeValues(g))).toBe(true);
 });
 it('内袋から見えた紙は途中でも取れ、誤った向きへ押しても失われない',()=>{
  let g=open();g=apply(g,{type:'p-envelope-slide',id:18,direction:1}).world;expect(envelopeExposed(g)).toBe(true);
  expect(apply(g,{type:'p-take',id:18,item:'tissue'}).world.inventory).toContain('tissue');expect(apply(g,flap(2)).world).toBe(g);
  g=apply(g,{type:'p-envelope-slide',id:18,direction:1}).world;expect(envelopeExposed(g)).toBe(false);expect(apply(g,{type:'p-take',id:18,item:'tissue'}).world).toBe(g);expect(apply(g,{type:'p-envelope-slide',id:18,direction:1}).world).toBe(g);
 });
 it('内容物の部分取得を保存し、閉じて開け直しても復活しない',()=>{
  let g=apply(open(),{type:'p-take',id:18,item:'tissue'}).world;expect(g.inventory).toContain('tissue');expect(g.inventory).not.toContain('blanks');
  g=readSave(JSON.stringify(g))!;for(const a of [{type:'p-envelope-slide',id:18,direction:1},{type:'p-envelope-slide',id:18,direction:1},flap(2),flap(1),flap(0),{type:'p-envelope-turn',id:18}] as Action[])g=apply(g,a).world;
  expect(envelopeValues(g)).toEqual([1,1,0,0]);expect(apply(g,{type:'p-take',id:18,item:'blanks'}).world).toBe(g);
  for(const a of [{type:'p-envelope-turn',id:18},flap(0),flap(1),flap(2),{type:'p-envelope-slide',id:18,direction:-1},{type:'p-envelope-slide',id:18,direction:-1}] as Action[])g=apply(g,a).world;
  expect(apply(g,{type:'p-take',id:18,item:'tissue'}).world).toBe(g);g=apply(g,{type:'p-take',id:18,item:'blanks'}).world;expect(g.inventory.filter(n=>n==='tissue')).toHaveLength(1);expect(g.inventory).toContain('blanks');
 });
 it('旧解除操作を受け付けず、旧保存に置かれたナイフは持ち物へ戻す',()=>{
  const g=start();expect(apply(g,{type:'p-release',id:18,index:0}).world).toBe(g);expect(apply(g,{type:'p-set',id:18,values:[0,1,7,2]}).world).toBe(g);
  const saved=readSave(JSON.stringify({...g,values:{18:[1,1,1]},solved:[18],placed:{18:['knife']},inventory:[]}));expect(saved?.inventory).toContain('knife');expect(saved&&envelopeExposed(saved)).toBe(true);
 });
});
