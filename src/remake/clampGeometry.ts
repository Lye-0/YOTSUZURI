import type {World} from './campaign';
import {archiveLookAt} from './archiveSpace';
import {clampPlatenHeight} from './clamp';
export const clampWideEye=()=>archiveLookAt([.22,.19,.17],0,{x:-1.3,y:2.8,height:.95,focal:900,centerX:1360,centerY:494});
export const clampEye=(g:World,cams=false)=>cams?archiveLookAt([.22,.19,clampPlatenHeight(g)+.02],0,{x:.22,y:.191,height:.90,focal:1250,centerX:500,centerY:450}):archiveLookAt([.22,.19,.26],0,{x:-.40,y:.95,height:.72,focal:900,centerX:500,centerY:500});
