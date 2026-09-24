import type {World} from './campaign';
import {gatheringSources} from './gatherings';
import {ForeedgeBook} from './ForeedgeBook';
import {ProjectedSurface} from './ProjectedSurface';
import {GatheringTop} from './FoldedPaper';
import {BUNDLE_THICKNESS} from './book';
import type {Quad} from './projective';
export function HeldGatherings({g,detail=false}:{g:World;detail?:boolean}){
 const sources=gatheringSources(g),height=sources.reduce((sum,id)=>sum+BUNDLE_THICKNESS[id],0)*20;
 const front:Quad=[[90,570-height],[797,570-height],[797,570],[90,570]],side:Quad=[[780,570-height],[920,490-height],[920,490],[780,570]],top:Quad=[[240,490-height],[920,490-height],[780,570-height],[100,570-height]];
 return <div className={'r-held-gatherings '+(detail?'inspection':'')}><svg viewBox={`60 ${450-height} 900 ${height+160}`} width="100%" height="100%" aria-label="選んだ六折の紙束"><foreignObject width="1000" height="700"><div style={{position:'relative',width:1000,height:700,pointerEvents:'none'}}>
 <ProjectedSurface quad={side} affine canvasWidth={1000} canvasHeight={700}><ForeedgeBook order={g.book.order} sources={sources} view={1} surfaceOnly solidFace showPainting={false}/></ProjectedSurface>
 <ProjectedSurface quad={front} affine canvasWidth={1000} canvasHeight={700}><ForeedgeBook order={g.book.order} sources={sources} view={1} surfaceOnly showPainting={false}/></ProjectedSurface>
 <ProjectedSurface quad={top} affine canvasWidth={1000} canvasHeight={700}><GatheringTop/></ProjectedSurface>
 </div></foreignObject></svg></div>;
}
