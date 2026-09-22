import type {World} from './campaign';
import type {ArchiveEye} from './archiveSpace';
import {Face,Photograph} from './ArchivePhotos';
import {TiledSurface} from './TiledSurface';
import {PhotoPatch} from './PhotoPatch';
import {TicketCase} from './TicketCase';
const photo=(id:string)=>import.meta.env.BASE_URL+`remake/scenes/reception/${id}.webp`;
export function ReceptionBackdrop({g,eye}:{g:World;eye:ArchiveEye}){return <>
 <Face x={0} y={0} z={2.8} width={4.2} height={2.8}><div style={{position:'absolute',inset:0}}><Photograph id="north-closed" group="scenes/reception"/>{g.bookOpen?<img className="r-photo r-book-change" src={photo('north-book')} alt=""/>:null}{g.boxOpen?<PhotoPatch src={photo('north-full')} rect={[14.5,37.5,15,22]}/>:g.latchUp?<PhotoPatch src={photo('north-released')} rect={[20.5,48.5,2.3,7]}/>:null}{g.boxOpen&&g.keyTaken?<PhotoPatch src={photo('north-empty')} rect={[18,49,3.5,3]}/>:null}{g.boxOpen&&g.cardTaken?<PhotoPatch src={photo('north-empty')} rect={[22,48.8,4.5,3.3]}/>:null}<PhotoPatch src={photo('north-notice')} rect={[55.5,20,6,14]}/></div></Face>
 <Face x={4.2} y={0} z={2.8} width={4.2} height={2.8} turn={-90}><Photograph id={g.doorOpen?'east-open':g.keyInserted?g.doorUnlocked?'east-unlocked':'east-key':'east-closed'} group="scenes/reception"/></Face>
 <Face x={4.2} y={4.2} z={2.8} width={4.2} height={2.8} turn={180}><div style={{position:'absolute',inset:0}}><Photograph id="south" group="scenes/reception"/><TicketCase g={{...g,room:0,facing:2,focus:'room'}} act={()=>{}} wide enabled={false}/></div></Face>
 <TiledSurface x={0} y={0} z={0} width={4.2} height={4.2} tilt={90} id="floor" group="scenes/loading" eye={eye} overlap={.008}/>
 <TiledSurface x={0} y={4.2} z={2.8} width={4.2} height={4.2} tilt={-90} id="floor" group="scenes/loading" eye={eye} overlap={.008}/>
 </>;}
