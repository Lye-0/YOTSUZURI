import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import type {World} from './campaign';
import {Face} from './ArchivePhotos';
import {PhotoCuboid} from './PhotoCuboid';
import {ArchiveBench} from './ArchiveBench';
import {cutawayModel as m,modelPixel} from './cutawayGeometry';
import {cutawayOpen} from './cutaway';
import {CutawayArt} from './CutawayArt';
const wood={id:'model',group:'parts/cutaway',crop:[90/1435,40/1096,940/1435,70/1096] as const};
export function CutawayWorld({g,eye,pixelScale=1}:{g:World;eye?:ArchiveEye;pixelScale?:number}){const a=eye?archiveProjectEye([m.x,m.y,m.z+m.height],eye):null,b=eye?archiveProjectEye([m.x,m.y,m.z],eye):null,resolution=a&&b&&a[2]>.05&&b[2]>.05?Math.max(.25,Math.min(4,Math.hypot(a[0]-b[0],a[1]-b[1])*pixelScale/(m.height*500)*1.1)):1;return <>
 <ArchiveBench x={6.55} y={-5.05}/>
 <PhotoCuboid x={m.x+.036} y={m.y-.08} z={m.z+.09} width={.631} depth={.08} height={.552} texture={wood}/>
 <PhotoCuboid x={m.x} y={m.y-.10} z={m.z} width={.708} depth={.16} height={.086} texture={wood}/>
 {cutawayOpen(g)?<PhotoCuboid x={modelPixel(1158,397)[0]} y={m.y+.004} z={modelPixel(1158,397)[2]} width={90/1470*m.width} depth={.020} height={47/1470*m.width} texture={{id:'steel-pin',group:'parts',crop:[450/887,300/1774,77/887,800/1774]}}/>:null}
 <Face x={m.x} y={m.y+.002} z={m.z+m.height} width={m.width} height={m.height} resolution={resolution}><CutawayArt g={g}/></Face>
 </>;}
