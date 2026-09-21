import {archiveLookAt,archiveProjectEye,archiveRoomEye} from './archiveSpace';
/** The paper drawing and the old floor scars share these physical footprints. */
export const archiveOldPlan=[
 {key:'a',room:7,rect:[115,120,74,34],front:'south'},
 {key:'b',room:7,rect:[100,340,170,34],front:'north'},
 {key:'c',room:6,rect:[425,188,75,50],front:'east'},
 {key:'d',room:6,rect:[340,128,103,37],front:'south'},
] as const;
export const oldFootprint=(index:number)=>{const s=archiveOldPlan[index],[x,y,width,depth]=s.rect,left=s.room===7?70:300,scaleX=4.2/(s.room===7?230:240),scaleY=5.2/320;return {x:(x-left)*scaleX,y:(y-90)*scaleY,width:width*scaleX,depth:depth*scaleY};};
export function archiveTraceEye(index:number,facing:number){const room=archiveOldPlan[index].room,r=oldFootprint(index),x=r.x+(room===7?-4.2:0),eye=archiveLookAt([x+r.width/2,r.y+r.depth/2,0],facing,{...archiveRoomEye(room,facing),focal:1200});const corners=[[x,r.y],[x+r.width,r.y],[x+r.width,r.y+r.depth],[x,r.y+r.depth]].map(([x,y])=>archiveProjectEye([x,y,0],eye));const ratio=Math.min(1,...corners.flatMap(p=>[716/Math.abs(p[0]-eye.centerX),380/Math.abs(p[1]-eye.centerY)]));return {...eye,focal:eye.focal*ratio};}
