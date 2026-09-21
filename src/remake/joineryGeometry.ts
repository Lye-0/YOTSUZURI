import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {frameRails} from './joinery';
export const joineryTable={x:8.27,y:-4.2};
export const joineryPoint=([u,v,z]:ShelfPoint):ShelfPoint=>[joineryTable.x-v,joineryTable.y+u,z];
export const frameOrigin={x:.60,y:.15,z:.820};
export const railCentres=[[.18,.015],[.345,.15],[.18,.285],[.015,.15]] as const;
export const looseRailCentres=[[.18,.25],[.38,.48],[1.16,.25],[1.42,.48]] as const;
export function railPose(v:readonly number[],i:number){const slot=v[i],c=slot<0?looseRailCentres[i]:railCentres[slot];return {x:c[0]+(slot<0?0:frameOrigin.x),y:c[1]+(slot<0?0:frameOrigin.y),z:slot<0?.822:frameOrigin.z,rotation:v[i+4],flip:v[i+8]};}
export function railCorners(v:readonly number[],i:number){const p=railPose(v,i),a=p.rotation*Math.PI/2,l=frameRails[i].length;return [[-l/2,-.015],[l/2,-.015],[l/2,.015],[-l/2,.015]].map(([x,y])=>[p.x+x*Math.cos(a)-y*Math.sin(a),p.y+x*Math.sin(a)+y*Math.cos(a),p.z+.018] as ShelfPoint);}
export const joineryEye=(piece?:number,v?:readonly number[])=>{const p=piece!==undefined&&v?railPose(v,piece):{x:.80,y:.3,z:.84},close=piece!==undefined;return archiveLookAt(joineryPoint([p.x,p.y,p.z]),1,{x:close?7.57:7.10,y:joineryTable.y+p.x,height:close?1.38:1.78,focal:close?1200:650,centerX:500,centerY:450});};
