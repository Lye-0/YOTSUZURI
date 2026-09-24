import {archiveEye,archiveLookAt,type ArchiveEye,type ShelfPoint} from './archiveSpace';
export const repairRoom={x:4.2,y:0,width:4.2,depth:5.2,height:2.8};
export const repairEntrance={x:4.2,start:2.925,end:4.0625,height:2.08};
export const repairSouthBench={x:7.7,y:5.06,width:2.2,depth:.7,height:.82};
export const repairEastBench={x:8.27,y:1.0,width:1.65,depth:.65,height:.82};
export const repairSouthPoint=([u,v,z]:ShelfPoint):ShelfPoint=>[repairSouthBench.x-u,repairSouthBench.y-v,z];
export const repairEye=(facing:number):ArchiveEye=>archiveEye(facing,{x:6.3,y:2.75,height:1.65,pitch:14,focal:650});
export type OpticalView='all'|'light'|'catch';
export const opticalEye=(view:OpticalView='all')=>view==='light'?archiveLookAt(repairSouthPoint([.43,.34,.866]),2,{x:7.27,y:4.06,height:1.70,focal:1200,centerX:500,centerY:450}):view==='catch'?archiveLookAt(repairSouthPoint([1.24,.25,1.02]),2,{x:6.46,y:4.06,height:1.55,focal:950,centerX:500,centerY:450}):archiveLookAt(repairSouthPoint([.72,.32,.865]),2,{x:6.98,y:4.06,height:1.70,focal:650,centerX:500,centerY:450});
