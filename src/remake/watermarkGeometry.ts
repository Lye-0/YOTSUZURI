import {archiveLookAt} from './archiveSpace';
export const WATERMARK_FRAME={width:1000,height:900};
export const watermarkTable={x:-1.8,y:.1,z:.82,width:1.65,depth:.65};
export const candidatePlaces=[[.82,.035],[1.10,.035],[1.38,.035],[.82,.33],[1.10,.33]] as const;
export const gatheringPlaces=[[.09,.385],[.315,.385],[.54,.385]] as const;
export const inspectionPlace=[.465,.07] as const;
export function watermarkEye(detail=false){const t=watermarkTable;return archiveLookAt(detail?[t.x+.37,t.y+.17,.862]:[t.x+t.width/2,t.y+.35,t.z],0,detail?{x:t.x+.37,y:1,height:1.65,focal:1800,centerX:500,centerY:450}:{x:t.x+t.width/2,y:1.0,height:2.0,focal:700,centerX:500,centerY:450});}
