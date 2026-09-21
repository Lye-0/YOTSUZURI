import {useId} from 'react';
import type {World} from './campaign';
import {cutawayValues,cutawayReceivers,cutawayOpen} from './cutaway';
const path=(id:string,group='parts')=>import.meta.env.BASE_URL+`remake/${group}/${id}.webp`;
export const modelPinCentres=[394,562,730];
function PinMetal({brass=false,x,y,width,height}:{brass?:boolean;x:number;y:number;width:number;height:number}){return <svg x={x} y={y} width={width} height={height} viewBox={brass?'351 95 320 1357':'355 40 177 1691'} preserveAspectRatio="none"><image href={path(brass?'key-blade':'steel-pin')} width={brass?1024:887} height={brass?1536:1774}/></svg>}
export function CutawayArt({g}:{g:World}){const id=useId(),v=cutawayValues(g),open=cutawayOpen(g);return <svg viewBox="21 26 1470 1029" width="100%" height="100%" preserveAspectRatio="none">
 <defs><clipPath id={id+'body'}><rect width="1164" height="1096"/></clipPath><clipPath id={id+'handle'}><rect x="1164" y="290" width="270" height="170"/></clipPath>{modelPinCentres.map((x,i)=><clipPath key={i} id={id+'channel'+i}><rect x={x-32} y="192" width="64" height="413"/></clipPath>)}</defs>
 <image href={path('model','parts/cutaway')} width="1435" height="1096" clipPath={`url(#${id}body)`}/>
 <g transform={`translate(${open?80:0} 0)`}><image href={path('model','parts/cutaway')} width="1435" height="1096" clipPath={`url(#${id}handle)`}/></g>
 {modelPinCentres.map((x,i)=>{const contact=605-v[i]*41,joint=contact-cutawayReceivers[i]*41;return <g key={i} clipPath={`url(#${id}channel${i})`} style={{filter:'brightness(.80)'}}><PinMetal x={x-30} y={joint-500} width={60} height={500}/><PinMetal brass x={x-30} y={joint+1} width={60} height={cutawayReceivers[i]*41-2}/><PinMetal x={x-30} y={contact+1} width={60} height={500}/></g>})}
 </svg>;}
