import {useId} from 'react';
import type {World} from './campaign';
import {cutawayValues,cutawayReceivers,cutawayOpen} from './cutaway';
const path=(id:string,group='parts')=>import.meta.env.BASE_URL+`remake/${group}/${id}.webp`;
export const modelPinCentres=[394,562,730];
export const cutawayTravel=80;
function PinMetal({brass=false,x,y,width,height}:{brass?:boolean;x:number;y:number;width:number;height:number}){return <svg x={x} y={y} width={width} height={height} viewBox={brass?'351 95 320 1357':'355 40 177 1691'} preserveAspectRatio="none"><image href={path(brass?'key-blade':'steel-pin')} width={brass?1024:887} height={brass?1536:1774}/></svg>}
export function CutawayArt({g,kick=0}:{g:World;kick?:number}){
 const id=useId(),v=cutawayValues(g),open=cutawayOpen(g),model=path('model','parts/cutaway');
 return <svg viewBox="21 26 1470 1029" width="100%" height="100%" preserveAspectRatio="none">
 <defs>
 <mask id={id+'fixed'} maskUnits="userSpaceOnUse" x="0" y="0" width="1515" height="1096"><rect width="1515" height="1096" fill="white"/><path d="M198 400H938V787H198Z M938 300H966V460H938Z M966 326H1164V434H966Z M1164 290H1435V460H1164Z" fill="black"/></mask>
 <clipPath id={id+'carriage'}><path d="M198 400H938V787H198Z M938 300H966V460H938Z M966 326H1164V434H966Z M1164 290H1435V460H1164Z"/></clipPath>
 {modelPinCentres.map((x,i)=><clipPath key={i} id={id+'channel'+i}><rect x={x-32} y="192" width="64" height="413"/></clipPath>)}
 </defs>
 {/* Rear guide is exposed when the lower carriage leaves its seat. */}
 <PinMetal x={198} y={400} width={740} height={387}/>
 <path d="M201 414H937M201 774H937" stroke="#141613" strokeWidth="5"/>
 <image href={model} width="1435" height="1096" mask={`url(#${id}fixed)`}/>
 <g className="cutaway-carriage" style={{transform:`translateX(${open?cutawayTravel:0}px)`,transition:g.reducedMotion?'none':undefined}}>
 <g key={kick} className={kick&&!open?'cutaway-blocked':undefined}>
 <image href={model} width="1435" height="1096" clipPath={`url(#${id}carriage)`}/>
 {modelPinCentres.map((x,i)=>{const base=605-cutawayReceivers[i]*41;return <g key={i} clipPath={`url(#${id}channel${i})`}><g className="cutaway-lift" style={{transform:`translateY(${-v[i]*41}px)`,transition:g.reducedMotion?'none':undefined}}><PinMetal brass x={x-30} y={base+1} width={60} height={cutawayReceivers[i]*41-2}/><PinMetal x={x-30} y={606} width={60} height={500}/></g></g>})}
 </g></g>
 {/* The upper rods remain attached to the stationary housing, even on a failed pull. */}
 {modelPinCentres.map((x,i)=>{const base=605-cutawayReceivers[i]*41;return <g key={i} clipPath={`url(#${id}channel${i})`}><g className="cutaway-lift" style={{transform:`translateY(${-v[i]*41}px)`,transition:g.reducedMotion?'none':undefined}}><PinMetal x={x-30} y={base-500} width={60} height={500}/></g></g>})}
 </svg>;
}
