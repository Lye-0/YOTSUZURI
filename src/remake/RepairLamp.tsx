import {Face,Photograph} from './ArchivePhotos';
import {PhotoCuboid} from './PhotoCuboid';
export function RepairLamp(){const x=5.60,y=4.94;return <>
 <PhotoCuboid x={x-.002} y={y-.002} z={2.22} width={.004} depth={.004} height={.58} texture={{id:'iron-face',group:'parts/optics'}}/>
 <Face x={x+.13} y={y} z={2.22} width={.26} height={.1213} turn={180}><Photograph id="lamp-shade" group="parts/repair"/></Face>
 <Face x={x-.13} y={y+.13} z={2.101} width={.26} height={.26} tilt={-90}><div style={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden',filter:'brightness(1.35)'}}><Photograph id="lamp-shade" group="parts/repair" crop={[.06,.791,.90,.039]}/></div></Face>
 <Face x={x-.018} y={y+.018} z={2.1005} width={.036} height={.036} tilt={-90}><div style={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden'}}><Photograph id="lamp" group="parts/optics" crop={[.335,.392,.332,.242]}/></div></Face>
 <Face x={6.4} y={5.19} z={2.55} width={1.6} height={2.1} turn={180}><div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 40%,#ffd68c30,transparent 68%)',mixBlendMode:'screen'}}/></Face>
 <Face x={5.5} y={4.36} z={.8208} width={1} height={.69} tilt={90}><div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 15% 65%,#ffdc9b25,transparent 70%)',mixBlendMode:'screen'}}/></Face>
 </>;}
