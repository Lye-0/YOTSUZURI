import {archiveLookAt,type ShelfPoint} from './archiveSpace';
export const studyTable={x:4.32,y:-2.15};
export const studyPoint=([u,v,z]:ShelfPoint):ShelfPoint=>[studyTable.x+v,studyTable.y-u,z];
export const studyHinge=(i:number)=>.18+.24*i;
export const studyEye=(index?:number)=>archiveLookAt(studyPoint([index===undefined?.8:studyHinge(index),index===undefined?.26:.105,.83]),3,{x:index===undefined?5.48:4.67,y:studyTable.y-(index===undefined?.8:studyHinge(index)),height:index===undefined?1.72:1.16,focal:index===undefined?650:1500,centerX:500,centerY:450});
export const blankPosition=(slot:number,packet:number):ShelfPoint=>slot<0?[.35+packet*.55,.44,.83]:[studyHinge(slot)-.10,.245,.83];
