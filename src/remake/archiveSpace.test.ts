import {describe,it,expect} from 'vitest';
import {archiveRoom,archiveCamera,archiveRoomEye,archiveFloorPoint,archiveProjectEye,shelfSpecs,initialShelves,validShelves,canMoveShelf,shelfRect,shelvesOverlap,archivePassable,archiveDoorWidth,archiveProject} from './archiveSpace';
import {archiveOldPlan,archiveTraceEye,oldFootprint} from './archivePlan';
const move=(v:number[],i:number,p:number)=>{expect(canMoveShelf(v,i,p)).toBe(true);return v.map((n,j)=>i===j?p:n);};
describe('書庫の実物寸法と移動の試作',()=>{
 it('現在位置だけでなく、動かす途中の衝突を判定する',()=>{
  const v=initialShelves();expect(validShelves(v)).toBe(true);expect(archivePassable(v)).toBe(false);
  expect(canMoveShelf(v,1,0)).toBe(false);expect(canMoveShelf(v,3,0)).toBe(false);expect(canMoveShelf(v,0,3)).toBe(false);
  const left=move(v,2,0),south=move(left,0,3);expect(canMoveShelf(south,2,6)).toBe(false);
 });
 it('深い棚は両側へ退避でき、出口の幅を満たす複数の位置を許す',()=>{
  for(const parking of [0,5,6]){let v=move(initialShelves(),2,parking);v=move(v,0,3);v=move(v,3,2);v=move(v,1,2);expect(archivePassable(v)).toBe(false);v=move(v,1,1);expect(archiveDoorWidth(v)).toBeCloseTo(.7125);expect(archivePassable(v)).toBe(true);v=move(v,1,0);expect(archivePassable(v)).toBe(true);}
 });
 it('全到達状態で衝突・退路・可逆性を確認する',()=>{
  const queue=[initialShelves()],seen=new Set([queue[0].join(',')]);let goals=0;
  const exit={x:archiveRoom.southDoor[0],y:archiveRoom.depth-.65,width:archiveRoom.southDoor[1]-archiveRoom.southDoor[0],depth:.65,height:2};
  for(let k=0;k<queue.length;k++){const v=queue[k];expect(validShelves(v)).toBe(true);if(archivePassable(v))goals++;
   for(let i=0;i<4;i++){expect(shelvesOverlap(shelfRect(v,i),exit)).toBe(false);for(let p=0;p<shelfSpecs[i].stops.length;p++)if(canMoveShelf(v,i,p)){const n=v.map((a,j)=>i===j?p:a);expect(canMoveShelf(n,i,v[i])).toBe(true);const key=n.join(',');if(!seen.has(key)){seen.add(key);queue.push(n);}}}
  }
  expect(queue.length).toBeGreaterThan(30);expect(goals).toBeGreaterThan(1);
 });
 it('北向きの正面と上下は固定カメラから同じ投影へ出る',()=>{const p=archiveProject([archiveCamera.x,0,1.6],0);expect(p[0]).toBeCloseTo(836);expect(p[1]).toBeLessThan(470.5);expect(p[2]).toBeGreaterThan(0);});
 it('床へのクリックを写真と同じ座標へ戻し、長い跡の接写も四隅を切らない',()=>{
  for(let i=0;i<4;i++){const room=archiveOldPlan[i].room,r=oldFootprint(i),x=r.x+(room===7?-4.2:0),eye=archiveTraceEye(i,0);for(const point of [[x,r.y,0],[x+r.width,r.y,0],[x+r.width,r.y+r.depth,0],[x,r.y+r.depth,0]] as const){const p=archiveProjectEye(point,eye);expect(p[0]).toBeGreaterThan(100);expect(p[0]).toBeLessThan(1572);expect(p[1]).toBeGreaterThan(80);expect(p[1]).toBeLessThan(861);const hit=archiveFloorPoint(p[0],p[1],eye)!;expect(hit[0]).toBeCloseTo(point[0]);expect(hit[1]).toBeCloseTo(point[1]);}}
  expect(archiveFloorPoint(836,0,archiveRoomEye(6,0))).toBeNull();
 });
});
