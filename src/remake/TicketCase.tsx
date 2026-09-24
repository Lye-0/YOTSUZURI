import {useEffect,useId,useRef,useState} from 'react';
import {value,type World,type Action} from './campaign';
import {PhotoSprite} from './PhotoSprite';
import {ticketSlats,ticketKeepers,ticketCanLift} from './ticketSlats';
export function TicketCase({g,act,wide=false,enabled=true}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean}){
 const v=value(g,1),uid=useId().replace(/:/g,''),[pull,setPull]=useState<{index:number;free:boolean}|null>(null),busy=useRef(false),photo=(n:string,group='closeups')=>import.meta.env.BASE_URL+`remake/${group}/${n}.webp`;
 useEffect(()=>{if(!pull)return;const timer=setTimeout(()=>{setPull(null);busy.current=false},g.reducedMotion?40:320);return()=>clearTimeout(timer)},[pull,g.reducedMotion]);
 const take=(index:number)=>{if(!enabled||busy.current||v[index])return;busy.current=true;const free=ticketCanLift(v,index);setPull({index,free});act({type:'p-release',id:1,index});};
 return <svg className={wide?'r-ticket-case-wide':'r-ticket-case'} viewBox="420 35 835 720" preserveAspectRatio="none" role="group" aria-label="引き手と重なった留め具のある札入れ" aria-busy={!!pull}>
 <defs><filter id={uid+'shadow'} x="-12%" y="-20%" width="124%" height="155%"><feDropShadow dx="0" dy="6" stdDeviation="3" floodColor="#100801" floodOpacity=".75"/></filter><filter id={uid+'metal-shadow'} x="-40%" y="-15%" width="180%" height="160%"><feDropShadow dx="3" dy="6" stdDeviation="2" floodColor="#130902" floodOpacity=".85"/></filter><clipPath id={uid+'lip'}><rect x="416" y="605" width="834" height="155"/></clipPath></defs>
 {!wide?<image href={photo('p01-empty')} width="1672" height="941"/>:null}
 {(['card-diamond','card-moon'] as const).map((item,i)=>!g.collected.includes(item)?<image key={item} href={photo(item,'items')} x={580+i*320} y="461" width="240" height="108" transform={`translate(0 -25) rotate(-90 ${700+i*320} 515)`}/>:null)}
 {[2,1,3,0].map(index=>{const present=!v[index]||pull?.index===index&&pull.free;if(!present)return null;const [x,y,w,h]=ticketSlats[index].rect,keeper=ticketKeepers.find(k=>k.owner===index);return <g key={index} className={pull?.index===index?(pull.free?'ticket-slat-lifting':'ticket-slat-blocked'):undefined}>
 <g pointerEvents="none" filter={`url(#${uid}shadow)`}><PhotoSprite name={`slat-${index}`} group="parts/ticket" x={x} y={y} width={w} height={h}/></g>
 {keeper?<g pointerEvents="none" transform={keeper.up?`rotate(180 ${keeper.rect[0]+keeper.rect[2]/2} ${keeper.rect[1]+keeper.rect[3]/2})`:undefined} filter={`url(#${uid}metal-shadow)`}><PhotoSprite name="keeper" group="parts/ticket" x={keeper.rect[0]} y={keeper.rect[1]} width={keeper.rect[2]} height={keeper.rect[3]}/></g>:null}
 {!wide&&!v[index]?<g role="button" tabIndex={enabled&&!pull?0:-1} aria-disabled={!enabled||!!pull} aria-label={`上から${index+1}枚目の板を手前に引く`} onClick={()=>take(index)} onKeyDown={e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();take(index)}}}><rect className="r-paper-hit" x={x} y={y-12} width={w} height={h+24}/></g>:null}
 </g>;})}
 {!wide?<image href={photo('p01-empty')} width="1672" height="941" clipPath={`url(#${uid}lip)`}/>:null}
 {!wide&&g.solved.includes(1)&&!pull?(['card-diamond','card-moon'] as const).map((item,i)=>!g.collected.includes(item)?<g key={item} role="button" tabIndex={enabled?0:-1} aria-disabled={!enabled} aria-label={i?'三日月の札を取る':'菱形の札を取る'} onClick={()=>enabled&&act({type:'p-take',id:1,item})} onKeyDown={e=>{if(enabled&&['Enter',' '].includes(e.key)){e.preventDefault();act({type:'p-take',id:1,item})}}}><rect x={620+i*320} y="407" width="160" height="205" className="r-paper-hit"/></g>:null):null}
 </svg>;
}
