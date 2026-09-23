import {useRef,useState} from 'react';
import {foldPages,folioMarks,folioFaces,foldedPages} from './folio';
import {PrintedMark} from './PrintedMark';
import type {World,Action} from './campaign';
const photo=(n:string)=>import.meta.env.BASE_URL+`remake/items/${n}.webp`;
const faces=folioFaces;
const joins=[76,136,55,168,97,38,153,112,76];
function PageInk({page,width=260,height=220}:{page:number;width?:number;height?:number}){
const entry=joins[page-1],leave=joins[page],mid=(entry+leave)/2;
return <g transform={`scale(${width/260} ${height/220})`} style={{color:'#544534',mixBlendMode:'multiply',opacity:.8}}>
<path d={`M0 ${entry} C60 ${entry},70 ${mid},108 ${mid} M152 ${mid} C190 ${mid},205 ${leave},260 ${leave}`} fill="none" stroke="currentColor" strokeWidth="1.8"/>
<PrintedMark n={folioMarks[page-1]} x={130} y={page%2?mid:mid+55} size={36}/>
{page%2===0?<path d={`M108 ${mid}H152`} stroke="currentColor" fill="none" strokeWidth="1.8"/>:null}
{page===1?<><path d="M204 20l7 5-5 7 9 3-4 8" stroke="currentColor" fill="none" strokeWidth="2"/><path d={`M2 ${entry-8}L16 ${entry}L2 ${entry+8}`} fill="none" stroke="currentColor" strokeWidth="2.5"/></>:null}
</g>;
}
export function FolioPapers({g,act,interactive=true}:{g:World;act:(a:Action)=>void;interactive?:boolean}){
// outer A, open-sheet faces A/B, folded A/B, spread, assembled, selected, folded backs A/B.
const v=g.itemValues.folios??[0,0,1,0,0,0,0,0],drag=useRef<{i:number;x:number;y:number}|null>(null),[offset,setOffset]=useState<{i:number;x:number;y:number}|null>(null);
const set=(changes:Record<number,number>)=>{if(!interactive)return;const values=Array.from({length:10},(_,i)=>v[i]??0);for(const [k,n]of Object.entries(changes))values[+k]=n;act({type:'item-arrange',item:'folios',values})};
const assemble=(outer:number)=>{if((v[8]??0)!==(v[9]??0))return;set({0:outer===0?1:0,5:0,6:1,7:0});};
const key=(e:React.KeyboardEvent,fn:()=>void)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}};
if(v[6]){
const pages=foldPages(v[0],v[1],v[2],v[8]??0,v[9]??0),rightBound=!!v[8],spread=v[5]??0;
let shown=spread===0?[null,pages[0]]:spread===4?[pages[7],null]:[pages[spread*2-1],pages[spread*2]];if(rightBound)shown=[...shown].reverse();
return <svg className="r-folio-papers" viewBox="0 0 1000 570" role="group" aria-label="折って重ねた冊子">{spread===0||spread===4?<><image href={photo('folio-folded')} x="325" y="140" width="350" height="250" preserveAspectRatio="none" transform={rightBound!==(spread===4)?'translate(1000 0) scale(-1 1)':undefined}/><g transform="translate(355 180)"><PageInk page={spread===0?pages[0]:pages[7]} width={290} height={180}/></g></>:<><image href={photo('folio-book')} x="80" y="125" width="840" height="300" preserveAspectRatio="none"/>{shown.map((p,i)=>p?<g key={i} transform={`translate(${i?500:125} 175)`}><PageInk page={p} width={375} height={205}/></g>:null)}</>}
<g role={interactive?'button':undefined} tabIndex={interactive?0:-1} aria-label="前の頁へ" onClick={()=>set({5:Math.max(0,spread-1)})} onKeyDown={e=>key(e,()=>set({5:Math.max(0,spread-1)}))}><rect className="r-paper-hit" x={rightBound?(spread===0||spread===4?575:820):(spread===0||spread===4?325:80)} y="125" width="100" height="300"/></g>
<g role={interactive?'button':undefined} tabIndex={interactive?0:-1} aria-label="頁をめくる" onClick={()=>set({5:Math.min(4,spread+1)})} onKeyDown={e=>key(e,()=>set({5:Math.min(4,spread+1)}))}><rect className="r-paper-hit" x={rightBound?(spread===0||spread===4?325:80):(spread===0||spread===4?575:820)} y="125" width="100" height="300"/></g>
<g role={interactive?'button':undefined} tabIndex={interactive?0:-1} aria-label="折り目から二枚を取り分ける" onClick={()=>set({6:0,3:0,4:0,8:0,9:0})} onKeyDown={e=>key(e,()=>set({6:0,3:0,4:0,8:0,9:0}))}><rect className="r-paper-hit" x={spread===0||spread===4?325:477} y="125" width="46" height="300"/></g></svg>;
}
return <svg className="r-folio-papers" viewBox={v[3]&&v[4]?"200 0 640 660":"0 0 1000 660"} role="group" aria-label="二枚の両面紙">{(offset?.i===0?[1,0]:[0,1]).map(i=>{
const folded=!!v[i+3],x=folded?292.5:85,y=i*320+10,w=folded?415:830,h=300;
const selected=v[7]===i+1,otherSelected=!!v[7]&&!selected,bothFolded=!!v[3]&&!!v[4];
const touch=()=>{if(!folded)set({[i+1]:v[i+1]?0:1});else if(v[7]&&v[7]!==i+1)assemble(i);else set({7:v[7]?0:i+1})};
return <g key={i} data-folio={i} className={'folio-sheet'+(selected?' folio-selected':'')} style={{transform:`translate(${x+(offset?.i===i?offset.x:0)}px,${y+(offset?.i===i?offset.y:0)}px)`,transition:offset?'none':undefined}}>
{folded?<image href={photo('folio-folded')} x="0" y="0" width={w} height={h} preserveAspectRatio="none" transform={v[i+8]?`translate(${w} 0) scale(-1 1)`:undefined}/>:<image href={photo('folio-open')} width={w} height={h} preserveAspectRatio="none" transform={v[i+1]?`translate(${w} 0) scale(-1 1)`:undefined}/>}
{(folded?[foldedPages(i,v[i+1],v[i+8]??0)[0]]:faces[i][v[i+1]]).map((page,j)=><g key={j} transform={`translate(${folded?40:j*415+40} ${folded?40:25})`}><PageInk page={page} width={folded?335:340} height={folded?220:205}/></g>)}
<g role={interactive?'button':undefined} tabIndex={interactive?0:-1} aria-label={folded?`${i+1}枚目を重ねる`:`${i+1}枚目を裏返す`} className="r-paper-grab" onPointerDown={e=>{if(!interactive)return;drag.current={i,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const d=drag.current;if(d?.i!==i||!folded||!bothFolded)return;const scale=e.currentTarget.ownerSVGElement!.getScreenCTM()!.a;setOffset({i,x:(e.clientX-d.x)/scale,y:(e.clientY-d.y)/scale})}} onPointerUp={e=>{const d=drag.current;if(d?.i!==i)return;drag.current=null;setOffset(null);const target=e.currentTarget.ownerSVGElement!.querySelector(`[data-folio="${1-i}"]`)!.getBoundingClientRect();const moved=Math.hypot(e.clientX-d.x,e.clientY-d.y);if(folded&&bothFolded&&moved>12&&e.clientX>=target.left&&e.clientX<=target.right&&e.clientY>=target.top&&e.clientY<=target.bottom)assemble(1-i);else if(moved<12)touch()}} onPointerCancel={()=>{drag.current=null;setOffset(null)}} onKeyDown={e=>key(e,touch)}><path className="r-paper-hit" d={folded?`M0 0H${w}V${h}H0Z`:`M0 0H${w/2-28}V${h}H0Z M${w/2+28} 0H${w}V${h}H${w/2+28}Z`}/></g>
{folded&&interactive?<g className="folio-sheet-actions"><g role="button" tabIndex={0} aria-label={`${i+1}枚目を開く`} onClick={()=>set({[i+3]:0,[i+8]:0,7:0})} onKeyDown={e=>key(e,()=>set({[i+3]:0,[i+8]:0,7:0}))}><rect className="r-paper-hit" x="-86" y="112" width="80" height="44"/><text x="-46" y="139" textAnchor="middle" fill="#e7d8ae" fontSize="17">開く</text></g><g role="button" tabIndex={0} aria-label={`${i+1}枚目を裏返す`} onClick={()=>set({[i+8]:v[i+8]?0:1,7:0})} onKeyDown={e=>key(e,()=>set({[i+8]:v[i+8]?0:1,7:0}))}><rect className="r-paper-hit" x={w+6} y="112" width="80" height="44"/><text x={w+46} y="139" textAnchor="middle" fill="#e7d8ae" fontSize="17">裏返す</text></g></g>:null}
{folded&&bothFolded&&interactive&&otherSelected?<g pointerEvents="none" className="folio-drop-cue"><rect x="8" y="12" width={w-16} height={h-24} rx="6"/><text x={w/2} y="262" textAnchor="middle">{(v[8]??0)===(v[9]??0)?'選んだ紙をこの中へ重ねる':'折り目の側をそろえる'}</text></g>:null}
{selected&&interactive?<rect pointerEvents="none" className="folio-selection" x="6" y="8" width={w-12} height={h-16} rx="6"/>:null}
{!folded?<g role={interactive?'button':undefined} tabIndex={interactive?0:-1} aria-label={`${i+1}枚目を折り目で閉じる`} onClick={()=>set({[i+3]:1})} onKeyDown={e=>key(e,()=>set({[i+3]:1}))}><rect className="r-paper-hit" x={w/2-24} y="10" width="48" height={h-20}/></g>:null}
</g>})}{v[3]&&v[4]&&(v[8]??0)!==(v[9]??0)?<text x="500" y="651" textAnchor="middle" fill="#e7d8ae" fontSize="16">折り目の側をそろえて重ねる</text>:null}</svg>;
}
