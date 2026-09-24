import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {ArchiveBench} from './ArchiveBench';
import {joinerySpace} from './FrameBody';
import {rubbingValues} from './rubbing';
import {rubbingTable,mouldCentre,tissueRect} from './rubbingGeometry';
import {RubbingPaper} from './RubbingPaper';
export function RubbingWorld({g}:{g:World}){const v=rubbingValues(g),front=v[0]===1,poly=front?[[0,.0208],[.0194,0],[.12,0],[.12,.08],[0,.08]]:[[0,0],[.1006,0],[.12,.0208],[.12,.08],[0,.08]],paper=tissueRect(g);return <><ArchiveBench {...rubbingTable}/><div style={{...joinerySpace,transform:`translate3d(${rubbingTable.x*500}px,0,${rubbingTable.y*500}px)`}}>
 <div style={{...joinerySpace,transform:`translate3d(${mouldCentre[0]*500}px,0,${mouldCentre[1]*500}px) rotateY(${-v[1]*90}deg)`}}><div style={{...joinerySpace,transform:'translate3d(-30px,0,-20px)'}}>
 <Face x={0} y={0} z={.828} width={.12} height={.08} tilt={90} resolution={16}><Photograph id={front?'mould-working':'mould-back'} group="parts/rubbing"/></Face>
 {poly.map((a,i)=>{const b=poly[(i+1)%poly.length],dx=a[0]-b[0],dy=a[1]-b[1];return <Face key={i} x={b[0]} y={b[1]} z={.828} width={Math.hypot(dx,dy)} height={.006} turn={Math.atan2(-dy,dx)*180/Math.PI}><Photograph id="mould-working" group="parts/rubbing" crop={[.25,.061,.65,.040]}/></Face>})}
 </div></div>
 <Face x={.28} y={.405} z={.830} width={.06} height={.02} tilt={90} resolution={10}><Photograph id="rubbing-charcoal" group="parts/rubbing"/></Face>
 <Face x={.40} y={.40} z={.830} width={.04} height={.03} tilt={90} resolution={10}><Photograph id="rubbing-eraser" group="parts/rubbing"/></Face>
 {g.placed[25]?.includes('tissue')?<div className="rubbing-moving-paper" style={{...joinerySpace,transform:`translate3d(${paper.x*500}px,${-paper.z*500}px,${paper.y*500}px)`,transition:g.reducedMotion?'none':undefined}}><Face x={0} y={0} z={0} width={paper.width} height={paper.depth} tilt={90} resolution={16}><RubbingPaper g={g}/></Face></div>:null}
 </div></>;}
