import {MasterWorld} from './MasterWorld';
import {BookWorkspaceWorld} from './BookWorkspaceWorld';
import {ExitDoorParts} from './ExitDoorParts';
import {exitLocalPoint} from './exitGeometry';
import {archiveProjectEye} from './archiveSpace';
import type {World} from './campaign';
import type {ArchiveEye} from './archiveSpace';
import {Face,Photograph} from './ArchivePhotos';
import {TiledSurface} from './TiledSurface';
import {PhotoCuboid,type PhotoTexture} from './PhotoCuboid';
import {joinerySpace} from './FrameBody';
import {loadingEntry as entry,loadingWindow as hatch,loadingExit as exit} from './loadingSpace';
import {boxInFront} from './worldVisibility';
const trim:PhotoTexture={id:'west',group:'scenes/reception',crop:[260/1672,160/941,34/1672,600/941]},wood:PhotoTexture={id:'floor',group:'scenes/loading',crop:[.2,.2,.5,.5]};
function LoadingWalls({eye}:{eye:ArchiveEye}){const walls=[{x:-4.2,y:0,turn:0,door:-1,win:false},{x:0,y:0,turn:-90,door:entry.start,win:true},{x:0,y:4.2,turn:180,door:-1,win:false},{x:-4.2,y:4.2,turn:90,door:4.2-exit.end,win:false}];return <>
 {[-4.2,-2.8,-1.4].map((x,i)=><TiledSurface key={x} overlap={.008} x={i===1?x+1.4:x} y={i===1?4.2:0} z={0} width={1.4} height={4.2} turn={i===1?180:0} tilt={90} id="floor" group="scenes/loading" eye={eye}/>)}
 <TiledSurface overlap={.008} x={-4.2} y={4.2} z={2.8} width={4.2} height={4.2} tilt={-90} id="floor" group="scenes/loading" eye={eye}/>
 {walls.map((w,i)=>{const d=w.door<0?[]:[[w.door,.7,i===1?entry.end-entry.start:exit.end-exit.start,1.2] as const];return <div key={i} style={{display:'contents'}}><TiledSurface overlap={.008} x={w.x} y={w.y} z={2.8} width={4.2} height={1.9} turn={w.turn} id="plaster" group="scenes/loading" eye={eye} cuts={[...d,...(w.win?[[hatch.start,.7,hatch.end-hatch.start,hatch.top-hatch.bottom] as const]:[])]}/>{[0,1.4,2.8].map(u=>{const a=Math.max(0,w.door-u),b=Math.min(1.4,w.door+(i===1?entry.end-entry.start:exit.end-exit.start)-u);return <TiledSurface key={u} overlap={.008} x={w.x+u*Math.cos(w.turn*Math.PI/180)} y={w.y-u*Math.sin(w.turn*Math.PI/180)} z={.9} width={1.4} height={.9} turn={w.turn} id="floor" group="scenes/loading" eye={eye} cuts={w.door<0||b<=a?[]:[[a,0,b-a,.9]]}/>})}</div>})}
 {[-4.2,-.12].flatMap(x=>[0,4.08].map(y=><PhotoCuboid key={x+':'+y} x={x} y={y} z={0} width={.12} depth={.12} height={2.8} texture={trim}/>))}
 {[-3,-1.5].map(x=><PhotoCuboid key={x} x={x} y={0} z={2.62} width={.14} depth={4.2} height={.18} texture={trim}/>)}
 {[entry.start-.065,entry.end].map(y=><PhotoCuboid key={y} x={-.05} y={y} z={0} width={.10} depth={.065} height={2.18} texture={trim}/>)}
 <PhotoCuboid x={-.05} y={entry.start-.065} z={2.1} width={.10} depth={entry.end-entry.start+.13} height={.08} texture={trim}/>
 {[hatch.start-.065,hatch.end].map(y=><PhotoCuboid key={y} x={-.055} y={y} z={hatch.bottom-.08} width={.11} depth={.065} height={hatch.top-hatch.bottom+.16} texture={trim}/>)}
 {[hatch.bottom-.08,hatch.top].map(z=><PhotoCuboid key={z} x={-.08} y={hatch.start-.065} z={z} width={.20} depth={hatch.end-hatch.start+.13} height={.08} texture={trim}/>)}
 {[exit.start-.065,exit.end].map(y=><PhotoCuboid key={y} x={-4.24} y={y} z={0} width={.10} depth={.065} height={2.18} texture={trim}/>)}
 <PhotoCuboid x={-4.24} y={exit.start-.065} z={2.1} width={.10} depth={exit.end-exit.start+.13} height={.08} texture={trim}/>
 </>;}
export function LoadingEntryLeaf({open}:{open:boolean}){const photo={id:'west',group:'scenes/reception',crop:[306/1672,175/941,323/1672,607/941] as const};return <div style={{...joinerySpace,transform:`translate3d(0,0,${entry.end*500}px) rotateY(${open?0:-90}deg)`}}>
 <Face x={-(entry.end-entry.start)} y={.022} z={2.1} width={entry.end-entry.start} height={2.1}><Photograph {...photo} mirror/></Face>
 <Face x={0} y={-.022} z={2.1} width={entry.end-entry.start} height={2.1} turn={180}><Photograph {...photo}/></Face>
 <PhotoCuboid x={-(entry.end-entry.start)} y={-.02} z={0} width={.025} depth={.04} height={2.1} texture={trim}/>
 </div>;}
