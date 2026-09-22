import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {frameRails} from './joinery';
export const joineryTable={x:8.27,y:-4.2};
export const joineryPoint=([u,v,z]:ShelfPoint):ShelfPoint=>[joineryTable.x-v,joineryTable.y+u,z];
export const frameOrigin={x:.60,y:.15,z:.820};
export const railCentres=[[.18,.015],[.345,.15],[.18,.285],[.015,.15]] as const;
export const looseRailCentres=[[.30,.27],[.27,.36],[.30,.45],[.27,.54]] as const;
export function railPose(v:readonly number[],i:number){const slot=v[i],c=slot<0?looseRailCentres[i]:railCentres[slot];return {x:c[0]+(slot<0?0:frameOrigin.x),y:c[1]+(slot<0?0:frameOrigin.y),z:slot<0?.822:frameOrigin.z,rotation:v[i+4],flip:v[i+8]};}
export function railCorners(v:readonly number[],i:number){const p=railPose(v,i),a=p.rotation*Math.PI/2,l=frameRails[i].length;return [[-l/2,-.015],[l/2,-.015],[l/2,.015],[-l/2,.015]].map(([x,y])=>[p.x+x*Math.cos(a)-y*Math.sin(a),p.y+x*Math.sin(a)+y*Math.cos(a),p.z+.018] as ShelfPoint);}
export const joineryEye=(piece?:number,v?:readonly number[])=>{const p=piece!==undefined&&piece>=0&&v?railPose(v,piece):{x:.72,y:.34,z:.84},target=joineryPoint([p.x,p.y,p.z]),close=piece!==undefined;return archiveLookAt(target,1,{x:piece===-1?target[0]-.55:close?target[0]-.62:7.10,y:target[1]-(close?.08:0),height:piece===-1?1.26:close?p.z+.40:1.78,focal:piece===-1?1100:close?1050:700,centerX:500,centerY:450});};
