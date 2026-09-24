import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {archiveView,type ArchiveEye} from './archiveSpace';
import {PlateDrawers} from './PlateDrawers';
import {Balance} from './Balance';
import {WorkshopPortals} from './WorkshopPortals';
/** Side walls visible when looking obliquely through the archive's south doorway. */
export function TypeSideBackdrop({g,eye}:{g:World;eye:ArchiveEye}){return <>{([1,3] as const).map(facing=>{const x=facing===1?4.2:0,y=facing===1?5.2:8.5,turn=facing===1?-90:90,sg={...g,room:3,facing,focus:'room' as const},points=[[x,5.2,0],[x,8.5,0],[x,5.2,3.37],[x,8.5,3.37]];if(points.some(p=>archiveView([p[0],p[1],p[2]],eye)[2]<.05))return null;return <Face key={facing} x={x} y={y} z={3.37} width={3.3} height={3.37} turn={turn}><div style={{position:'absolute',inset:0,overflow:'hidden'}}><div style={{position:'absolute',inset:'0 0 -18%'}}><Photograph id={facing===1?'east':'west'} group="scenes/type"/>{facing===1?<Balance g={sg} act={()=>{}} wide enabled={false}/>:<PlateDrawers g={sg} act={()=>{}} wide enabled={false}/>}<WorkshopPortals g={sg} act={()=>{}}/></div></div></Face>;})}</>;}

