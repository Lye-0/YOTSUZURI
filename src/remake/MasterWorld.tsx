import type {World} from './campaign';
import {ArchiveBench} from './ArchiveBench';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoSprite} from './PhotoSprite';
import {joinerySpace} from './FrameBody';
import {masterTable,masterCentres} from './masterGeometry';
import {masterPaperIndex} from './masters';
import {tissueTrace} from './rubbing';
import {RubbingPaper} from './RubbingPaper';
function OrientationCard({index}:{index:number}){return <svg viewBox="0 0 240 114" width="100%" height="100%" preserveAspectRatio="none"><PhotoSprite name="print-paper" x={0} y={0} width={240} height={114}/><g fill="none" stroke="#4b4033" strokeWidth="1.5" opacity=".82" transform={index===0?'translate(240 0) scale(-1 1)':undefined}>
 <path d="M48 14H184L198 69H42L27 55ZM48 19H182M46 23H182"/>
 {[0,1,2,3,4,5].map(i=><path key={i} d={`M${27+i*.7} ${55+i*4}L${42+i*.7} ${69+i*4}H${198+i*.7}`}/>)}
 <path d="M198 69l4 20M118 103v-9m-5 5 5-5 5 5"/>
 </g></svg>}
export function MasterWorld({g}:{g:World}){const active=masterPaperIndex(g),t=tissueTrace(g),w=t[4]%2?.095:.15,h=t[4]%2?.15:.095;return <><ArchiveBench {...masterTable}/><div style={{...joinerySpace,transform:`translate3d(${masterTable.x*500}px,0,${masterTable.y*500}px)`}}>
 {masterCentres.map((c,index)=>{const current=index===1,poly=current?[[0,0],[.12,0],[.12,.08],[.0194,.08],[0,.0592]]:[[0,0],[.12,0],[.12,.0592],[.1006,.08],[0,.08]];return <div key={index} style={{display:'contents'}}>
 <Face x={c-.12} y={.06} z={.821} width={.24} height={.114} tilt={90} resolution={9}><OrientationCard index={index}/></Face>
 <Face x={c-.06} y={.325} z={.828} width={.12} height={.08} tilt={90} resolution={16}><Photograph id={current?'current':'obsolete'} group="parts/masters"/></Face>
 {poly.map((a,i)=>{const b=poly[(i+1)%poly.length],dx=a[0]-b[0],dy=a[1]-b[1];return <Face key={i} x={c-.06+b[0]} y={.325+b[1]} z={.828} width={Math.hypot(dx,dy)} height={.008} turn={Math.atan2(-dy,dx)*180/Math.PI}><Photograph id="mould-working" group="parts/rubbing" crop={[.70,.062,.15,.04]}/></Face>})}
 {active===index?<Face x={c-w/2} y={.365-h/2} z={.838} width={w} height={h} tilt={90} resolution={16}><div style={{position:'absolute',inset:0,opacity:.67}}><RubbingPaper g={g}/></div></Face>:null}
 </div>})}
 </div></>;}
