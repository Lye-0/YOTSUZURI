import {bundleMark} from './bundleMarks';
import type {World} from './campaign';
import {Face,Photograph} from './ArchivePhotos';
import {PhotoSprite} from './PhotoSprite';
import {GatheringTop} from './FoldedPaper';
import {gatheringSources} from './gatherings';
import {BOOK_UNIT,BUNDLE_THICKNESS} from './book';
import {joinerySpace} from './FrameBody';
const rows=[199,304,415,522,625,735,853];
export function finalGroups(g:World){const sources=gatheringSources(g),indices=g.book.side?[0,1,2,3,4,5]:[5,4,3,2,1,0],gap=g.book.closed?0:.003,total=indices.reduce((s,i)=>s+(BUNDLE_THICKNESS[sources[g.book.order[i]]]+(g.book.blanks.includes(i)?1:0))*BOOK_UNIT,0)+5*gap;let cursor=total;return indices.map((position,visibleIndex)=>{const slot=g.book.order[position],source=sources[slot],blank=g.book.blanks.includes(position),units=BUNDLE_THICKNESS[source],height=(units+(blank?1:0))*BOOK_UNIT,top=cursor,bottom=top-height;cursor=bottom-gap;return{position,visibleIndex,slot,source,blank,units,height,top,bottom,shift:g.book.closed?0:visibleIndex*.004};});}
export function finalRenderedHeight(g:World){return finalGroups(g)[0].top;}
export function BlankFoldTop(){return <svg viewBox="0 0 200 150" width="100%" height="100%" preserveAspectRatio="none"><g transform="translate(200 0) rotate(90)"><PhotoSprite name="blank-fold-top" group="parts/study" x={0} y={0} width={150} height={200}/></g></svg>}
function Edge({source,units,blank,back=false,solid=false}:{source:number;units:number;blank:boolean;back?:boolean;solid?:boolean}){const row=source<6?source:(source-6)%6,start=rows[row],h=rows[row+1]-start,total=(units+(blank?1:0))*100,half=units*50,x=solid?220:0,w=solid?1330:1672,photo=import.meta.env.BASE_URL+'remake/parts/book-edge-closed.webp';return <svg viewBox={`0 0 1000 ${total}`} width="100%" height="100%" preserveAspectRatio="none"><g transform={back?`translate(1000 ${total}) rotate(180)`:undefined}>
 {blank?<><svg width="1000" height={half} viewBox={`${x} ${start} ${w} ${h/2}`} preserveAspectRatio="none"><image href={photo} width="1672" height="941"/></svg><PhotoSprite name="blank-fold-edge" group="parts/book" x={18} y={half} width={964} height={100}/><svg y={half+100} width="1000" height={half} viewBox={`${x} ${start+h/2} ${w} ${h/2}`} preserveAspectRatio="none"><image href={photo} width="1672" height="941"/></svg></>:<svg width="1000" height={total} viewBox={`${x} ${start} ${w} ${h}`} preserveAspectRatio="none"><image href={photo} width="1672" height="941"/></svg>}
 </g></svg>;}
export function BlankFold({x,y,z}:{x:number;y:number;z:number}){return <>
 <Face x={x} y={y} z={z+BOOK_UNIT} width={.20} height={.15} tilt={90} resolution={12}><BlankFoldTop/></Face>
 <Face x={x} y={y+.15} z={z+BOOK_UNIT} width={.20} height={BOOK_UNIT} resolution={12}><Photograph id="blank-fold-edge" group="parts/book"/></Face>
 <Face x={x+.20} y={y+.15} z={z+BOOK_UNIT} width={.15} height={BOOK_UNIT} turn={90} resolution={12}><Photograph id="blank-fold-edge" group="parts/book"/></Face>
 <Face x={x} y={y} z={z+BOOK_UNIT} width={.15} height={BOOK_UNIT} turn={-90} resolution={12}><Photograph id="blank-fold-edge" group="parts/book"/></Face>
 </>;}
export function FinalBookBody({g,resolution=12}:{g:World;resolution?:number}){const groups=finalGroups(g),height=groups[0].top,back=g.book.side===0;return <>
 {groups.map(row=><div key={row.slot} style={{...joinerySpace,transform:`translate3d(0,${-row.bottom*500}px,${row.shift*500}px)`}}>
 <Face x={0} y={.15} z={row.height} width={.20} height={row.height} resolution={resolution}><Edge {...row} back={back}/></Face>
 <Face x={.20} y={0} z={row.height} width={.20} height={row.height} turn={180} resolution={resolution}><Edge {...row} back={back} solid/></Face>
 <Face x={.20} y={.15} z={row.height} width={.15} height={row.height} turn={90} resolution={resolution}><Edge {...row} back={back} solid/></Face>
 <Face x={0} y={.151} z={row.height} width={.20} height={row.height} resolution={resolution}><svg viewBox={`0 0 200 ${row.height*1000}`} preserveAspectRatio="none" width="100%" height="100%"><text x="12" y={row.height*500} dominantBaseline="central" fill="#49371f" fontWeight="600" fontSize={Math.min(7,row.height*1000)}>{bundleMark(row.source)}</text>{[0,4].includes(row.source)&&!row.blank?<path d={`M70 ${row.height*500-1}h38m-38 2h36`} stroke="#5c4230" strokeWidth=".6" strokeDasharray="1.2 .9"/>:null}</svg></Face>
 <Face x={0} y={0} z={row.height} width={.15} height={row.height} turn={-90} resolution={resolution}><Edge {...row} back={back} solid/></Face>
 <Face x={0} y={0} z={row.height} width={.20} height={.15} tilt={90} resolution={resolution}><div style={{position:'absolute',inset:0,transform:back?'scaleX(-1)':undefined}}><GatheringTop/></div></Face>
 {row.blank&&!g.book.closed?<Face x={.002} y={.006} z={row.units*BOOK_UNIT/2+BOOK_UNIT} width={.196} height={.15} tilt={90} resolution={resolution}><BlankFoldTop/></Face>:null}
 </div>)}
 {g.book.sewn?[.02,.06,.10,.14,.18].map(x=><div key={x} style={{display:'contents'}}><Face x={x+.0025} y={-.001} z={height+.001} width={.005} height={height+.002} turn={180} resolution={16}><Photograph id="sewing-loop" group="parts/book"/></Face><Face x={x-.0025} y={0} z={height+.0008} width={.005} height={.014} tilt={90} resolution={16}><Photograph id="sewing-loop" group="parts/book"/></Face></div>):null}
 </>;}
