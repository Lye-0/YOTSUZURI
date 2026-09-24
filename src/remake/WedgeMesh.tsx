import {Face,Photograph} from './ArchivePhotos';
const W=.07,L=.13,H=.035;
export function WedgeMesh({x,y,z}:{x:number;y:number;z:number}){const ramp=Math.hypot(L,H),tilt=90-Math.atan2(H,L)*180/Math.PI;
 return <><Face x={x} y={y} z={z+H} width={W} height={ramp} tilt={tilt}><Photograph id="wedge-ramp" group="parts/weighing"/></Face>
 <Face x={x+W} y={y+L} z={z+H} width={L} height={H} turn={90}><Photograph id="wedge-side" group="parts/weighing"/></Face>
 <Face x={x} y={y} z={z+H} width={L} height={H} turn={-90}><Photograph id="wedge-side" group="parts/weighing" mirror/></Face>
 <Face x={x+W} y={y} z={z+H} width={W} height={H} turn={180}><Photograph id="wedge-end" group="parts/weighing"/></Face></>;
}
