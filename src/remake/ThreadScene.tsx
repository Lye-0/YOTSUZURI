import {useId} from 'react';
import {threadOrder,threadProgress,threadPhoto} from './threading';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl} from './PhotoControl';
import {ProjectedSurface} from './ProjectedSurface';
import {Icon} from './Icons';
import type {World,Action} from './campaign';
const rows=[288,365,442,521,610];
function ThreadCanvas({g,act,enabled,zoom,onZoom,wide=false}:{g:World;act:(a:Action)=>void;enabled:boolean;zoom:boolean;onZoom?:(zoom:boolean)=>void;wide?:boolean}){
 const uid=useId().replace(/:/g,''),progress=threadProgress(g),back=!!g.flags['thread:back'],removed=threadOrder.slice(0,progress),base=import.meta.env.BASE_URL+'remake/';
 return <svg className="r-thread-canvas" viewBox={wide?'0 180 1672 761':zoom?'530 220 690 550':'0 0 1672 941'} preserveAspectRatio="none" role="group" aria-label="綴じ見本">
 <defs>
 {rows.map((y,i)=><clipPath key={i} id={uid+'row'+i}><rect x="795" y={y-13} width="85" height="27"/></clipPath>)}
 <clipPath id={uid+'ends'}><path d="M0 275H382L312 672H0Z M1320 430H1672V850H1360V760Z"/></clipPath>
 <filter id={uid+'soft'}><feGaussianBlur stdDeviation="2"/></filter><mask id={uid+'table'} maskUnits="userSpaceOnUse" x="0" y="180" width="1672" height="761"><g filter={`url(#${uid}soft)`}><path d="M396 210L800 200L837 213L876 200L1275 198L1363 764L850 776L835 760L812 776L295 766Z" fill="white"/>{progress<5?<g fill="none" stroke="white" strokeWidth="48" strokeLinecap="round"><path d="M380 327C270 286 215 353 270 413C282 440 251 476 216 465C179 444 160 443 132 449C96 450 40 486 30 560C57 603 74 623 163 640"/><path d="M1313 456C1400 470 1349 557 1440 582C1525 599 1575 571 1606 645Q1620 675 1595 695"/><path d="M1400 811L1609 681" strokeWidth="16"/></g>:null}</g></mask>
 </defs>
 <g>
 <g mask={wide?`url(#${uid}table)`:undefined}>
 <image href={base+'closeups/'+threadPhoto(g)+'.webp'} width="1672" height="941"/>
 {!back&&progress<5?removed.map(i=><image key={i} href={base+'closeups/p13-front-empty.webp'} width="1672" height="941" clipPath={`url(#${uid}row${i})`}/>):null}
 {back&&progress<5?<image href={base+'closeups/p13-front.webp'} width="1672" height="941" clipPath={`url(#${uid}ends)`}/>:null}
 </g>
 <image href={base+`parts/thread-anchor-${progress===5?'empty':'tied'}.webp`} x="289.5" y={progress===5?298.8:299.5} width="81.4" height={progress===5?57.4:54.3} preserveAspectRatio="none"/>
 {progress===5&&!g.collected.includes('needle')?<PhotoSprite name="needle" group="items" x={1390} y={681} width={235} height={134}/>:null}
 {progress===5&&!g.collected.includes('thread')?<PhotoSprite name="thread" group="items" x={48} y={421} width={282} height={190}/>:null}
 </g>
 {!wide?<>
 {zoom&&progress<5?rows.map((y,i)=>removed.includes(i)?null:<PhotoControl key={i} label={`${i+1}段目の縫い目を引く`} rect={[758,y-35,153,71]} enabled={enabled} onActivate={()=>{act({type:'p-thread-pull',id:13,station:i});if(progress===4&&i===threadOrder[4])onZoom?.(false);}}/>):null}
 {!zoom?<PhotoControl label="縫い目へ近づく" rect={[560,220,620,520]} enabled={enabled} onActivate={()=>onZoom?.(true)}/>:null}
 {!zoom&&progress<5?<PhotoControl label="針につながる糸を見る" rect={[1370,655,272,178]} enabled={enabled} onActivate={()=>onZoom?.(true)}/>:null}
 {progress===5&&!zoom?<>
 {!g.collected.includes('needle')?<PhotoControl label="綴じ針を取る" rect={[1370,655,272,178]} enabled={enabled} onActivate={()=>act({type:'p-take',id:13,item:'needle'})}/>:null}
 {!g.collected.includes('thread')?<PhotoControl label="ほどいた糸を取る" rect={[36,402,310,220]} enabled={enabled} onActivate={()=>act({type:'p-take',id:13,item:'thread'})}/>:null}
 </>:null}
 </>:null}
 </svg>;
}
export function ThreadScene({g,act,enabled=true,wide=false,zoom=false,onZoom}:{g:World;act:(a:Action)=>void;enabled?:boolean;wide?:boolean;zoom?:boolean;onZoom?:(zoom:boolean)=>void}){
 if(wide)return <ProjectedSurface quad={[[675,475],[1005,475],[1055,541],[623,541]]} width={1672} height={761}><ThreadCanvas g={g} act={act} enabled={false} zoom={false} wide/></ProjectedSurface>;
 return <><ThreadCanvas g={g} act={act} enabled={enabled} zoom={zoom} onZoom={onZoom}/><button className="r-thread-flip" aria-label="綴じ見本を裏返す" aria-pressed={!!g.flags['thread:back']} disabled={!enabled} onClick={()=>act({type:'p-thread-flip',id:13})}><svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 10A11 11 0 0 1 26 14M25 6l1 8-8-1M25 22A11 11 0 0 1 6 18M7 26l-1-8 8 1"/></svg></button>{onZoom?<button className="r-thread-zoom" aria-label={zoom?'本全体を見る':'縫い目へ近づく'} disabled={!enabled} onClick={()=>onZoom(!zoom)}><Icon name="inspect"/></button>:null}</>;
}
