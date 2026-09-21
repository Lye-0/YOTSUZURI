import {useId} from 'react';
import {interlockMask} from './interlock';
import {canMoveRing} from './linkedRings';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl} from './PhotoControl';
import type {World,Action} from './campaign';
const centers=[462,840,1218];
export function InterlockBox({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
 const uid=useId().replace(/:/g,''),mask=interlockMask(g),open=g.opened.includes(11),base=import.meta.env.BASE_URL+'remake/';
 return <svg className="r-interlock" viewBox={wide?'0 0 1672 941':'285 20 1100 921'} preserveAspectRatio="none" role="group" aria-label="留め輪の小箱">
 <defs><clipPath id={uid+'case'}><path d="M236 411H1446L1517 564V774H165V558Z"/>{centers.map(c=><rect key={c} x={c-69} y="675" width="138" height="142"/>)}{open?<rect x="232" y="46" width="1228" height="378" rx="15"/>:null}</clipPath><clipPath id={uid+'lid'}><rect x="154" y="42" width="1370" height="592"/></clipPath>
 {centers.map((c,i)=><g key={i}><clipPath id={uid+'handle'+i}><rect x={c-68} y="674" width="136" height="144"/></clipPath><clipPath id={uid+'window'+i}><rect x={c-86} y="646" width="172" height="19" rx="8"/></clipPath></g>)}
 </defs>
 <g transform={wide?'matrix(.16 0 0 .16 442.8 413.9)':undefined} clipPath={wide?`url(#${uid}case)`:undefined}>
 <image href={base+'closeups/p11-closed.webp'} width="1672" height="941"/>
 {open?<image href={base+'closeups/p11-open-empty.webp'} width="1672" height="941" clipPath={`url(#${uid}lid)`}/>:null}
 {centers.map((c,i)=><g key={i}>
 {!(mask&(1<<i))?<image href={base+'closeups/p11-pulled.webp'} width="1672" height="941" clipPath={`url(#${uid}handle${i})`}/>:null}
 <g clipPath={`url(#${uid}window${i})`}>
 <PhotoSprite name="steel-pin" x={c-5.5} y={mask&(1<<i)?639:679} width={11} height={35}/>
 <g transform={`translate(${c+(canMoveRing(mask,i)?-155:-90)} 655.5) rotate(-90)`}><PhotoSprite name="steel-pin" x={-5} y={0} width={10} height={135}/></g>
 </g>
 {!wide&&!open?<PhotoControl label={`${i+1}番目の輪を${mask&(1<<i)?'引く':'押し戻す'}`} rect={[c-80,677,160,141]} enabled={enabled} onActivate={()=>act({type:'p-loop',id:11,index:i})}/>:null}
 </g>)}
 {open&&!g.collected.includes('pin')?<g transform="rotate(-22 850 509)" style={{filter:'drop-shadow(1px 3px 1px #0007)'}}><PhotoSprite name="pin" group="items" x={795} y={486} width={110} height={45}/></g>:null}
 {!wide?open?!g.collected.includes('pin')?<PhotoControl label="紙止めのピンを取る" rect={[744,458,185,164]} enabled={enabled} onActivate={()=>act({type:'p-take',id:11,item:'pin'})}/>:null:<PhotoControl label="小箱の蓋を持ち上げる" rect={[550,519,590,108]} enabled={enabled} onActivate={()=>act({type:'p-open',id:11})}/>:null}
 </g></svg>;
}
