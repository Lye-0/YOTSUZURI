import type {World} from './campaign';
import {archiveLookAt,type ArchiveEye,type ShelfPoint} from './archiveSpace';
import {scaleAngle,weighingValues} from './weighing';
export const WEIGHING_FRAME={width:1000,height:900};
export const weighingTable={x:-4.1,y:2.8,z:.82,width:1.65,depth:.65};
export const bookSize={width:.22,depth:.27,height:.045};
export const bookHomes=[[1.1,.03],[1.38,.03],[1.1,.35],[1.38,.35]] as const;
export const saddleRows=[.026,.112,.198];
export const looseSaddles=[[.43,.375],[.73,.375],[.43,.455],[.73,.455],[.43,.535],[.73,.535]] as const;
export const scalePivot={x:.32,y:.285,z:1.26};
export const weighingWorld=([x,y,z]:ShelfPoint):ShelfPoint=>[weighingTable.x+y,weighingTable.y-x,z];
export const weighingLocalEye=(eye:ArchiveEye)=>({x:weighingTable.y-eye.y,y:eye.x-weighingTable.x,z:eye.height});
export function beamPoint(g:World,x:number,z=0):ShelfPoint{const a=scaleAngle(g)*Math.PI/180;return [scalePivot.x+x*Math.cos(a)+z*Math.sin(a),scalePivot.y,scalePivot.z-x*Math.sin(a)+z*Math.cos(a)];}
export const panPosition=(g:World)=>{const a=beamPoint(g,-.18,-.027);return {x:a[0]-.15,y:a[1],z:a[2]-.22};};
export const riderPoint=(g:World)=>beamPoint(g,.045+weighingValues(g)[1]*.0375,.0175);
export function bookPosition(g:World,index:number){if(weighingValues(g)[0]===index){const p=panPosition(g);return {x:p.x+.04,y:p.y+.015,z:p.z+.002};}const [x,y]=bookHomes[index];return {x,y,z:.822};}
export function looseSaddlePosition(g:World,index:number){if(weighingValues(g)[0]===index+4){const p=panPosition(g);return {x:p.x+.036,y:p.y+.135,z:p.z+.002};}const [x,y]=looseSaddles[index];return {x,y,z:.822};}
export type WeighingDetail={kind:'weighing-scale'}|{kind:'weighing-tray'}|{kind:'weighing-book';index:number;side:'cover'|'spine'};
export function weighingEye(g:World,detail?:WeighingDetail){
 let eye:ShelfPoint,target:ShelfPoint,focal:number;
 if(detail?.kind==='weighing-scale'){eye=[.665,.94,1.50];target=[.665,.285,1.26];focal=1000;}
 else if(detail?.kind==='weighing-tray'){eye=[.695,.93,1.40];target=[.695,.475,.86];focal=1000;}
 else if(detail?.kind==='weighing-book'){const b=bookPosition(g,detail.index);if(detail.side==='cover'){eye=[b.x+.11,b.y+.46,b.z+.60];target=[b.x+.11,b.y+.135,b.z+.045];focal=1400;}else{eye=[b.x-.28,b.y+.43,b.z+.30];target=[b.x-.005,b.y+.135,b.z+.025];focal=1050;}}
 else{eye=[.76,1.22,1.88];target=[.76,.33,1.04];focal=540;}
 const e=weighingWorld(eye);return archiveLookAt(weighingWorld(target),3,{x:e[0],y:e[1],height:e[2],focal,centerX:500,centerY:450});
}
