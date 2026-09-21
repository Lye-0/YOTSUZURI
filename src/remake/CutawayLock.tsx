import {cutawayOpen} from './cutaway';
import {value,type World,type Action} from './campaign';
const receivers=[2,1,4],centers=[574,740,906];
const path=(name:string,group='parts')=>import.meta.env.BASE_URL+`remake/${group}/${name}.webp`;
function Metal({kind,x,y,width,height}:{kind:'steel'|'brass';x:number;y:number;width:number;height:number}){const steel=kind==='steel';return <svg x={x} y={y} width={width} height={height} viewBox={steel?'355 40 177 1691':'351 95 320 1357'} preserveAspectRatio="none"><image href={path(steel?'steel-pin':'key-blade')} width={steel?887:1024} height={steel?1774:1536}/></svg>}
export function CutawayLock({g,act,enabled=true}:{g:World;act:(a:Action)=>void;enabled?:boolean}){
const v=value(g,27),aligned=v.every((n,i)=>n+receivers[i]===5),open=cutawayOpen(g);
return <svg className="r-cutaway" viewBox="380 70 1292 760" role="group" aria-label="断面の見える錠の模型">
<image href={path('p27-close','closeups')} width="1672" height="941"/>
<defs><clipPath id="model-handle"><rect x="1112" y="211" width="560" height="183"/></clipPath>{centers.map((x,i)=><clipPath id={'pin-channel-'+i} key={i}><rect x={x-34} y="112" width="68" height="413"/></clipPath>)}</defs>
{open?<image href={path('p27-open','closeups')} width="1672" height="941" clipPath="url(#model-handle)"/>:null}
{centers.map((x,i)=>{const contact=525-v[i]*40,joint=contact-receivers[i]*40;return <g key={i} clipPath={`url(#pin-channel-${i})`} style={{filter:'brightness(.82)'}}>
<Metal kind="steel" x={x-31} y={joint-592} width={62} height={592}/>
<Metal kind="brass" x={x-31} y={joint+1} width={62} height={receivers[i]*40-2}/>
<Metal kind="steel" x={x-31} y={contact+1} width={62} height={592}/>
</g>})}
{centers.map((x,i)=><g key={i} role="button" tabIndex={enabled?0:-1} aria-label={`${i+1}本目を持ち上げる`} onClick={()=>{if(enabled){act({type:'p-cutaway-screw',id:27,index:i})}}} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-cutaway-screw',id:27,index:i})}}}><rect className="r-paper-hit" x={x-60} y="600" width="120" height="90"/></g>)}
<g role="button" tabIndex={enabled?0:-1} aria-label="錠の取っ手を引く" onClick={()=>enabled&&act({type:'p-cutaway-bolt',id:27})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-cutaway-bolt',id:27})}}}><rect className="r-paper-hit" x="1360" y="228" width="263" height="135"/></g>
</svg>;
}
