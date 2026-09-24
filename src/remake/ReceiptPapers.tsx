import {useRef} from 'react';
import {ReceiptSeal} from './ReceiptSeal';
import type {World,Action} from './campaign';
const correct=[0,2,1];
const rows=[{name:'受付',digits:['4','27','0'],dy:-34},{name:'作業',digits:['2','63','5'],dy:34},{name:'返却',digits:['9','18','6'],dy:0}];
/** Copies move physically; reading them never unlocks or gates the cabinet. */
export function ReceiptPapers({g,act,interactive=true}:{g:World;act:(a:Action)=>void;interactive?:boolean}){
const drag=useRef<{index:number;y:number}|null>(null),steps=g.itemValues.receipts??[0,0,0];
const change=(i:number,delta:number)=>{const values=[...steps];values[i]=(values[i]+delta+3)%3;act({type:'item-arrange',item:'receipts',values})};
return <svg className="r-receipt-papers" viewBox="0 0 1040 430" aria-label="三枚の複写控え" role="group">{steps.map((n,i)=>{
const x=10+i*330,y=85+n*26,base=175-correct[i]*26;
return <g key={i} transform={`translate(${x} ${y})`} role={interactive?'button':undefined} tabIndex={interactive?0:-1} aria-label={`${i+1}枚目の控えをずらす`} className="r-paper-grab"
onPointerDown={e=>{drag.current={index:i,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}}
onPointerUp={e=>{if(drag.current?.index===i){change(i,e.clientY-drag.current.y< -10?-1:1);drag.current=null}}}
onPointerCancel={()=>{drag.current=null}}
onKeyDown={e=>{if(['Enter',' ','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();change(i,e.key==='ArrowUp'?-1:1)}}}>
<image href={import.meta.env.BASE_URL+'remake/items/receipt-single.webp'} width="380" height="250" preserveAspectRatio="none"/>
<g className="r-paper-ink" fontFamily="serif" fill="#3b342b"><text x="70" y="43" fontSize="15">第 二 六 号</text>{rows.map((r,k)=><g key={r.name} transform={`translate(0 ${base+r.dy})`}>
<path d="M 18 0 H 73 M 102 0 H 182 M 236 0 H 361" fill="none" stroke="#564839" strokeWidth="1"/>
{i===0?<text x="40" y="-9" fontSize="14">{r.name}</text>:null}<text x="145" y="-8" fontSize="25" letterSpacing="25">{r.digits[i]}</text>
{i>0?<svg x="12" y="-14" width="18" height="28" viewBox="0 -14 18 28" overflow="hidden" style={{color:'#564839'}}><ReceiptSeal row={k}/></svg>:null}
{i<2?<svg x="324" y="-14" width="18" height="28" viewBox="-18 -14 18 28" overflow="hidden" style={{color:'#564839'}}><ReceiptSeal row={k}/></svg>:<path d="M346 -5l10 5-10 5" fill="none" stroke="#564839" strokeWidth="1.4"/>}
</g>)}</g>{interactive?<rect className="r-paper-hit" width="380" height="250"/>:null}</g>})}</svg>;
}
