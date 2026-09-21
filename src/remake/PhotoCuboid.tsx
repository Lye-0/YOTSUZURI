import {Face,Photograph,type UV} from './ArchivePhotos';
export type PhotoTexture={id:string;group?:string;crop?:UV};
function Surface({texture,shade=1}:{texture:PhotoTexture;shade?:number}){return <div style={{position:'absolute',inset:0,filter:shade===1?undefined:`brightness(${shade})`}}><Photograph {...texture}/></div>;}
export function PhotoCuboid({x,y,z,width,depth,height,texture,top=texture,side=texture,front=texture,insetEdges=0}:{x:number;y:number;z:number;width:number;depth:number;height:number;texture:PhotoTexture;top?:PhotoTexture;side?:PhotoTexture;front?:PhotoTexture;insetEdges?:number}){
 return <><Face x={x} y={y} z={z+height} width={width} height={depth} tilt={90}><Surface texture={top}/></Face>
 <Face x={x+insetEdges} y={y+depth} z={z+height} width={width-2*insetEdges} height={height}><Surface texture={front}/></Face>
 <Face x={x+width-insetEdges} y={y} z={z+height} width={width-2*insetEdges} height={height} turn={180}><Surface texture={front} shade={.87}/></Face>
 <Face x={x+width} y={y+depth-insetEdges} z={z+height} width={depth-2*insetEdges} height={height} turn={90}><Surface texture={side} shade={.88}/></Face>
 <Face x={x} y={y+insetEdges} z={z+height} width={depth-2*insetEdges} height={height} turn={-90}><Surface texture={side} shade={.94}/></Face>
 {insetEdges>0?[[x+width-insetEdges,y+depth,45],[x,y+depth-insetEdges,-45],[x+width,y+insetEdges,135],[x+insetEdges,y,-135]].map(([px,py,turn])=><Face key={turn} x={px} y={py} z={z+height} width={Math.SQRT2*insetEdges} height={height} turn={turn}><Surface texture={side} shade={.92}/></Face>):null}
 </>;
}
