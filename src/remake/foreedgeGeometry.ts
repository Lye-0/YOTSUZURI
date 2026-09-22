import type {World} from './campaign';
import {archiveLookAt,type ShelfPoint} from './archiveSpace';
import {repairSouthPoint} from './repairSpace';
import {cradleSlope,CRADLE_THICKNESS} from './cradle';
import {foreedgeMounted,foreedgeHeight,foreedgeView} from './foreedge';
export const foreedgeHome={u:1.18,v:.10,z:.823},bareGatherings={u:1.72,v:.16,z:.823};
export type ForeedgeView='all'|'edge'|'painting';
export const foreedgeFrame=(view:ForeedgeView)=>view==='all'?{width:1000,height:900}:{width:1000,height:800};
/** Paper coordinates start at the back-left bottom of the very same six gatherings. */
export function foreedgePoint(g:World,[x,y,z]:ShelfPoint,mounted=foreedgeMounted(g)):ShelfPoint{
 if(!mounted)return repairSouthPoint([bareGatherings.u+x,bareGatherings.v+y,bareGatherings.z+z]);
 x+=z*(foreedgeView(g)-1)*.35;
 const a=cradleSlope*Math.PI/180,v=.06+y,h=CRADLE_THICKNESS+z;
 return repairSouthPoint([foreedgeHome.u+.06+x,foreedgeHome.v+v*Math.cos(a)-h*Math.sin(a),foreedgeHome.z+CRADLE_THICKNESS+v*Math.sin(a)+h*Math.cos(a)]);
}
export function foreedgeEye(g:World,view:ForeedgeView='all'){
 if(view==='all')return archiveLookAt(repairSouthPoint([1.59,.24,.91]),2,{x:6.11,y:4.16,height:1.50,focal:950,centerX:500,centerY:450});
 const frame=foreedgeFrame(view),height=foreedgeHeight(g),target=foreedgePoint(g,[.10,.12,height/2]),eye=foreedgePoint(g,[.10,.70,height/2+.09]);
 return archiveLookAt(target,2,{x:eye[0],y:eye[1],height:eye[2],focal:1500,centerX:frame.width/2,centerY:frame.height/2});
}
