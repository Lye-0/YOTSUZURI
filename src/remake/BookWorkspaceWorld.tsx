import {archiveProjectEye,type ArchiveEye} from './archiveSpace';
import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid} from './PhotoCuboid';
import {joinerySpace,FrameBody} from './FrameBody';
import {ClampBody} from './ClampBody';
import {FinalBookBody,BlankFold} from './FinalBookBody';
import {KeyParts} from './KeyParts';
import {finalPlaced,frameAtPress,bookAtPress,finalPlatenHeight} from './binding';
import {bookWorkPoint,bookWorktop,finalClampHome as stand,finalPaperPose,finalKeyPose} from './bookWorkspaceGeometry';
import {KEY_WIDTH,KEY_HEIGHT} from './keyGeometry';
import {validJoinery} from './joinery';
const wood={id:'worktop',group:'parts/clamp',crop:[.2,.80,.5,.04] as const};
export function BookWorkspaceWorld({g,eye,pixelScale=1}:{g:World;eye:ArchiveEye;pixelScale?:number}){const has=(n:Parameters<typeof finalPlaced>[1])=>finalPlaced(g,n),paper=finalPaperPose(g),a=archiveProjectEye(bookWorkPoint([paper.x,paper.y+.15,paper.z+.07]),eye),b=archiveProjectEye(bookWorkPoint([paper.x+.20,paper.y+.15,paper.z+.07]),eye),resolution=a[2]>.05&&b[2]>.05?Math.max(.5,Math.min(24,Math.hypot(a[0]-b[0],a[1]-b[1])*pixelScale/100*1.2)):1,frameValues=validJoinery(g.itemValues.frame)?g.itemValues.frame:[0,1,2,3,0,1,2,3,0,0,0,0];return <div style={{...joinerySpace,transform:`translate3d(${bookWorktop.x*500}px,${-bookWorktop.z*500}px,${bookWorktop.y*500}px) rotateY(90deg)`}}>
 <PhotoCuboid x={0} y={0} z={-.025} width={bookWorktop.width} depth={bookWorktop.depth} height={.025} texture={wood} top={{id:'worktop',group:'parts/clamp'}}/>
 {has('clamp')?<div style={{...joinerySpace,transform:`translate3d(${stand.x*500}px,0,${stand.y*500}px)`}}><ClampBody g={g} frame={frameAtPress(g)} platenHeight={finalPlatenHeight(g)}>{has('gatherings')&&bookAtPress(g)?<div style={{...joinerySpace,transform:'translate3d(60px,-10px,57.5px)'}}><FinalBookBody g={g} resolution={resolution}/></div>:null}</ClampBody></div>:null}
 {has('frame')&&!frameAtPress(g)?<div style={{...joinerySpace,transform:'translate3d(60px,0,0) rotateX(114deg)'}}><FrameBody values={frameValues}/></div>:null}
 {has('gatherings')&&!bookAtPress(g)?<div style={{...joinerySpace,transform:`translate3d(${paper.x*500}px,${-paper.z*500}px,${paper.y*500}px)`}}><FinalBookBody g={g} resolution={resolution}/></div>:null}
 {has('blanks')?Array.from({length:2-g.book.blanks.length},(_,i)=><BlankFold key={i} x={.30+i*.008} y={.52+i*.009} z={i*.006}/>):null}
 {has('needle')?<Face x={.565} y={.20} z={.002} width={.08} height={.03} tilt={90} resolution={14}><Photograph id="needle" group="items"/></Face>:null}
 {has('thread')&&!g.book.sewn?<Face x={.55} y={.38} z={.003} width={.09} height={.06} tilt={90} resolution={12}><Photograph id="thread" group="items"/></Face>:null}
 {[.065,.12].map(x=><PhotoCuboid key={x} x={x} y={.97} z={0} width={.018} depth={.03} height={.04} texture={wood}/>)}
 {has('keyparts')?<><Face x={finalKeyPose.x} y={finalKeyPose.y} z={finalKeyPose.z} width={KEY_WIDTH} height={KEY_HEIGHT} resolution={12}><KeyParts values={g.values[30]} projected/></Face><Face x={KEY_WIDTH} y={finalKeyPose.y-.003} z={finalKeyPose.z} width={KEY_WIDTH} height={KEY_HEIGHT} turn={180} resolution={12}><div style={{position:'absolute',inset:0,transform:'scaleX(-1)'}}><KeyParts values={g.values[30]} projected/></div></Face></>:null}
 </div>;}
