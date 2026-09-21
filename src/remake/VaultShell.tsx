import type {ArchiveEye} from './archiveSpace';
import {TiledSurface} from './TiledSurface';
/** Common coordinates for the room beyond the north doorway; mechanisms are added to this shell. */
export function VaultShell({eye}:{eye:ArchiveEye}){return <>
 <TiledSurface x={4.2} y={-5.2} z={0} width={4.2} height={5.2} tilt={90} id="floor" group="scenes/repair" eye={eye}/>
 <TiledSurface x={4.2} y={0} z={2.8} width={4.2} height={5.2} tilt={-90} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={4.2} y={-5.2} z={2.8} width={4.2} height={2.8} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={8.4} y={-5.2} z={2.8} width={5.2} height={2.8} turn={-90} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={4.2} y={0} z={2.8} width={5.2} height={2.8} turn={90} id="plaster" group="scenes/repair" eye={eye}/>
 <TiledSurface x={8.4} y={0} z={2.8} width={4.2} height={2.8} turn={180} id="plaster" group="scenes/repair" eye={eye} cuts={[[1.63,.75,.92,2.05]]}/>
 </>;}
