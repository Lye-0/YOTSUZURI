import type {World} from './campaign';
import {ArchiveBench} from './ArchiveBench';
import {Face} from './ArchivePhotos';
import {FrameBody,WoodRail,joinerySpace} from './FrameBody';
import {frameTaken,joineryValues,frameRails} from './joinery';
import {joineryTable,frameOrigin,railPose} from './joineryGeometry';
import {ReturnRecord} from './ReturnRecord';
import {JoineryTray} from './JoineryTray';
export function JoineryWorld({g}:{g:World}){const v=joineryValues(g),taken=frameTaken(g);return <><ArchiveBench {...joineryTable} turn={-90}/><div style={{...joinerySpace,transform:`translate3d(${joineryTable.x*500}px,0,${joineryTable.y*500}px) rotateY(-90deg)`}}>
 <JoineryTray/>
 {!taken?<><div style={{...joinerySpace,transform:`translate3d(${frameOrigin.x*500}px,${-frameOrigin.z*500}px,${frameOrigin.y*500}px)`}}><FrameBody values={v}/></div>{frameRails.map((_,i)=>{if(v[i]>=0)return null;const p=railPose(v,i);return <div key={i} style={{...joinerySpace,transform:`translate3d(${p.x*500}px,${-p.z*500}px,${p.y*500}px) rotateY(${-p.rotation*90}deg)`}}><WoodRail piece={i} flip={p.flip}/></div>})}</>:null}
 {!g.collected.includes('returnrecord')?<Face x={.65} y={.002} z={1.30} width={.28} height={.20} resolution={6}><ReturnRecord/></Face>:null}
 </div></>;}
