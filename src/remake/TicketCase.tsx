import {value,type World,type Action} from './campaign';
const bars=[
'464,199 1203,202 1203,249 1170,249 1170,313 1135,313 1135,279 501,278 501,238 464,238',
'500,289 1133,288 1133,320 1203,319 1203,367 501,367 501,402 465,402 465,320 500,320',
'501,386 1203,386 1203,431 1170,431 1170,458 464,458 464,402 501,402',
'500,480 1170,480 1170,432 1204,432 1204,552 501,552 501,572 465,572 465,518 500,518',
];
export function TicketCase({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
const v=value(g,1),photo=(n:string,group='closeups')=>import.meta.env.BASE_URL+`remake/${group}/${n}.webp`;
return <svg className={wide?'r-ticket-case-wide':'r-ticket-case'} viewBox="420 35 835 720" preserveAspectRatio="none" role="group" aria-label="重なった木札の収納"><defs>{bars.map((p,i)=><clipPath key={i} id={`ticket-bar-${wide?'wide':'close'}-${i}`}><polygon points={p}/></clipPath>)}<clipPath id={wide?"ticket-lip-wide":"ticket-lip-close"}><rect x="416" y="605" width="834" height="155"/></clipPath></defs>
{!wide?<image href={photo('p01-empty')} width="1672" height="941"/>:null}
{(['card-diamond','card-moon'] as const).map((item,i)=>!g.collected.includes(item)?<image key={item} href={photo(item,'items')} x={580+i*320} y="461" width="240" height="108" transform={`rotate(-90 ${700+i*320} 515)`}/>:null)}
{[2,1,3,0].map(i=>!v[i]?<image key={i} href={photo('p01-case')} width="1672" height="941" clipPath={`url(#ticket-bar-${wide?'wide':'close'}-${i})`}/>:null)}
{!wide?<image href={photo("p01-empty")} width="1672" height="941" clipPath="url(#ticket-lip-close)"/>:null}{!wide?bars.map((p,i)=>!v[i]?<g key={i} role="button" tabIndex={enabled?0:-1} aria-label={`${i+1}枚目の木札を抜く`} onClick={()=>enabled&&act({type:'p-release',id:1,index:i})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-release',id:1,index:i})}}}><polygon points={p} className="r-paper-hit"/></g>:null):null}
{!wide&&g.solved.includes(1)?(['card-diamond','card-moon'] as const).map((item,i)=>!g.collected.includes(item)?<g key={item} role="button" tabIndex={enabled?0:-1} aria-label={i?'三日月の札を取る':'菱形の札を取る'} onClick={()=>enabled&&act({type:'p-take',id:1,item})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-take',id:1,item})}}}><rect x={620+i*320} y="407" width="160" height="205" className="r-paper-hit"/></g>:null):null}
</svg>;
}
