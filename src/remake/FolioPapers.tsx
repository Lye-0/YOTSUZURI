import {useRef} from 'react';
import {foldPages,folioMarks} from '../mechanics';
import {PrintedMark} from './PrintedMark';
import type {World,Action} from './campaign';
const photo=(n:string)=>import.meta.env.BASE_URL+`remake/items/${n}.webp`;
const faces=[[[8,1],[2,7]],[[6,3],[4,5]]];
const joins=[76,136,55,168,97,38,153,112,76];
function PageInk({page,width=260,height=220}:{page:number;width?:number;height?:number}){
const entry=joins[page-1],leave=joins[page],mid=(entry+leave)/2;
return <g transform={`scale(${width/260} ${height/220})`} style={{color:'#544534',mixBlendMode:'multiply',opacity:.8}}>
<path d={`M0 ${entry} C60 ${entry},70 ${mid},108 ${mid} M152 ${mid} C190 ${mid},205 ${leave},260 ${leave}`} fill="none" stroke="currentColor" strokeWidth="1.8"/>
<PrintedMark n={folioMarks[page-1]} x={130} y={page%2?mid:mid+55} size={36}/>
{page%2===0?<path d={`M108 ${mid}H152`} stroke="currentColor" fill="none" strokeWidth="1.8"/>:null}
{page===1?<><path d="M204 20l7 5-5 7 9 3-4 8" stroke="currentColor" fill="none" strokeWidth="2"/><circle cx="8" cy={entry} r="4" fill="currentColor"/></>:null}
</g>;
}
export function FolioPapers({g,act}:{g:World;act:(a:Action)=>void}){
// outer A, flipped A/B, folded A/B, spread, assembled, selected folded sheet.
const v=g.itemValues.folios??[0,0,1,0,0,0,0,0],drag=useRef<{i:number;x:number}|null>(null);
const set=(changes:Record<number,number>)=>{const values=[...v];for(const [k,n]of Object.entries(changes))values[+k]=n;act({type:'item-arrange',item:'folios',values})};
const assemble=(outer:number)=>set({0:outer===0?1:0,5:0,6:1,7:0});
const key=(e:React.KeyboardEvent,fn:()=>void)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}};
if(v[6]){
const pages=foldPages(v[0],v[1],v[2]),spread=v[5]??0;
const shown=spread===0?[null,pages[0]]:spread===4?[pages[7],null]:[pages[spread*2-1],pages[spread*2]];
return <svg className="r-folio-papers" viewBox="0 0 1000 570" role="group" aria-label="折って重ねた冊子">{spread===0||spread===4?<><image href={photo('folio-folded')} x="325" y="140" width="350" height="250" preserveAspectRatio="none"/><g transform="translate(355 180)"><PageInk page={spread===0?pages[0]:pages[7]} width={290} height={180}/></g></>:<><image href={photo('folio-book')} x="80" y="125" width="840" height="300" preserveAspectRatio="none"/>{shown.map((p,i)=>p?<g key={i} transform={`translate(${i?500:125} 175)`}><PageInk page={p} width={375} height={205}/></g>:null)}</>}
<g role="button" tabIndex={0} aria-label="前の頁へ" onClick={()=>set({5:Math.max(0,spread-1)})} onKeyDown={e=>key(e,()=>set({5:Math.max(0,spread-1)}))}><rect className="r-paper-hit" x={spread===0||spread===4?325:80} y="125" width="100" height="300"/></g>
<g role="button" tabIndex={0} aria-label="頁をめくる" onClick={()=>set({5:Math.min(4,spread+1)})} onKeyDown={e=>key(e,()=>set({5:Math.min(4,spread+1)}))}><rect className="r-paper-hit" x={spread===0||spread===4?575:820} y="125" width="100" height="300"/></g>
<g role="button" tabIndex={0} aria-label="折り目から二枚を取り分ける" onClick={()=>set({6:0,3:0,4:0})} onKeyDown={e=>key(e,()=>set({6:0,3:0,4:0}))}><rect className="r-paper-hit" x={spread===0||spread===4?325:477} y="125" width="46" height="300"/></g></svg>;
}
return <svg className="r-folio-papers" viewBox="0 0 1000 660" role="group" aria-label="二枚の両面紙">{[0,1].map(i=>{
const folded=!!v[i+3],x=folded?175+i*440:85,y=folded?180:i*320+10,w=folded?230:830,h=folded?280:300;
const touch=()=>{if(!folded)set({[i+1]:v[i+1]?0:1});else if(v[7]&&v[7]!==i+1)assemble(i);else set({7:v[7]?0:i+1})};
return <g key={i} transform={`translate(${x} ${y-(v[7]===i+1?12:0)})`}>
{folded?<image href={photo('folio-folded')} x="0" y="60" width={w} height="160" preserveAspectRatio="none"/>:<image href={photo('folio-open')} width={w} height={h} preserveAspectRatio="none" transform={v[i+1]?`translate(${w} 0) scale(-1 1)`:undefined}/>}
{(folded?[faces[i][v[i+1]][1]]:faces[i][v[i+1]]).map((page,j)=><g key={j} transform={`translate(${folded?15:j*415+40} ${folded?80:25})`}><PageInk page={page} width={folded?200:340} height={folded?120:205}/></g>)}
<g role="button" tabIndex={0} aria-label={folded?`${i+1}枚目を重ねる`:`${i+1}枚目を裏返す`} className="r-paper-grab" onPointerDown={e=>{drag.current={i,x:e.clientX};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={e=>{if(drag.current?.i!==i)return;const moved=e.clientX-drag.current.x;drag.current=null;if(folded&&v[3]&&v[4]&&((i===0&&moved>50)||(i===1&&moved< -50)))assemble(i?0:1);else touch()}} onPointerCancel={()=>{drag.current=null}} onKeyDown={e=>key(e,touch)}><rect className="r-paper-hit" width={w} height={h}/></g>
{!folded?<g role="button" tabIndex={0} aria-label={`${i+1}枚目を折り目で閉じる`} onClick={()=>set({[i+3]:1})} onKeyDown={e=>key(e,()=>set({[i+3]:1}))}><rect className="r-paper-hit" x={w/2-24} y="10" width="48" height={h-20}/></g>:null}
</g>})}</svg>;
}
