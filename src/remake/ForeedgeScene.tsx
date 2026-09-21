import {value,placed,type World,type Action} from './campaign';
import {ProjectedSurface} from './ProjectedSurface';
import {ForeedgeBook} from './ForeedgeBook';
import {gatheringSources} from './gatherings';
import {BUNDLE_THICKNESS} from './book';
import {GatheringTop} from './FoldedPaper';
import {Icon} from './Icons';
import type {Quad} from './projective';
// All three faces use the same six physical bundles and the same boundaries.
const front:Quad=[[424,373],[1144,377],[1133,648],[415,614]];
const side:Quad=[[1090,377],[1202,336],[1205,584],[1080,648]];
const top:Quad=[[569,329],[1202,336],[1144,377],[424,373]];
export function ForeedgeScene({g,act,enabled=true,zoom=false,onZoom}:{g:World;act:(a:Action)=>void;enabled?:boolean;zoom?:boolean;onZoom?:(zoom:boolean)=>void}){
if(!placed(g,22,'gatherings')||!placed(g,22,'cradle'))return null;
const view=value(g,22)[6],order=g.book.order,sources=gatheringSources(g),ratio=sources.reduce((sum,id)=>sum+BUNDLE_THICKNESS[id],0)/13;
const raised=(point:readonly number[],base:readonly number[])=>[base[0]+(point[0]-base[0])*ratio,base[1]+(point[1]-base[1])*ratio] as [number,number];
const currentFront:Quad=[raised(front[0],front[3]),raised(front[1],front[2]),front[2],front[3]],currentSide:Quad=[raised(side[0],side[3]),raised(side[1],side[2]),side[2],side[3]],currentTop:Quad=[raised(top[0],[560,570]),raised(top[1],side[2]),currentFront[1],currentFront[0]];
return <>
<svg className="r-foreedge-world" viewBox={zoom?'490 330 210 390':'0 0 1672 941'} preserveAspectRatio="none"><image href={import.meta.env.BASE_URL+'remake/closeups/p22-cradle.webp'} width="1672" height="941"/><foreignObject x="0" y="0" width="1672" height="941"><div style={{position:'relative',width:1672,height:941,pointerEvents:'none'}}>
<div className="r-book-surfaces">
<ProjectedSurface quad={currentSide}><ForeedgeBook order={order} sources={sources} view={view} surfaceOnly solidFace showPainting={false}/></ProjectedSurface>
<ProjectedSurface quad={currentFront}><ForeedgeBook order={order} sources={sources} view={view} surfaceOnly onOrder={enabled?next=>act({type:'p-set',id:22,values:[...next,view]}):undefined}/></ProjectedSurface>
<ProjectedSurface quad={currentTop}><GatheringTop/></ProjectedSurface>
</div>
</div></foreignObject></svg>
<div className="r-edge-views r-scene-edge-views" aria-label="本を傾ける">{[0,1,2].map(n=><button key={n} disabled={!enabled} aria-label={['左へ傾ける','まっすぐに戻す','右へ傾ける'][n]} aria-pressed={view===n} onClick={()=>act({type:'p-set',id:22,values:[...order,n]})}><Icon name={n===0?'left':n===1?'eye':'right'}/></button>)}</div>
{onZoom?<button className="r-edge-zoom" aria-label={zoom?'本全体を見る':'小口を近くで見る'} onClick={()=>onZoom(!zoom)}><Icon name="inspect"/></button>:null}
</>;
}
