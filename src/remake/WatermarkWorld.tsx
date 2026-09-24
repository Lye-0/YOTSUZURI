import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {ArchiveBench} from './ArchiveBench';
import {FoldedPaper} from './FoldedPaper';
import {ForeedgeBook} from './ForeedgeBook';
import {BUNDLE_THICKNESS} from './book';
import {gatheringValues,gatheringPairs,gatheringPose,gatheringsTaken} from './gatherings';
import {watermarkTable,candidatePlaces,gatheringPlaces,inspectionPlace} from './watermarkGeometry';
function Pair({index,x,y,lifted=false,pose}:{index:number;x:number;y:number;lifted?:boolean;pose:{flip:boolean;rotate:boolean}}){const sources=gatheringPairs[index],h=sources.reduce<number>((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*.006-(lifted?.002:0),z=.824+h;
 return <div data-watermark-paper={index} style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d'}}><Face x={x} y={y} z={z} width={.15} height={.20} tilt={90}><FoldedPaper index={index} {...pose}/></Face><Face x={x} y={y+.2} z={z} width={.15} height={h}><ForeedgeBook order={[0,1]} sources={sources} view={1} surfaceOnly solidFace showPainting={false}/></Face><Face x={x+.15} y={y+.2} z={z} width={.20} height={h} turn={90}><ForeedgeBook order={[0,1]} sources={sources} view={1} surfaceOnly solidFace showPainting={false}/></Face><Face x={x} y={y} z={z} width={.20} height={h} turn={-90}><ForeedgeBook order={[0,1]} sources={sources} view={1} surfaceOnly solidFace showPainting={false}/></Face></div>;
}
function InkLabel({text}:{text:string}){return <svg viewBox="0 0 120 30" width="100%" height="100%" preserveAspectRatio="none"><text x="60" y="24" textAnchor="middle" fill="#d3c49d" opacity=".8" fontSize="24" fontFamily="Yu Mincho,serif" letterSpacing="8">{text}</text></svg>;}
export function WatermarkWorld({g}:{g:World}){
 const v=gatheringValues(g),selected=v.slice(1),taken=gatheringsTaken(g),probe=v[0],pose=probe>=0?gatheringPose(g,probe):null,t=watermarkTable;
 return <><ArchiveBench x={t.x} y={t.y}/><div style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d',transform:`translate3d(${t.x*500}px,0,${t.y*500}px)`}}>
 <Face x={.04} y={.03} z={.86} width={.68} height={.28} tilt={90}><Photograph id="lightbox" group="parts/watermark"/></Face>
 <Face x={.04} y={.31} z={.86} width={.68} height={.04}><Photograph id="lightbox" group="parts/watermark" crop={[60/1951,680/806,1833/1951,47/806]}/></Face>
 <Face x={.72} y={.31} z={.86} width={.28} height={.04} turn={90}><Photograph id="lightbox" group="parts/watermark" crop={[60/1951,680/806,1833/1951,47/806]}/></Face>
 <Face x={.04} y={.03} z={.86} width={.28} height={.04} turn={-90}><Photograph id="lightbox" group="parts/watermark" crop={[60/1951,680/806,1833/1951,47/806]}/></Face>
 <Face x={.13} y={.07} z={.863} width={.15} height={.20} tilt={90}><FoldedPaper illuminated/></Face>
 <Face x={.12} y={.284} z={.864} width={.17} height={.026} tilt={90}><InkLabel text="原紙"/></Face>
 {probe>=0&&pose?<div data-watermark-paper={probe} style={{position:'absolute',width:0,height:0,transformStyle:'preserve-3d'}}><Face x={inspectionPlace[0]+.013} y={inspectionPlace[1]+.014} z={.862} width={.15} height={.2} tilt={90}><FoldedPaper index={probe} flip={pose.flip} rotate={pose.rotate} illuminated/></Face><Face x={inspectionPlace[0]} y={inspectionPlace[1]} z={.864} width={.15} height={.2} tilt={90}><FoldedPaper index={probe} flip={pose.flip} rotate={pose.rotate} illuminated/></Face></div>:null}
 <Face x={-.035} y={.355} z={.823} width={.84} height={.255} tilt={90}><Photograph id="sorting-cloth" group="parts/watermark"/></Face>
 <Face x={.32} y={.61} z={.824} width={.14} height={.036} tilt={90}><InkLabel text="六折"/></Face>
 {candidatePlaces.map(([x,y],index)=>selected.includes(index)||probe===index?null:<Pair key={index} index={index} x={x} y={y} lifted={probe===index} pose={gatheringPose(g,index)}/>)}
 {!taken?selected.map((index,slot)=>index<0?null:<Pair key={slot} index={index} x={gatheringPlaces[slot][0]} y={gatheringPlaces[slot][1]} pose={gatheringPose(g,index)}/>):null}
 </div></>;
}

