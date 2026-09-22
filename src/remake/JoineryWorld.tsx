import type {World} from './campaign';
import {ArchiveBench} from './ArchiveBench';
import {Face} from './ArchivePhotos';
import {FrameBody,WoodRail,joinerySpace} from './FrameBody';
import {frameTaken,joineryValues,frameRails} from './joinery';
import {joineryTable,frameOrigin,railPose} from './joineryGeometry';
import {ReturnRecord} from './ReturnRecord';
import {JoineryTray} from './JoineryTray';
export function JoineryWorld({g,drag}:{g:World;drag?:{piece:number;dx:number;dy:number;lift?:number;tilt?:number;returning?:boolean}|null}){const v=joineryValues(g),taken=frameTaken(g);return <><ArchiveBench {...joineryTable} turn={-90}/><div style={{...joinerySpace,transform:`translate3d(${joineryTable.x*500}px,0,${joineryTable.y*500}px) rotateY(-90deg)`}}>
 <JoineryTray/>
 <Face x={.115} y={.23} z={.824} width={.002} height={.35} tilt={90}><div style={{width:'100%',height:'100%',background:'#b5a17b66'}}/></Face>
 {!taken?<><div style={{...joinerySpace,transform:`translate3d(${frameOrigin.x*500}px,${-frameOrigin.z*500}px,${frameOrigin.y*500}px)`}}><FrameBody values={drag?v.map((n,i)=>i===drag.piece?-1:n):v}/></div>{frameRails.map((_,i)=>{if(v[i]>=0&&drag?.piece!==i)return null;const p=railPose(v,i);if(drag?.piece===i){p.x+=drag.dx;p.y+=drag.dy;p.z+=drag.lift??.025;}return <div key={i} style={{...joinerySpace,transition:drag?.piece===i&&drag.returning&&!g.reducedMotion?'transform .28s ease':undefined,transform:`translate3d(${p.x*500}px,${-p.z*500}px,${p.y*500}px) rotateY(${-p.rotation*90}deg) rotateZ(${drag?.piece===i?drag.tilt??0:0}deg)`}}><WoodRail piece={i} flip={p.flip}/></div>})}</>:null}
 {!g.collected.includes('returnrecord')?<Face x={.65} y={.002} z={1.30} width={.28} height={.20} resolution={6}><ReturnRecord/></Face>:null}
 </div></>;}
