import {useRef,useState} from 'react';
import {BOOK_ORDER,BUNDLE_THICKNESS} from './book';
import {Icon} from './Icons';
const photo=(view:number)=>import.meta.env.BASE_URL+`remake/parts/book-edge-${view===0?'left':view===2?'right':'closed'}.webp`;
const rows=[199,304,415,522,625,735,853];
const unit=26;
const originalTop:number[]=[];let originalHeight=0;for(const id of BOOK_ORDER){originalTop[id]=originalHeight;originalHeight+=BUNDLE_THICKNESS[id]*unit;}
export const paintedJoin=(id:number)=>[110+originalTop[id]*.6,110+(originalTop[id]+BUNDLE_THICKNESS[id]*unit)*.6];
function HiddenDoorPainting(){return <g stroke="#464139" fill="none" strokeWidth="2.4" opacity=".74">
<path d="M110 0L312.8 338M122 0L324.8 338M75 306H855M365 306V40H690V306M379 306V53H676V306M379 112H676M379 255H676M408 72V92M408 146V166M408 219V239"/>
<path d="M650 53l-36 58 43 17-28 42M515 40Q540 12 564 40M690 138l32 22v28l-32 12M690 233l32 8v27l-32 9"/>
<circle cx="639" cy="205" r="10"/><path d="M640 205h-30v12M462 55V110M551 55V110M630 55V110M382 305l-20 23M676 305l24 23"/>
<path d="M720 40V306M730 40V306M60 80h60M77 95h54M78 150h88M112 201h70M131 254h80" strokeWidth="1" opacity=".5"/>
</g>}
export function ForeedgeBook({order,view,blanks=[],onOrder,onView,showPainting=true,surfaceOnly=false,solidFace=false}:{order:number[];view:number;blanks?:number[];onOrder?:(order:number[])=>void;onView?:(view:number)=>void;showPainting?:boolean;surfaceOnly?:boolean;solidFace?:boolean}){
const [selected,setSelected]=useState<number|null>(null),drag=useRef<{index:number;y:number}|null>(null);
const total=(order.reduce((s,id)=>s+BUNDLE_THICKNESS[id],0)+blanks.length)*unit,top=390-total;
let cursor=top;
const layers=order.map((id,index)=>{const y=cursor,height=BUNDLE_THICKNESS[id]*unit;cursor+=height+(blanks.includes(index)?unit:0);return{id,index,y,height}});
const choose=(index:number)=>{if(!onOrder)return;if(selected===null)setSelected(index);else{const next=[...order];[next[selected],next[index]]=[next[index],next[selected]];onOrder(next);setSelected(null)}};
return <div className="r-foreedge-book"><svg viewBox={surfaceOnly?`50 ${top} 900 ${total}`:'0 -130 1000 560'} preserveAspectRatio="none" role="group" aria-label="束を重ねた本の小口">
{!surfaceOnly?<svg x="50" y={top-107} width="900" height="107" viewBox="0 0 1672 199" preserveAspectRatio="none"><image href={photo(view)} width="1672" height="941"/></svg>:null}
{layers.map(({id,index,y,height})=><g key={id}>
<svg x="50" y={y} width="900" height={height} viewBox={`${solidFace?220:0} ${rows[id]} ${solidFace?1330:1672} ${rows[id+1]-rows[id]}`} preserveAspectRatio="none"><image href={photo(view)} width="1672" height="941"/></svg>
{showPainting&&view===2?<svg x="50" y={y} width="900" height={height} viewBox={`0 ${originalTop[id]} 900 ${height}`} preserveAspectRatio="none" style={{mixBlendMode:'multiply'}}><HiddenDoorPainting/></svg>:null}
{blanks.includes(index)?<svg x="50" y={y+height} width="900" height={unit} viewBox="0 415 1672 107" preserveAspectRatio="none"><image href={photo(1)} width="1672" height="941"/></svg>:null}
{selected===index?<rect x="55" y={y+1} width="890" height={height-2} fill="none" stroke="#d2b57a" strokeWidth="1.3" opacity=".7"/>:null}
{onOrder?<g role="button" tabIndex={0} aria-label={`${index+1}番目の束を入れ替える`} className="r-paper-grab" onPointerDown={e=>{drag.current={index,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerCancel={()=>{drag.current=null}} onPointerUp={e=>{if(drag.current?.index!==index)return;const delta=e.clientY-drag.current.y;drag.current=null;if(Math.abs(delta)>20){const next=[...order],to=Math.max(0,Math.min(5,index+(delta>0?1:-1)));[next[index],next[to]]=[next[to],next[index]];onOrder(next);setSelected(null)}else choose(index)}} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();choose(index)}}}><rect className="r-paper-hit" x="75" y={y-Math.max(0,30-height)/2} width="850" height={Math.max(30,height)}/></g>:null}
</g>)}
{blanks.includes(6)?<svg x="50" y={cursor} width="900" height={unit} viewBox="0 415 1672 107" preserveAspectRatio="none"><image href={photo(1)} width="1672" height="941"/></svg>:null}
</svg>{onView?<div className="r-edge-views" aria-label="傾ける方向">{[0,1,2].map(n=><button key={n} aria-label={['左へ傾ける','まっすぐに戻す','右へ傾ける'][n]} aria-pressed={view===n} onClick={()=>{onView(n);setSelected(null)}}><Icon name={n===0?'left':n===1?'eye':'right'}/></button>)}</div>:null}</div>;
}
