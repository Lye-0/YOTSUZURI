import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {gatheringValues,gatheringSources,gatheringPose,paperObservation,validGatherings} from './gatherings';
import {BOOK_ORDER,bookProfile,correctBookOrder,reconstructedBook} from './book';
const start=():World=>({...initial(),room:7,facing:0,focus:'object:17'});
function collect(indices:number[]){let g=start();for(const [slot,index] of indices.entries()){g=apply(g,{type:'p-gathering-probe',id:17,index}).world;g=apply(g,{type:'p-gathering-place',id:17,slot}).world;}return apply(g,{type:'p-gathering-take',id:17}).world;}
describe('透かしと折りの照合',()=>{
 it('印の向きだけでは偽物も合うが、折り・欠け・位置を合わせると三組だけ残る',()=>{
  const reference=paperObservation(0,false,false),equal=(a:ReturnType<typeof paperObservation>)=>JSON.stringify(a)===JSON.stringify(reference);
  const candidates=[0,1,2,3,4].filter(i=>[false,true].some(f=>[false,true].some(r=>equal(paperObservation(i,f,r)))));expect(candidates).toEqual([0,2,4]);
  expect(paperObservation(3,true,false).hand).toBe(reference.hand);expect(paperObservation(3,true,false).fold).not.toEqual(reference.fold);
  expect(paperObservation(1,false,false).hand).toBe(reference.hand);expect(paperObservation(1,false,false).mark).not.toEqual(reference.mark);
 });
 it('光台・整理布の間で実物を交換し、途中の向きも保存する',()=>{
  let g=apply(start(),{type:'p-gathering-probe',id:17,index:2}).world;expect(gatheringPose(g,2).flip).toBe(true);g=apply(g,{type:'p-gathering-turn',id:17,mode:'flip'}).world;expect(gatheringPose(g,2).flip).toBe(false);
  g=apply(g,{type:'p-gathering-place',id:17,slot:0}).world;g=apply(g,{type:'p-gathering-probe',id:17,index:1}).world;g=apply(g,{type:'p-gathering-place',id:17,slot:0}).world;expect(gatheringValues(g)).toEqual([2,1,-1,-1]);expect(validGatherings(gatheringValues(g))).toBe(true);
  const saved=readSave(JSON.stringify(g))!;expect(gatheringValues(saved)).toEqual([2,1,-1,-1]);expect(gatheringPose(saved,2).flip).toBe(false);
 });
 it('誤紙も持ち出せるが、戻すには手元で明示的に選ぶ',()=>{
  let g=collect([0,1,2]);expect(g.inventory).toContain('gatherings');expect(g.solved).not.toContain(17);expect(gatheringSources(g)).toEqual([0,1,6,7,2,3]);expect(correctBookOrder(BOOK_ORDER,gatheringSources(g))).toBe(false);
  expect(apply(g,{type:'p-gathering-return',id:17}).world).toBe(g);g=apply(g,{type:'select',item:'gatherings'}).world;g=apply(g,{type:'p-gathering-return',id:17}).world;expect(g.inventory).not.toContain('gatherings');expect(gatheringValues(g).slice(1)).toEqual([0,1,2]);
 });
 it('整理布へ置いた順が違っても、同じ実物の順・厚みへ組み直せる',()=>{
  const g=collect([4,0,2]),sources=gatheringSources(g),order=BOOK_ORDER.map(id=>sources.indexOf(id));expect(sources).toEqual([4,5,0,1,2,3]);expect(g.solved).toContain(17);
  const b={...g.book,order,blanks:[1,4],side:1 as const,closed:true,clamped:true,sewn:true};expect(reconstructedBook(b,sources)).toBe(true);expect(bookProfile(b,sources)).toEqual([1,3,4,2,4,1]);
 });
 it('旧形式の取得済み原本を維持し、実物の識別を任意の並べ替えで変えない',()=>{
  const g=readSave(JSON.stringify({...start(),inventory:['gatherings'],collected:['gatherings'],solved:[17],values:{17:[1,3,5]}}))!;expect(gatheringSources(g)).toEqual([0,1,2,3,4,5]);expect(gatheringValues(g)).toEqual([-1,0,2,4]);
  expect(apply(g,{type:'item-arrange',item:'gatherings',values:[4,5,0,1,2,3]}).world).toBe(g);
 });
});

it('直接移動では占有場所へ暗黙に交換せず、ほかの比較紙と向きを保つ',()=>{let g=start();g=apply(g,{type:'p-gathering-move',id:17,index:0,destination:'light'}).world;const old=g;expect(apply(g,{type:'p-gathering-move',id:17,index:1,destination:'light'}).world).toBe(old);g=apply(g,{type:'p-gathering-move',id:17,index:2,destination:0}).world;expect(gatheringPose(g,2).flip).toBe(true);expect(gatheringValues(g)).toEqual([0,2,-1,-1]);expect(apply(g,{type:'p-gathering-move',id:17,index:1,destination:0}).world).toBe(g);g=apply(g,{type:'p-gathering-move',id:17,index:2,destination:'home'}).world;expect(gatheringValues(g)).toEqual([0,-1,-1,-1]);g=apply(g,{type:'p-gathering-move',id:17,index:0,destination:1}).world;expect(gatheringValues(g)).toEqual([-1,-1,0,-1])});
