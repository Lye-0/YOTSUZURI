import {archiveLookAt,type ShelfPoint} from './archiveSpace';
export const masterTable={x:-2.85,y:.13};
export const masterCentres=[.36,1.22] as const;
export const masterPoint=([u,v,z]:ShelfPoint):ShelfPoint=>[masterTable.x+u,masterTable.y+v,z];
export const masterEye=(index?:number)=>archiveLookAt(masterPoint([index===undefined?.825:masterCentres[index],index===undefined?.24:.27,.83]),0,{x:masterTable.x+(index===undefined?.825:masterCentres[index]),y:masterTable.y+(index===undefined?1.20:.95),height:index===undefined?1.62:1.45,focal:index===undefined?850:2200,centerX:500,centerY:index===undefined?450:430});
