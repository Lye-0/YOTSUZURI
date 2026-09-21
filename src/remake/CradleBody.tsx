import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {WedgeMesh} from './WedgeMesh';
import {cradleValues,cradleBoardAngle,cradleCornerHeight,cradleWedgeLift,cradlePins,cornerCentre,wedgeSlots,CRADLE_W as W,CRADLE_D as D,CRADLE_THICKNESS as H} from './cradle';
const group='parts/cradle',lower:PhotoTexture={id:'lower-board',group},upper:PhotoTexture={id:'upper-board',group},edge:PhotoTexture={...upper,crop:[.05,.05,.85,.05]},brass:PhotoTexture={id:'corner-flat',group:'parts',crop:[.09,.2,.08,.5]},steel:PhotoTexture={id:'steel-pin',group:'parts',crop:[.42,.05,.14,.85]};
function Corner({g}:{g:World}){const v=cradleValues(g),h=cradleCornerHeight(g);return <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${cornerCentre[0]*500}px,${-H*500}px,${cornerCentre[1]*500}px) rotateY(${-v[1]*90}deg)`}}>
 <Face x={-.07} y={-.07} z={h} width={.14} height={.14} tilt={90}><Photograph id="corner-flat" group="parts"/></Face>
 <Face x={-.07} y={.07} z={h} width={.14} height={.003}><Photograph {...brass}/></Face>
 <Face x={-.07} y={-.07} z={h} width={.14} height={.003} turn={-90}><Photograph {...brass}/></Face>
 <Face x={-.045} y={.045} z={h} width={.115} height={.003} turn={90}><Photograph {...brass}/></Face>
 <Face x={.07} y={.045} z={h} width={.115} height={.003} turn={180}><Photograph {...brass}/></Face>
 </div>;}
function Hinges({moving=false}:{moving?:boolean}){return <>{[.045,.225].map(x=>moving?<Face key={x} x={x+.05} y={.036} z={-.0003} width={.036} height={.05} turn={90} tilt={-90}><Photograph id="hinge" group={group} crop={[.54,.145,.42,.715]}/></Face>:<div key={x} style={{display:'contents'}}><Face x={x} y={.036} z={H+.0002} width={.036} height={.05} turn={90} tilt={90}><Photograph id="hinge" group={group} crop={[.04,.145,.415,.715]}/></Face><Face x={x} y={.004} z={H+.004} width={.008} height={.05} turn={90} tilt={90}><Photograph id="hinge" group={group} crop={[.455,.115,.089,.765]}/></Face></div>)}</>;}
/** Local origin is the back-left bottom of the one physical folding fixture. */
export function CradleBody({g}:{g:World}){const v=cradleValues(g),parts=g.placed[21]??[],angle=cradleBoardAngle(g);return <>
 <Face x={-.006} y={-.006} z={.0001} width={W+.012} height={D+.012} tilt={90}><div className="archive-contact-shadow"/></Face>
 <PhotoCuboid x={0} y={0} z={0} width={W} depth={D} height={H} insetEdges={.004} texture={edge} top={lower}/>
 <Hinges/>
 {cradlePins.map(([x,y],i)=><div key={i} style={{display:'contents'}}><PhotoCuboid x={x-.0017} y={y-.0017} z={H} width={.0034} depth={.0034} height={.004} texture={steel}/><Face x={x-.002} y={y-.002} z={H+.0041} width={.004} height={.004} tilt={90}><Photograph id="keeper-pin-front" group="parts" crop={[.306,.552,.37,.334]} clip="circle(48% at 50% 50%)"/></Face></div>)}
 {parts.includes('corner')?<Corner g={g}/>:null}
 {parts.includes('wedge')?<div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${(wedgeSlots[v[3]]+.035)*500}px,${-(H+cradleWedgeLift(g))*500}px,${.065*500}px) rotateY(${-v[2]*90}deg)`}}><WedgeMesh x={-.035} y={-.065} z={0}/></div>:null}
 <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translateY(${-H*500}px) rotateX(${angle}deg)`}}>
 <PhotoCuboid x={0} y={0} z={0} width={W} depth={D} height={H} insetEdges={.004} texture={edge} top={upper}/>
 <Face x={0} y={D} z={-.0001} width={W} height={D} tilt={-90}><Photograph {...upper} mirror/></Face>
 <Hinges moving/>
 </div>
 </>;}
