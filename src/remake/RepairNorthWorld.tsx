import {EvidenceLock} from './EvidenceLock';
import {lockValues} from './evidenceLocks';
import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {repairPanels,secretDoor,coverBoard,panelUncovered} from './repairNorth';
import {photoBounds} from './photoBounds';
import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
const group='parts/repair',wood:PhotoTexture={id:'panel-target',group,crop:[.30,.35,.30,.40]};
export function CoverWood(){const p=photoBounds['parts/repair/cover-short'];if(!p)return null;return <svg viewBox="0 0 130 550" width="100%" height="100%" preserveAspectRatio="none"><g transform="translate(130 0) rotate(90)"><svg width="550" height="130" viewBox={p.bounds.join(' ')} preserveAspectRatio="none"><image href={import.meta.env.BASE_URL+'remake/parts/repair/cover-short.webp'} width={p.width} height={p.height}/></svg></g></svg>;}
export function RepairNorthWorld({g,eye,pixelScale}:{g:World;eye:ArchiveEye;pixelScale:number}){return <>
 {repairPanels.map((panel,index)=>{const uncovered=panelUncovered(g,index),open=index===1&&g.flags.secret,top=archiveProjectEye([panel.x+(open?0:.5),secretDoor.y+(open?-.5:.036),2.1],eye),bottom=archiveProjectEye([panel.x+(open?0:.5),secretDoor.y+(open?-.5:.036),0],eye),resolution=top[2]>.05&&bottom[2]>.05?Math.max(.125,Math.min(2,Math.hypot(top[0]-bottom[0],top[1]-bottom[1])*pixelScale/1050*1.25)):1;return <div key={panel.id} style={{display:'contents'}}>
 <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${panel.x*500}px,0,${secretDoor.y*500}px) rotateY(${open?90:0}deg)`}}>
 <Face resolution={resolution} x={0} y={.018} z={2.1} width={1} height={2.1}><Photograph id={panel.id} group={group}/></Face>
 <Face resolution={resolution} x={1} y={-.018} z={2.1} width={1} height={2.1} turn={180}><Photograph {...wood}/></Face>
 <PhotoCuboid x={.975} y={-.018} z={0} width={.025} depth={.036} height={2.07} texture={wood}/>
 <PhotoCuboid x={.025} y={-.018} z={0} width={.025} depth={.036} height={2.07} texture={wood}/>
 {uncovered&&!open?<Face x={.40} y={.044} z={1.15} width={.30} height={.44}><EvidenceLock values={lockValues(g.flags,`repair:setting:${index}`)}/></Face>:null}
 {!uncovered?<Face x={coverBoard.u} y={.042} z={coverBoard.top} width={coverBoard.width} height={coverBoard.height}><CoverWood/></Face>:null}
 </div>
 {uncovered?<Face x={panel.x-.12} y={.12} z={.56} width={coverBoard.width} height={coverBoard.height} tilt={10}><CoverWood/></Face>:null}
 </div>;})}
 </>;}
