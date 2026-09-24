import {PrintedMark} from './PrintedMark';
import type {World,Action} from './campaign';
const outlines=['136,148 358,148 325,365 42,365','384,148 619,148 646,365 355,365','642,148 867,148 961,365 679,365'];
const centers=[200,501,802];
export function ProofPapers({g,act,enabled=true}:{g:World;act:(a:Action)=>void;enabled?:boolean}){
return <svg className="r-proof-papers" viewBox="0 0 1000 562.8" preserveAspectRatio="none" role="group" aria-label="三枚の試し刷り"><defs>{outlines.map((p,i)=><clipPath id={'paper-proof-'+i} key={i}><polygon points={p}/></clipPath>)}</defs>{outlines.map((p,i)=>{
const flipped=!!g.flags[`paper:6:${i}`],front=i===1?flipped:!flipped;
return <g key={i} transform={flipped?`translate(${centers[i]*2} 0) scale(-1 1)`:undefined}>
<image href={import.meta.env.BASE_URL+'remake/closeups/p06-loose.webp'} width="1000" height="562.8" clipPath={`url(#paper-proof-${i})`}/>
<g transform={`translate(${centers[i]} 248) scale(${i===1?-1:1} 1)`} style={{color:'#564635',opacity:front?.84:.32,mixBlendMode:'multiply'}}><PrintedMark n={i===2?2:3} size={70}/><path d="M-70 52C-28 39 26 66 67 42M-70 58C-28 45 26 72 67 48" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M-38 -52l9 4 -3 8 12 4" fill="none" stroke="currentColor" strokeWidth="1.8"/></g>
<g role="button" tabIndex={enabled?0:-1} aria-label={`${i+1}枚目の試し刷りを裏返す`} onClick={()=>enabled&&act({type:'p-paper',id:6,index:i})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-paper',id:6,index:i})}}}><polygon points={p} className="r-paper-hit"/></g>
</g>})}</svg>;
}
