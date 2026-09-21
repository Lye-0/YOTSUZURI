import {OpticalWorld} from './OpticalWorld';
import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid} from './PhotoCuboid';
import {RepairBench} from './RepairBench';
import {repairEntrance as door,repairEastBench as east,repairSouthBench as south} from './repairSpace';
import {TiledSurface} from './TiledSurface';
import type {ArchiveEye} from './archiveSpace';
// Both sides of the archive threshold share the same coordinates and door leaf.
export function RepairWorld({g,eye}:{g:World;eye:ArchiveEye}){return <>
 <TiledSurface x={4.2} y={0} z={0} width={4.2} height={5.2} tilt={90} id="floor" group="scenes/repair" eye={eye}/>
 <TiledSurface x={4.2} y={5.2} z={2.8} width={4.2} height={5.2} tilt={-90} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={4.2} y={0} z={2.8} width={4.2} height={2.8} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={8.4} y={5.2} z={2.8} width={4.2} height={2.8} turn={180} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={8.4} y={0} z={2.8} width={5.2} height={2.8} turn={-90} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={4.203} y={5.2} z={2.8} width={5.2} height={2.8} turn={90} id="plaster" group="scenes/repair" eye={eye} cuts={[[5.2-door.end,2.8-door.height,door.end-door.start,door.height]]}/>
 {[door.start-.045,door.end].map(y=><PhotoCuboid key={y} x={4.198} y={y} z={0} width={.065} depth={.045} height={2.145} texture={{id:'bench-front',group:'parts/repair',crop:[.072,.26,.043,.63]}}/>)}
 <PhotoCuboid x={4.198} y={door.start-.045} z={2.08} width={.065} depth={door.end-door.start+.09} height={.065} texture={{id:'bench-front',group:'parts/repair',crop:[.13,.25,.74,.13]}}/>
 <Face x={8.383} y={.9} z={2.62} width={1.4} height={1.35} turn={-90}><Photograph id="window" group="parts/repair"/></Face>
 <RepairBench x={east.x} y={east.y} turn={-90} width={east.width} depth={east.depth}/>
 <RepairBench x={south.x} y={south.y} turn={180}/>
 <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${south.x*500}px,0,${south.y*500}px) rotateY(180deg)`}}><OpticalWorld g={g}/></div>
 </>;}
