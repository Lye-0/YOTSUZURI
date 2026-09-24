import {bundleMark} from './bundleMarks';
import {BOOK_ORDER} from './book';
import type {CSSProperties} from 'react';
import type {World} from './campaign';
import {Face,Photograph,type UV} from './ArchivePhotos';
import {ArchiveBench} from './ArchiveBench';
import {photoBounds} from './photoBounds';
import {studySpecimens,studyOpen,studyUnderOpen,blankStudyValues} from './blankStudy';
import {studyTable,studyHinge,blankPosition} from './studyGeometry';
const group='parts/study',space:CSSProperties={position:'absolute',width:0,height:0,transformStyle:'preserve-3d'};
function Paper({id,start=0,end=1,mirror=false}:{id:string;start?:number;end?:number;mirror?:boolean}){
 const a=photoBounds[`${group}/${id}`];let crop:UV|undefined;
 if(a){const [x,y,w,h]=a.bounds;crop=[(x+start*w)/a.width,y/a.height,(end-start)*w/a.width,h/a.height];}
 return <Photograph id={id} group={group} crop={crop} mirror={mirror}/>;
}
function Leaf({width,id,start,end,mirror=false}:{width:number;id:string;start?:number;end?:number;mirror?:boolean}){return <>
 <Face x={0} y={0} z={.0004} width={width} height={.15} tilt={90} resolution={12}><Paper {...{id,start,end,mirror}}/></Face>
 <Face x={0} y={.15} z={0} width={width} height={.15} tilt={-90} resolution={12}><Paper {...{id,start,end,mirror}}/></Face>
 </>;}
function Specimen({g,index}:{g:World;index:number}){
 const s=studySpecimens[index],open=studyOpen(g,index),under=studyUnderOpen(g,index),id=`study-leaf-${s.paper}`,stub='stub'in s?`study-stub-${s.stub}`:null;
 return <div style={{...space,transform:`translate3d(${studyHinge(index)*500}px,${-.825*500}px,${.03*500}px)`}}>
 <div style={{...space,transform:`translateX(${-s.base*500}px)`}}><Leaf width={s.base} id={stub??id} start={0} end={stub?1:s.base/.10} mirror/></div>
 {s.extension?<div style={{...space,transform:`translate3d(${-s.base*500}px,-.5px,0) rotateZ(${under?0:180}deg)`}}><div style={{...space,transform:`translateX(${-s.extension*500}px)`}}><Leaf width={s.extension} id={id} start={s.base/.10} end={1} mirror/></div></div>:null}
 <div style={{...space,transform:`translateY(-1px) rotateZ(${open?0:-180}deg)`}}><Leaf width={.10} id={id}/></div>
 </div>;
}
export function BlankStudyWorld({g}:{g:World}){return <><ArchiveBench x={studyTable.x} y={studyTable.y} turn={90}/><div style={{...space,transform:`translate3d(${studyTable.x*500}px,0,${studyTable.y*500}px) rotateY(90deg)`}}>
 <Face x={.03} y={.008} z={.823} width={1.58} height={.23} tilt={90} resolution={2}><Photograph id="study-linen-mat" group={group}/></Face>
 {studySpecimens.map((_,i)=><Specimen key={i} g={g} index={i}/>)}
 {studySpecimens.map((_,i)=><Face key={i} x={studyHinge(i)-.025} y={.193} z={.824} width={.05} height={.026} tilt={90} resolution={5}><svg viewBox="0 0 50 26" width="100%" height="100%"><text x="25" y="21" textAnchor="middle" fill="#453d31" fontFamily="serif" fontSize="19">{bundleMark(BOOK_ORDER[i])}</text></svg></Face>)}
 {g.placed[23]?.includes('blanks')?blankStudyValues(g).map((slot,i)=>{const [x,y,z]=blankPosition(slot,i);return <Face key={i} x={x} y={y} z={z} width={.20} height={.15} tilt={90} resolution={8}><div style={{position:'absolute',width:'75%',height:'133.333%',left:'100%',top:0,transformOrigin:'0 0',transform:'rotate(90deg)'}}><Photograph id="blank-fold-top" group={group}/></div></Face>}):null}
 </div></>;}
