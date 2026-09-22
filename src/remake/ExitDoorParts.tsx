import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {RubbingPaper} from './RubbingPaper';
import {paperOnExit} from './exitReference';
import {tissueTrace} from './rubbing';
import {KeyParts} from './KeyParts';
import {joinerySpace} from './FrameBody';
import {exitPlate as plate} from './exitGeometry';
import {KEY_HEIGHT,KEY_PHOTO_SCALE} from './keyGeometry';
export function ExitDoorParts({g,resolution=1}:{g:World;resolution?:number}){const t=tissueTrace(g),w=t[4]%2?.095:.15,h=t[4]%2?.15:.095;return <>
 <Face x={-.854} y={.027} z={.951} width={.068} height={.020}><div style={{position:'absolute',inset:0,background:'#070605'}}/></Face>
 <Face x={plate.x} y={plate.y} z={plate.top} width={plate.width} height={plate.height} resolution={resolution}><Photograph id="exit-plate" group="parts/loading"/></Face>
 {paperOnExit(g)?<Face x={-.82-w/2} y={.036} z={.94+h/2} width={w} height={h} resolution={Math.max(resolution,4)}><div style={{position:'absolute',inset:0,opacity:.67}}><RubbingPaper g={g}/></div></Face>:null}
 {g.flags.exitKey?<div style={{...joinerySpace,transform:`translate3d(${- .82*500}px,${-.94*500}px,${.034*500}px) rotateZ(${g.flags.exitUnlocked?90:0}deg)`}}><Face x={0} y={1100*KEY_PHOTO_SCALE} z={KEY_HEIGHT/2} width={1100*KEY_PHOTO_SCALE} height={KEY_HEIGHT} turn={90} resolution={3}><KeyParts values={g.itemValues.keyparts} projected inserted/></Face><Face x={0} y={0} z={KEY_HEIGHT/2} width={1100*KEY_PHOTO_SCALE} height={KEY_HEIGHT} turn={-90} resolution={3}><div style={{position:'absolute',inset:0,transform:'scaleX(-1)'}}><KeyParts values={g.itemValues.keyparts} projected inserted/></div></Face></div>:null}
 </>;}
