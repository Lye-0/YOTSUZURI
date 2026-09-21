import type {World} from './campaign';
import type {ArchiveEye} from './archiveSpace';
import {WorldCamera} from './WorldCamera';
import {RepairWorld} from './RepairWorld';
/** The photograph's real alpha aperture reveals a second view of the same physical scene. */
export function MagnifyingLens({g,eye,scale,point}:{g:World;eye:ArchiveEye;scale:number;point:readonly [number,number]}){
 const diameter=128,r=diameter/2,modelRadius=r/scale,zoom=2.6,photoScale=diameter/587,cx=379.5,cy=500.5;
 const enlarged={...eye,focal:eye.focal*zoom,centerX:modelRadius+(eye.centerX-point[0])*zoom,centerY:modelRadius+(eye.centerY-point[1])*zoom};
 return <div style={{position:'absolute',left:point[0]*scale,top:point[1]*scale,width:0,height:0,pointerEvents:'none'}}>
 <div style={{position:'absolute',left:-r,top:-r,width:diameter,height:diameter,borderRadius:'50%',overflow:'hidden',background:'#23231d'}}><WorldCamera eye={enlarged} frame={{width:2*modelRadius,height:2*modelRadius}} scale={scale}><RepairWorld g={g} eye={enlarged} pixelScale={scale}/></WorldCamera></div>
 <img src={import.meta.env.BASE_URL+'remake/parts/lens-frame.webp'} alt="" draggable={false} style={{position:'absolute',left:-cx*photoScale,top:-cy*photoScale,width:1536*photoScale,height:1024*photoScale,maxWidth:'none'}}/>
 </div>;
}