function ExitLeaf({g,eye,pixelScale}:{g:World;eye:ArchiveEye;pixelScale:number}){const a=archiveProjectEye(exitLocalPoint([-.88,.03,.98],!!g.flags.exitOpen),eye),b=archiveProjectEye(exitLocalPoint([-.76,.03,.90],!!g.flags.exitOpen),eye),resolution=a[2]>.05&&b[2]>.05?Math.max(.25,Math.min(12,Math.hypot(a[0]-b[0],a[1]-b[1])*pixelScale/72*1.2)):1;const top=archiveProjectEye(exitLocalPoint([-.475,.02,2.1],!!g.flags.exitOpen),eye),bottom=archiveProjectEye(exitLocalPoint([-.475,.02,0],!!g.flags.exitOpen),eye),bodyResolution=top[2]>.05&&bottom[2]>.05?Math.max(.125,Math.min(2,Math.hypot(top[0]-bottom[0],top[1]-bottom[1])*pixelScale/1050*1.2)):1;return <div style={{...joinerySpace,transform:`translate3d(${-4.195*500}px,0,${exit.start*500}px) rotateY(${g.flags.exitOpen?0:90}deg)`}}>
 <ExitDoorParts g={g} resolution={resolution}/>
 <Face resolution={bodyResolution} x={-(exit.end-exit.start)} y={.02} z={2.1} width={exit.end-exit.start} height={2.1}><Photograph id="exit-door" group="parts/loading"/></Face>
 <Face resolution={bodyResolution} x={0} y={-.02} z={2.1} width={exit.end-exit.start} height={2.1} turn={180}><Photograph id="exit-door" group="parts/loading" mirror/></Face>
 <PhotoCuboid x={-(exit.end-exit.start)} y={-.02} z={0} width={.025} depth={.04} height={2.1} texture={trim}/>
 </div>;}
function Crate({x,y,width=.65,depth=.55,height=.62,eye,pixelScale}:{x:number;y:number;width?:number;depth?:number;height?:number;eye:ArchiveEye;pixelScale:number}){const a=archiveProjectEye([x+width/2,y+depth,height],eye),b=archiveProjectEye([x+width/2,y+depth,0],eye),resolution=a[2]>.05&&b[2]>.05?Math.max(.125,Math.min(2,Math.hypot(a[0]-b[0],a[1]-b[1])*pixelScale/(height*500)*1.2)):1;return <PhotoCuboid resolution={resolution} x={x} y={y} z={0} width={width} depth={depth} height={height} texture={{id:'crate-front',group:'parts/loading'}} top={wood}/>;}
export function LoadingWorld({g,eye,hideEntry=false,pixelScale=1}:{g:World;eye:ArchiveEye;hideEntry?:boolean;pixelScale?:number}){return <div style={{display:'contents','--light':g.brightness*.78} as import('react').CSSProperties}>
 {g.flags.exitOpen?<><TiledSurface x={-6.8} y={4.5} z={3.3} width={6.2} height={6.2*941/1672} turn={90} id="exterior" group="scenes/loading" eye={eye} overlap={.008}/><TiledSurface x={-6.8} y={.65} z={-.01} width={2.6} height={1.55} tilt={90} id="exterior" group="scenes/loading" eye={eye} crop={[.25,.65,.5,.35]} overlap={.008}/></>:null}
 <LoadingWalls eye={eye}/>{!hideEntry&&archiveProjectEye([0,3.345,1],eye)[2]>.1?<LoadingEntryLeaf open={!!g.flags['loading:entry']}/>:null}{archiveProjectEye([-4.2,1.425,1],eye)[2]>.1?<ExitLeaf g={g} eye={eye} pixelScale={pixelScale}/>:null}
 {boxInFront(eye,[-2.85,.13,0],[-1.20,.78,.85])?<MasterWorld g={g}/>:null}
 {boxInFront(eye,[-4.1,2.5,0],[-3.72,3.5,1.9])?<><Face x={-3.73} y={3.5} z={1.9} width={.9} height={1.9} turn={90}><Photograph id="loaded-shelf" group="parts/loading"/></Face><PhotoCuboid x={-4.07} y={2.57} z={0} width={.34} depth={.06} height={1.9} texture={trim}/><PhotoCuboid x={-4.07} y={3.44} z={0} width={.34} depth={.06} height={1.9} texture={trim}/></>:null}
 {boxInFront(eye,[-4.08,.15,0],[-3.05,.82,1.5])?<><Crate eye={eye} pixelScale={pixelScale} x={-4.08} y={.15} width={.67} depth={.67} height={.85}/><BookWorkspaceWorld g={g}/></>:null}
 {boxInFront(eye,[-3.7,2.1,0],[-3.15,2.7,.62])?<Crate eye={eye} pixelScale={pixelScale} x={-3.7} y={2.1} width={.55} depth={.55}/>:null}
 {boxInFront(eye,[-3.7,2.85,0],[-3.05,3.5,.43])?<Crate eye={eye} pixelScale={pixelScale} x={-3.65} y={2.85} height={.43}/>:null}
 </div>;}
