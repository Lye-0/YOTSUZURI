import { describe,it,expect } from 'vitest';
import { fresh, reduce, value, canSlide, keyOpens, parseSave, roomAllowed, validValue, type Game, type Action, BOOK_ORDER } from './engine';
import { getPuzzle, neighbors } from './data';
import { edgeHeights, impression, rotateCells, plateCells } from './mechanics';
const answers:Record<number,number[]>={2:[6,8,4],3:[0,2,1,9,1,8,6],4:[3,6],5:[6],6:[1,1],8:[1,1,2],9:[2,0,3,1],10:[0,3],11:[2,4],12:[1,3,0,1],14:[2,0,3,1],17:[1,3,5],19:[2],20:[1,2],21:[1,1],22:[...BOOK_ORDER,2],23:[1,4],24:[1,3,2,0],25:[1,2],26:[1,9,2,7],27:[3,4,1],28:[2,1,3],29:[1],30:[4,2,1,3,1,4]};
function go(g:Game,target:number){const q:[[number,number[]]]|[number,number[]][]=[[g.room,[]]];const seen=new Set([g.room]);while(q.length){const [n,path]=q.shift()!;if(n===target)return path.reduce((s,room)=>reduce(s,{type:'move',room}).game,g);for(const m of neighbors[n])if(!seen.has(m)&&roomAllowed(g,m)){seen.add(m);q.push([m,[...path,m]])}}throw Error('No route to '+target)}
function solve(g:Game,id:number){g=go(g,getPuzzle(id).room);const actions:Action[]=[];
if([1,15,18].includes(id))for(const index of id===1?[1,3,0,2]:id===15?[1,2,0]:[2,0,1])actions.push({type:'release',id,index});
else if([7,13].includes(id))for(const button of id===7?[0,1,2,3]:[4,1,5,2])actions.push({type:'sequence',id,button});
else if(id===16)for(const [index,position] of [[2,0],[1,3],[3,3],[0,4]])actions.push({type:'slide',index,position});
else actions.push({type:'set',id,values:answers[id]},{type:'test',id});
g=actions.reduce((s,a)=>reduce(s,a).game,g);expect(g.solved).toContain(id);g=reduce(g,{type:'open',id}).game;for(const item of getPuzzle(id).rewards)g=reduce(g,{type:'take',id,item}).game;return g;}
describe('夜綴の進行と保存',()=>{
it('通常の移動・入手を経て30箇所から脱出まで到達する',()=>{let g=reduce(fresh(),{type:'start'}).game;for(let id=1;id<=30;id++){if(id===23)g=reduce(g,{type:'secret'}).game;g=solve(g,id);const saved=parseSave(JSON.stringify(g));expect(saved).not.toBeNull();g=saved!;}expect(g.inventory).not.toContain('corner');expect(g.inventory).not.toContain('wedge');expect(g.inventory).toContain('cradle');expect(g.solved).toHaveLength(30);expect(reduce(g,{type:'finish'}).game.finished).toBe(true)});
it('留め金の解除・開ける・取るが別操作で、入手は一度だけ',()=>{let g=fresh();for(const index of [1,3,0,2])g=reduce(g,{type:'release',id:1,index}).game;expect(g.inventory).toEqual([]);g=reduce(g,{type:'take',id:1,item:'card'}).game;expect(g.inventory).toEqual([]);g=reduce(g,{type:'open',id:1}).game;expect(g.inventory).toEqual([]);g=reduce(g,{type:'take',id:1,item:'card'}).game;g=reduce(g,{type:'take',id:1,item:'card'}).game;expect(g.inventory).toEqual(['card'])});
it('別室の仕掛けや未訪問の地図へ遠隔操作できない',()=>{let g=fresh();expect(reduce(g,{type:'set',id:26,values:[1,9,2,7]}).game).toEqual(g);expect(reduce(g,{type:'move',room:9,map:true}).game).toEqual(g);expect(reduce(g,{type:'slide',index:2,position:0}).game).toEqual(g)});
it('正解を知っていれば資料の既読フラグを要求しない',()=>{let g={...fresh(),room:1};g=reduce(g,{type:'set',id:2,values:[6,8,4]}).game;expect(g.seen).toEqual([]);expect(g.solved).toContain(2)});
it('必要な物を持っていない最終鍵では脱出しない',()=>{const g={...fresh(),room:10};const s=reduce(g,{type:'set',id:30,values:answers[30]}).game;expect(reduce(s,{type:'test',id:30}).game.solved).not.toContain(30);expect(reduce(s,{type:'finish'}).game.finished).toBe(false)});
it('環や紙位置の途中状態を保存して再開できる',()=>{const g=reduce({...fresh(),room:2},{type:'set',id:4,values:[2,5]}).game;expect(value(parseSave(JSON.stringify(g))!,4)).toEqual([2,5])});
it('壊れた・別バージョン・範囲外の記録を拒否する',()=>{expect(parseSave('{')).toBeNull();expect(parseSave(JSON.stringify({...fresh(),version:2}))).toBeNull();expect(parseSave(JSON.stringify({...fresh(),values:{30:[]}}))).toBeNull();expect(parseSave(JSON.stringify({...fresh(),sequences:{7:[99]}}))).toBeNull()});
it('棚の衝突を飛び越えず、合法手で通路を開ける',()=>{const v=[0,0,2,1];expect(canSlide(v,0,4)).toBe(false);let g={...fresh(),room:6};for(const [index,position] of [[2,0],[1,3],[3,3],[0,4]])g=reduce(g,{type:'slide',index,position}).game;expect(g.solved).toContain(16)});
it('逆側に載せても天秤は釣り合う',()=>{let g={...fresh(),room:3};g=reduce(g,{type:'set',id:8,values:[2,2,1]}).game;expect(g.solved).toContain(8)});
it('空配列・重複束・範囲外の歯を正解にしない',()=>{expect(validValue(27,[])).toBe(false);expect(validValue(22,[0,0,0,0,0,0,2])).toBe(false);expect(validValue(30,[0,2,1,3,1,4])).toBe(false);expect(validValue(23,[1,1])).toBe(false)});
it('最後の鍵は4096通りに一つ、鏡像は不正解',()=>{let matches=0;for(let n=0;n<4096;n++){const v=Array.from({length:6},(_,i)=>(n>>i*2&3)+1);if(keyOpens(v))matches++;}expect(matches).toBe(1);expect(keyOpens([...answers[30]].reverse())).toBe(false)});
it('端面は束・白紙・見る側から幾何的に得られる',()=>{expect(edgeHeights(BOOK_ORDER,[1,4],1)).toEqual([1,3,4,2,4,1]);expect(edgeHeights(BOOK_ORDER,[],1)).toEqual([1,2,4,2,3,1]);expect(edgeHeights(BOOK_ORDER,[1,4],0)).toEqual([1,4,2,4,3,1])});
it('版の四回転は元へ戻り、誤った見当は別の刷りになる',()=>{expect(rotateCells(plateCells(0),4)).toEqual(plateCells(0));expect(impression([1,3,0,1])).not.toEqual(impression([0,3,0,1]));expect(impression([1,3,0,1])).not.toEqual(impression([1,3,0,0]));});
});
