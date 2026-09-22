import type {World} from './campaign';
import {Face} from './ArchivePhotos';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {ForeedgeBook} from './ForeedgeBook';
import {GatheringTop} from './FoldedPaper';
import {gatheringSources} from './gatherings';
import {CradleBody} from './CradleBody';
import {heldCradleWorld} from './HeldCradle';
import {cradleSlope,CRADLE_THICKNESS as H} from './cradle';
import {foreedgeHeight,foreedgeMounted,foreedgeView,foreedgePaper} from './foreedge';
import {foreedgeHome as home,bareGatherings as bare} from './foreedgeGeometry';
const M=500,metal:PhotoTexture={id:'iron-face',group:'parts/optics'};
function PaperStack({g}:{g:World}){const h=foreedgeHeight(g),w=foreedgePaper.width,d=foreedgePaper.depth,sources=gatheringSources(g),view=foreedgeView(g),edge=<ForeedgeBook order={g.book.order} sources={sources} view={view} surfaceOnly solidFace showPainting={false}/>;
 return <>
 <Face resolution={g.selected==='lens'?24:12} x={0} y={d} z={h} width={w} height={h}><ForeedgeBook order={g.book.order} sources={sources} view={view} surfaceOnly/></Face>
 <Face resolution={g.selected==='lens'?24:12} x={w} y={0} z={h} width={w} height={h} turn={180}>{edge}</Face>
 <Face resolution={g.selected==='lens'?24:12} x={w} y={d} z={h} width={d} height={h} turn={90}>{edge}</Face>
 <Face resolution={g.selected==='lens'?24:12} x={0} y={0} z={h} width={d} height={h} turn={-90}>{edge}</Face>
 <Face resolution={g.selected==='lens'?24:12} x={0} y={0} z={h} width={w} height={d} tilt={90}><GatheringTop/></Face>
 </>;
}
/** Mounted and unmounted materials keep separate physical positions. */
export function ForeedgeWorld({g}:{g:World}){const cradle=g.placed[22]?.includes('cradle'),papers=g.placed[22]?.includes('gatherings'),mounted=foreedgeMounted(g);return <>
 {[[1.16,.08,.36,.017],[1.16,.383,.36,.017],[1.16,.08,.017,.32],[1.503,.08,.017,.32]].map(([x,y,w,d],i)=><PhotoCuboid key={i} x={x} y={y} z={.82} width={w} depth={d} height={.015} texture={metal}/>)}
 {cradle?<div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${home.u*M}px,${-home.z*M}px,${home.v*M}px)`}}><CradleBody g={heldCradleWorld(g)}/></div>:null}
 {papers?<div className="foreedge-stack-position" style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transition:g.reducedMotion?'none':undefined,transform:mounted?`translate3d(${(home.u+.06)*M}px,${-(home.z+H+.06*Math.sin(cradleSlope*Math.PI/180)+H*Math.cos(cradleSlope*Math.PI/180))*M}px,${(home.v+.06*Math.cos(cradleSlope*Math.PI/180)-H*Math.sin(cradleSlope*Math.PI/180))*M}px) rotateX(${cradleSlope}deg)`:`translate3d(${bare.u*M}px,${-bare.z*M}px,${bare.v*M}px)`}}><div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`skewX(${-Math.atan((foreedgeView(g)-1)*.35)*180/Math.PI}deg)`}}><PaperStack g={g}/></div></div>:null}
 </>;}
