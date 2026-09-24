import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {repairEastBench} from './repairSpace';
export const cradleHome={u:.52,v:.24,z:.82};
export const cradleWorld=([u,v,z]:ShelfPoint):ShelfPoint=>[repairEastBench.x-cradleHome.v-v,repairEastBench.y+cradleHome.u+u,cradleHome.z+z];
export const cradleEye=(side=false)=>{const eye=cradleWorld(side?[-.30,.70,.15]:[.16,.75,.68]),target=cradleWorld(side?[.16,.11,.045]:[.16,.13,.10]);return archiveLookAt(target,1,{x:eye[0],y:eye[1],height:eye[2],focal:side?1200:1600,centerX:500,centerY:450});};
