import {EvidenceLock} from './EvidenceLock';
import {panelLockCode} from './evidenceLocks';
import {RepairPanelInk} from './RepairPanelInk';
import {useId,useRef,useState} from 'react';
import {BOOK_ORDER,BUNDLE_THICKNESS} from './book';
import {Icon} from './Icons';
import {GatheringTop} from './FoldedPaper';
const photo=(view:number)=>import.meta.env.BASE_URL+`remake/parts/book-edge-${view===0?'left':view===2?'right':'closed'}.webp`;
const rows=[199,304,415,522,625,735,853];
const unit=26;
const originalTop:number[]=[];let originalHeight=0;for(const id of BOOK_ORDER){originalTop[id]=originalHeight;originalHeight+=BUNDLE_THICKNESS[id]*unit;}
export const paintedJoin=(id:number)=>[110+originalTop[id]*.6,110+(originalTop[id]+BUNDLE_THICKNESS[id]*unit)*.6];
function HiddenDoorPainting(){return <g style={{color:'#464139'}} stroke="#464139" fill="none" strokeWidth="2.4" opacity=".74">
<svg x="650" y="10" width="210" height="308"><EvidenceLock values={panelLockCode} ink/></svg>
<path d="M110 0L312.8 338M122 0L324.8 338M75 306H855"/>
<g transform="translate(430 25) scale(.13)" style={{color:'#464139'}}><RepairPanelInk/></g>
<path d="M432 298l-12 24M560 298l12 24M620 40V306M630 40V306M60 80h60M77 95h54M78 150h88M112 201h70M131 254h80" strokeWidth="1" opacity=".5"/>
</g>}
function OtherBookPainting({variant}:{variant:number}){return <g stroke="#594a3b" fill="none" strokeWidth="3" opacity=".67"><path d={variant?'M60 40Q250 270 440 55T860 50M70 280Q280 70 480 280T880 275':'M60 165Q260 5 460 170T850 155M80 70Q280 300 480 70T860 75'}/>{[150,340,530,720].map((x,i)=><g key={x} transform={`translate(${x} ${90+(i%2)*125})`}><path d="M0 0q-50 -70 -75 -25q20 45 75 25q20 -65 65 -35q-10 40 -65 35v90"/><circle cy="-5" r="14"/></g>)}</g>;}
export function ForeedgeBook({order,view,sources=[0,1,2,3,4,5],blanks=[],onOrder,onView,showPainting=true,surfaceOnly=false,solidFace=false}:{order:number[];view:number;sources?:readonly number[];blanks?:number[];onOrder?:(order:number[])=>void;onView?:(view:number)=>void;showPainting?:boolean;surfaceOnly?:boolean;solidFace?:boolean}){
const paintId=useId().replace(/[^a-zA-Z0-9]/g,''),[selected,setSelected]=useState<number|null>(null),drag=useRef<{index:number;y:number}|null>(null);
const total=(order.reduce((s,id)=>s+BUNDLE_THICKNESS[sources[id]],0)+blanks.length)*unit,top=390-total;
let cursor=top;
const layers=order.map((id,index)=>{const source=sources[id],row=source<6?source:(source-6)%6,y=cursor,height=BUNDLE_THICKNESS[source]*unit;cursor+=height+(blanks.includes(index)?unit:0);return{id,source,row,index,y,height}});
const choose=(index:number)=>{if(!onOrder)return;if(selected===null)setSelected(index);else{const next=[...order];[next[selected],next[index]]=[next[index],next[selected]];onOrder(next);setSelected(null)}};
return <div className="r-foreedge-book"><svg viewBox={surfaceOnly?`50 ${top} 900 ${total}`:'0 -130 1000 560'} preserveAspectRatio="none" role="group" aria-label="束を重ねた本の小口">
{!surfaceOnly?<svg x="50" y={top-107} width="900" height="107" viewBox="0 0 200 150" preserveAspectRatio="none"><GatheringTop/></svg>:null}
{layers.map(({id,source,row,index,y,height})=><g key={id}>
<svg x="50" y={y} width="900" height={height} viewBox={`${solidFace?220:0} ${rows[row]} ${solidFace?1330:1672} ${rows[row+1]-rows[row]}`} preserveAspectRatio="none">{[0,1,2].map(side=><image key={side} href={photo(side)} width="1672" height="941" opacity={Math.max(0,1-Math.abs(view-side))}/>)}</svg>
{showPainting&&view>1?<><defs><mask id={`${paintId}-paper-${id}`} x="50" y={y} width="900" height={height} maskUnits="userSpaceOnUse" style={{maskType:'alpha'}}><svg x="50" y={y} width="900" height={height} viewBox={`0 ${rows[row]} 1672 ${rows[row+1]-rows[row]}`} preserveAspectRatio="none">{[0,1,2].map(side=><image key={side} href={photo(side)} width="1672" height="941" opacity={Math.max(0,1-Math.abs(view-side))}/>)}</svg></mask></defs><g opacity={Math.min(1,view-1)} mask={`url(#${paintId}-paper-${id})`}><svg x="50" y={y} width="900" height={height} viewBox={`0 ${source<6?originalTop[source]:(source%2)*110} 900 ${height}`} preserveAspectRatio="none" style={{mixBlendMode:'multiply'}}>{source<6?<HiddenDoorPainting/>:<OtherBookPainting variant={source<8?0:1}/>}</svg></g></>:null}
{blanks.includes(index)?<svg x="50" y={y+height} width="900" height={unit} viewBox="0 415 1672 107" preserveAspectRatio="none"><image href={photo(1)} width="1672" height="941"/></svg>:null}
{selected===index?<rect x="55" y={y+1} width="890" height={height-2} fill="none" stroke="#d2b57a" strokeWidth="1.3" opacity=".7"/>:null}
{onOrder?<g role="button" tabIndex={0} aria-label={`${index+1}番目の束を入れ替える`} className="r-paper-grab" onPointerDown={e=>{drag.current={index,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerCancel={()=>{drag.current=null}} onPointerUp={e=>{if(drag.current?.index!==index)return;const delta=e.clientY-drag.current.y;drag.current=null;if(Math.abs(delta)>20){const next=[...order],to=Math.max(0,Math.min(5,index+(delta>0?1:-1)));[next[index],next[to]]=[next[to],next[index]];onOrder(next);setSelected(null)}else choose(index)}} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();choose(index)}}}><rect className="r-paper-hit" x="75" y={y-Math.max(0,30-height)/2} width="850" height={Math.max(30,height)}/></g>:null}
</g>)}
</svg>{onView?<div className="r-edge-views" aria-label="傾ける方向">{[0,1,2].map(n=><button key={n} aria-label={['左へ傾ける','まっすぐに戻す','右へ傾ける'][n]} aria-pressed={view===n} onClick={()=>{onView(n);setSelected(null)}}><Icon name={n===0?'left':n===1?'eye':'right'}/></button>)}</div>:null}</div>;
}
