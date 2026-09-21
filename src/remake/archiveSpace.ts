export type ShelfPoint=readonly [number,number,number];
export type ShelfState=readonly number[];
export const archiveRoom={width:4.2,depth:5.2,height:2.8,eastDoor:[2.925,4.0625] as const,westDoor:[2.58375,3.8025] as const,southDoor:[1.4,2.45] as const,passage:.65};
export const archiveCamera={x:2.3,y:3.5,height:1.6,pitch:18,focal:650,width:1672,heightPx:941,scale:500};
export const shelfSpecs=[
 {key:'a',x:1.65,y:.15,width:1.35,depth:.55,height:1.02,handleFace:'south',axis:'y',stops:[.15,.3,.6,.9,1.2]},
 {key:'b',x:3.6,y:1.5,width:.55,depth:2.9,height:2.3,handleFace:'west',axis:'y',stops:[0,.25,.5,.75,1,1.25,1.5,1.75,2,2.3]},
 {key:'c',x:1,y:.85,width:.81,depth:1.31,height:1.3,handleFace:'south',axis:'x',stops:[1,1.5,2,2.5,3,3.3]},
 {key:'d',x:3.35,y:.1,width:.8,depth:.6,height:1.4,handleFace:'south',axis:'x',stops:[0,.85,1.7,2.55,3.35]},
] as const;
export const initialShelves=()=>[0,6,0,4];
export type ShelfRect={x:number;y:number;width:number;depth:number;height:number};
export function shelfRect(values:ShelfState,index:number):ShelfRect{const s=shelfSpecs[index],position=s.stops[values[index]];return {x:s.axis==='x'?position:s.x,y:s.axis==='y'?position:s.y,width:s.width,depth:s.depth,height:s.height};}
export function shelvesOverlap(a:ShelfRect,b:ShelfRect){const e=1e-7;return a.x<b.x+b.width-e&&a.x+a.width>b.x+e&&a.y<b.y+b.depth-e&&a.y+a.depth>b.y+e;}
export function validShelves(v:unknown):v is number[]{if(!Array.isArray(v)||v.length!==4||v.some((n,i)=>!Number.isInteger(n)||n<0||n>=shelfSpecs[i].stops.length))return false;for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)if(shelvesOverlap(shelfRect(v,i),shelfRect(v,j)))return false;return true;}
export function shelfMoveBlocker(v:ShelfState,index:number,position:number){
 if(!Number.isInteger(index)||index<0||index>3||!Number.isInteger(position)||position<0||position>=shelfSpecs[index].stops.length)return -2;
 const from=shelfRect(v,index),to=shelfRect(v.map((n,i)=>i===index?position:n),index),sweep={...from,x:Math.min(from.x,to.x),y:Math.min(from.y,to.y),width:from.width+Math.abs(to.x-from.x),depth:from.depth+Math.abs(to.y-from.y)};
 if(to.x<0||to.y<0||to.x+to.width>archiveRoom.width+1e-7||to.y+to.depth>archiveRoom.depth+1e-7)return -2;
 return shelfSpecs.findIndex((_,i)=>i!==index&&shelvesOverlap(sweep,shelfRect(v,i)));
}
export function canMoveShelf(v:ShelfState,index:number,position:number){return validShelves(v)&&position!==v[index]&&shelfMoveBlocker(v,index,position)===-1;}
/** A partly exposed doorway is usable when an actual person-sized interval is free. */
export function archiveDoorWidth(v:ShelfState){
 let free:[number,number][]=[[...archiveRoom.eastDoor]];
 for(let i=0;i<4;i++){const r=shelfRect(v,i);if(r.x+r.width<archiveRoom.width-archiveRoom.passage)continue;free=free.flatMap(([a,b])=>r.y>=b||r.y+r.depth<=a?[[a,b]] as [number,number][]:[[a,Math.max(a,Math.min(b,r.y))],[Math.min(b,Math.max(a,r.y+r.depth)),b]].filter(([x,y])=>y>x) as [number,number][]);}
 return Math.max(0,...free.map(([a,b])=>b-a));
}
export const archivePassable=(v:ShelfState)=>archiveDoorWidth(v)>=archiveRoom.passage-1e-7;
export type ArchiveEye={x:number;y:number;height:number;pitch:number;focal:number;heading:number;centerX:number;centerY:number};
export const archiveEye=(facing:number,overrides:Partial<ArchiveEye>={}):ArchiveEye=>({x:archiveCamera.x,y:archiveCamera.y,height:archiveCamera.height,pitch:archiveCamera.pitch,focal:archiveCamera.focal,heading:facing*90,centerX:archiveCamera.width/2,centerY:archiveCamera.heightPx/2,...overrides});
export const archiveRoomEye=(room:6|7,facing:number)=>archiveEye(facing,room===7?{x:-2.3,y:2.6,pitch:20,focal:630}:{});
export function archiveView([x,y,z]:ShelfPoint,eye:ArchiveEye){const dx=x-eye.x,dy=y-eye.y,dz=z-eye.height,yaw=eye.heading*Math.PI/180,p=eye.pitch*Math.PI/180,right=Math.cos(yaw)*dx+Math.sin(yaw)*dy,depth=Math.sin(yaw)*dx-Math.cos(yaw)*dy;return [right,Math.sin(p)*depth+Math.cos(p)*dz,Math.cos(p)*depth-Math.sin(p)*dz] as const;}
export const archiveViewPoint=(point:ShelfPoint,facing:number)=>archiveView(point,archiveEye(facing));
export function archiveProjectEye(point:ShelfPoint,eye:ArchiveEye){const [right,up,depth]=archiveView(point,eye);return [eye.centerX+eye.focal*right/depth,eye.centerY-eye.focal*up/depth,depth] as const;}
export const archiveProject=(point:ShelfPoint,facing:number)=>archiveProjectEye(point,archiveEye(facing));
export function archiveLookAt(point:ShelfPoint,facing:number,overrides:Partial<ArchiveEye>={}):ArchiveEye{const e=archiveEye(facing,overrides),dx=point[0]-e.x,dy=point[1]-e.y;return {...e,heading:Math.atan2(dx,-dy)*180/Math.PI,pitch:Math.atan2(e.height-point[2],Math.hypot(dx,dy))*180/Math.PI,focal:overrides.focal??1450};}
export function archiveFloorPoint(x:number,y:number,eye:ArchiveEye):ShelfPoint|null{const right=(x-eye.centerX)/eye.focal,up=(eye.centerY-y)/eye.focal,p=eye.pitch*Math.PI/180,yaw=eye.heading*Math.PI/180,dz=Math.cos(p)*up-Math.sin(p),depth=Math.sin(p)*up+Math.cos(p);if(dz>=0)return null;const t=-eye.height/dz;return [eye.x+t*(Math.cos(yaw)*right+Math.sin(yaw)*depth),eye.y+t*(Math.sin(yaw)*right-Math.cos(yaw)*depth),0];}
export function archivePickShelf(values:ShelfState,x:number,y:number,eye:ArchiveEye){
 const right=(x-eye.centerX)/eye.focal,up=(eye.centerY-y)/eye.focal,p=eye.pitch*Math.PI/180,yaw=eye.heading*Math.PI/180,depth=Math.sin(p)*up+Math.cos(p),direction=[Math.cos(yaw)*right+Math.sin(yaw)*depth,Math.sin(yaw)*right-Math.cos(yaw)*depth,Math.cos(p)*up-Math.sin(p)],origin=[eye.x,eye.y,eye.height];
 let hit=-1,distance=Infinity;
 for(let i=0;i<4;i++){const r=shelfRect(values,i),lo=[r.x,r.y,0],hi=[r.x+r.width,r.y+r.depth,r.height];let near=0,far=Infinity;
  for(let axis=0;axis<3;axis++){const d=direction[axis];if(Math.abs(d)<1e-9){if(origin[axis]<lo[axis]||origin[axis]>hi[axis]){far=-1;break;}}else{const a=(lo[axis]-origin[axis])/d,b=(hi[axis]-origin[axis])/d;near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));}}
  if(far>=near&&near<distance){hit=i;distance=near;}
 }return hit;
}
export function archiveRayClear(values:ShelfState,target:ShelfPoint,exclude=-1,eye=archiveEye(0)){
 const origin=[eye.x,eye.y,eye.height];
 for(let i=0;i<4;i++){if(i===exclude)continue;const r=shelfRect(values,i),lo=[r.x,r.y,0],hi=[r.x+r.width,r.y+r.depth,r.height];let near=0,far=1;
  for(let axis=0;axis<3;axis++){const d=target[axis]-origin[axis];if(Math.abs(d)<1e-9){if(origin[axis]<lo[axis]||origin[axis]>hi[axis]){far=-1;break;}}else{const a=(lo[axis]-origin[axis])/d,b=(hi[axis]-origin[axis])/d;near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));}}
  if(far>=Math.max(near,1e-5)&&near<1-1e-5)return false;
 }
 return true;
}
export const archiveDoorHandle:ShelfPoint=[4.19,3.965,1.12];
export const archiveDoorPoint=(open:boolean):ShelfPoint=>open?[4.2+3.965-archiveRoom.eastDoor[0],archiveRoom.eastDoor[0]+.005,1.12]:archiveDoorHandle;
export const archiveDoorBackPoint=(open:boolean):ShelfPoint=>open?[4.2+3.965-archiveRoom.eastDoor[0],archiveRoom.eastDoor[0]-.03,1.12]:[4.23,3.965,1.12];
export const shelfNames=['低い書架','補修板のある長い書架','奥行きのある棚','赤い本の書架'] as const;
export function shelfHandlePoint(v:ShelfState,i:number):ShelfPoint{const r=shelfRect(v,i),z=[.93,1.04,1.19,1.34][i];return shelfSpecs[i].handleFace==='west'?[r.x-.005,r.y+r.depth/2,z]:[r.x+r.width/2,r.y+r.depth+.005,z];}
export function shelfFootPoint(v:ShelfState,i:number,end:number):ShelfPoint{const r=shelfRect(v,i),ratio=end?1-[.03,.04,.075,.03][i]:[.03,.04,.075,.03][i],z=i===1?.11:.04;return shelfSpecs[i].handleFace==='west'?[r.x,r.y+r.depth*ratio,z]:[r.x+r.width*ratio,r.y+r.depth,z];}
export function nearestShelfFoot(v:ShelfState,i:number){const a=shelfFootPoint(v,i,0),b=shelfFootPoint(v,i,1),distance=(p:ShelfPoint)=>Math.hypot(p[0]-archiveCamera.x,p[1]-archiveCamera.y);return distance(a)<=distance(b)?0:1;}
