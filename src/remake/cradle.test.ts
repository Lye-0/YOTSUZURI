import {describe,it,expect} from 'vitest';
import {apply,initial,readSave,type World} from './campaign';
import {applyCradle,cradleBoardAngle,cradleReady,cradleSlope,cornerSeated,cradleTaken} from './cradle';
const jig=(values=[1,1,0,1]):World=>({...initial(),room:8,facing:1,focus:'object:21',values:{21:values},placed:{21:['corner','wedge']}});
describe('角当ての内側と斜面で支える二枚板',()=>{
 it('穴だけ合う姿勢と、斜面全体と側面まで支える姿勢を区別する',()=>{
  expect([0,1,2,3].map(cornerSeated)).toEqual([true,false,true,false]);const stable:number[][]=[];
  for(let r=0;r<4;r++)for(let w=0;w<4;w++)for(let x=0;x<3;x++){const v=[0,r,w,x];if(cradleReady(jig(v)))stable.push(v);}
  expect(stable).toEqual([[0,0,2,0]]);expect(cradleReady(jig([0,0,2,1]))).toBe(false);expect(cradleBoardAngle(jig([0,0,2,0]))).toBeCloseTo(cradleSlope);
 });
 it('間違った向きでも現物の接触から板が浮き、材料を消さない',()=>{
  expect(cradleBoardAngle(jig([0,0,0,0]))).toBe(70);expect(cradleBoardAngle(jig([0,0,1,0]))).toBeGreaterThan(40);
  const g=jig([0,0,2,1]);expect(applyCradle(g,{type:'p-cradle-take',id:21}).world).toBe(g);expect(g.placed[21]).toEqual(['corner','wedge']);
 });
 it('同じ基台を持ち出し、返して分解するまで材料を二重に所持しない',()=>{
  let g=applyCradle(jig([0,0,2,0]),{type:'p-cradle-take',id:21}).world;expect(cradleTaken(g)).toBe(true);expect(g.inventory).toEqual(['cradle']);expect(g.placed[21]).toEqual([]);expect(g.itemValues.cradle).toEqual([0,0,2,0]);
  expect(applyCradle(g,{type:'p-cradle-take',id:21}).world).toBe(g);g={...g,selected:'cradle'};g=applyCradle(g,{type:'p-cradle-return',id:21}).world;expect(cradleTaken(g)).toBe(false);expect(g.placed[21]).toEqual(['corner','wedge']);expect(applyCradle(g,{type:'p-retrieve',id:21,item:'wedge'}).world).toBe(g);
  g=applyCradle(g,{type:'p-cradle-board',id:21}).world;g=applyCradle(g,{type:'p-retrieve',id:21,item:'wedge'}).world;expect(g.inventory).toEqual(['wedge']);expect(cradleReady(g)).toBe(false);
 });
 it('間違った途中姿勢と持出した組立状態を保存し、手元で値だけ改変しない',()=>{
  const wrong=jig([0,2,1,2]),restored=readSave(JSON.stringify(wrong))!;expect(restored.values[21]).toEqual(wrong.values[21]);expect(cradleReady(restored)).toBe(false);
  const held=apply(jig([0,0,2,0]),{type:'p-cradle-take',id:21}).world,saved=readSave(JSON.stringify(held))!;expect(saved.itemValues.cradle).toEqual([0,0,2,0]);expect(cradleTaken(saved)).toBe(true);expect(apply(saved,{type:'item-arrange',item:'cradle',values:[1,1,1,1]}).world).toBe(saved);
 });
});
