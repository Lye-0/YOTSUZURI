import {Face,Photograph,type UV} from './ArchivePhotos';
const frontLeg:UV=[100/1801,210/873,100/1801,581/873],sideLeg:UV=[82/1131,335/1391,86/1131,960/1391];
const frontEdge:UV=[34/1801,122/873,1733/1801,75/873],sideEdge:UV=[40/1131,105/1391,1051/1131,69/1391];
function Leg({x,y}:{x:number;y:number}){return <>
 <Face x={x} y={y+.09} z={.765} width={.09} height={.765}><Photograph id="bench-front" crop={frontLeg}/></Face>
 <Face x={x+.09} y={y} z={.765} width={.09} height={.765} turn={180}><Photograph id="bench-front" crop={frontLeg}/></Face>
 <Face x={x+.09} y={y+.09} z={.765} width={.09} height={.765} turn={90}><Photograph id="bench-side" crop={sideLeg}/></Face>
 <Face x={x} y={y} z={.765} width={.09} height={.765} turn={-90}><Photograph id="bench-side" crop={sideLeg}/></Face>
 <Face x={x-.01} y={y-.01} z={.002} width={.11} height={.11} tilt={90}><div className="archive-contact-shadow"/></Face>
 </>;}
export function ArchiveBench({x,y,turn=0}:{x:number;y:number;turn?:number}){
 return <div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${x*500}px,0,${y*500}px) rotateY(${turn}deg)`}}>
 <Face x={0} y={0} z={.82} width={1.65} height={.65} tilt={90}><Photograph id="bench-top"/></Face>
 <Face x={0} y={.65} z={.82} width={1.65} height={.055}><Photograph id="bench-front" crop={frontEdge}/></Face>
 <Face x={1.65} y={0} z={.82} width={1.65} height={.055} turn={180}><Photograph id="bench-front" crop={frontEdge}/></Face>
 <Face x={1.65} y={.65} z={.82} width={.65} height={.055} turn={90}><Photograph id="bench-side" crop={sideEdge}/></Face>
 <Face x={0} y={0} z={.82} width={.65} height={.055} turn={-90}><Photograph id="bench-side" crop={sideEdge}/></Face>
 <Face x={.145} y={.595} z={.765} width={1.36} height={.115}><Photograph id="bench-front" crop={[213/1801,203/873,1372/1801,102/873]}/></Face>
 <Face x={1.505} y={.055} z={.765} width={1.36} height={.115} turn={180}><Photograph id="bench-front" crop={[213/1801,203/873,1372/1801,102/873]}/></Face>
 <Face x={1.595} y={.505} z={.765} width={.36} height={.115} turn={90}><Photograph id="bench-side" crop={[178/1131,181/1391,775/1131,147/1391]}/></Face>
 <Face x={.055} y={.145} z={.765} width={.36} height={.115} turn={-90}><Photograph id="bench-side" crop={[178/1131,181/1391,775/1131,147/1391]}/></Face>
 {[.055,1.505].flatMap(x=>[.055,.505].map(y=><Leg key={`${x}:${y}`} x={x} y={y}/>))}
 </div>;
}
