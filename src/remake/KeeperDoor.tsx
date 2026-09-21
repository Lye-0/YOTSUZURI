import {useId,useState,type PointerEvent} from 'react';
import {PhotoSprite} from './PhotoSprite';
import {PhotoControl} from './PhotoControl';
import {keeperValues} from './keeper';
import type {World,Action} from './campaign';
const rows=[216,383,550];
export function KeeperDoor({g,act,wide=false,enabled=true,zoom=false,onZoom}:{g:World;act:(a:Action)=>void;wide?:boolean;enabled?:boolean;zoom?:boolean;onZoom?:(v:boolean)=>void}){
 const id=useId().replace(/:/g,''),v=keeperValues(g),count=v.slice(3).filter(Boolean).length,leaf=!!g.flags['keeper:leaf'],open=g.opened.includes(15),base=import.meta.env.BASE_URL+'remake/';
 const [grab,setGrab]=useState<{index:number;start:number;dy:number}|null>(null);
 const sourceY=(e:PointerEvent<SVGGElement>)=>{const m=e.currentTarget.ownerSVGElement!.getScreenCTM();return m?new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()).y:e.clientY;};
 const down=(e:PointerEvent<SVGGElement>,index:number)=>{if(!enabled||leaf)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);setGrab({index,start:sourceY(e),dy:0});};
 const move=(e:PointerEvent<SVGGElement>)=>{if(!grab)return;const dy=sourceY(e)-grab.start,position=v[grab.index]+Math.sign(dy),free=position>=0&&position<3&&!v.slice(0,3).some((p,i)=>i!==grab.index&&!v[i+3]&&p===position);setGrab({...grab,dy:Math.sign(dy)*Math.min(Math.abs(dy),free?167:16)});};
 const up=(e:PointerEvent<SVGGElement>)=>{if(!grab)return;const dy=sourceY(e)-grab.start,index=grab.index;setGrab(null);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(Math.abs(dy)>60)act({type:'p-keeper-slide',id:15,index,position:v[index]+Math.sign(dy)});else act({type:'p-keeper-pull',id:15,index});};
 return <svg className="r-keeper-door" style={{touchAction:'none'}} viewBox={wide?'0 0 1672 941':zoom?'900 530 270 300':'430 0 1000 930'} preserveAspectRatio="none" role="group" aria-label="保守戸の逃げ溝と三つの留め">
 <defs><clipPath id={id+'metal'}><rect x={open?1120:leaf?906:912} y="49" width={open?290:leaf?505:267} height="757" rx="7"/></clipPath><clipPath id={id+'knob'}><ellipse cx="581" cy="754" rx="122" ry="126"/></clipPath><clipPath id={id+'lip'}><path d="M928 694Q1014 710 1100 691L1095 738H934Z"/></clipPath>{v.slice(0,3).map((position,i)=><clipPath key={i} id={id+'pin'+i}><rect x="996" y={145-(grab?.index===i?grab.dy:0)} width="31" height="462"/><circle cx="1011" cy={383-(grab?.index===i?grab.dy:0)} r="47"/><ellipse cx="1010" cy={rows[position]+28} rx="24" ry="23"/><rect x="998" y={rows[position]+2} width="23" height="31"/></clipPath>)}</defs>
 <g transform={wide?'translate(874 381) scale(.09)':undefined}>
 <defs><clipPath id={id+'tray-photo'}><rect x="917" y="563" width="187" height="181"/></clipPath></defs>
 {!wide?<image href={base+'closeups/p15-keeper-base.webp'} width="1672" height="941"/>:!open?<image href={base+'closeups/p15-keeper-base.webp'} width="1672" height="941" clipPath={`url(#${id}knob)`}/>:null}
 {(wide||leaf)?<image href={base+`closeups/p15-keeper-${leaf?'open':'base'}.webp`} width="1672" height="941" clipPath={`url(#${id}metal)`}/>:null}
 {!leaf?<>
 {count>0?<image href={base+`closeups/p15-tray-${count}.webp`} width="1672" height="941" clipPath={`url(#${id}tray-photo)`}/>:null}
 {v.slice(0,3).map((position,i)=>v[i+3]?null:<g key={i} transform={`translate(0 ${grab?.index===i?grab.dy:0})`}>
 <g clipPath={`url(#${id}pin${i})`}><PhotoSprite name="keeper-pin-front" x={969} y={rows[position]-33} width={82} height={80}/></g>
 {!wide?<g role="button" aria-label={`${['上','中央','下'][i]}の留めを動かす`} tabIndex={enabled?0:-1} aria-disabled={!enabled} onPointerDown={e=>down(e,i)} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>setGrab(null)} onKeyDown={e=>{if(!enabled)return;if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();act({type:'p-keeper-slide',id:15,index:i,position:position+(e.key==='ArrowUp'?-1:1)});}else if(e.key==='Enter'||e.key===' '){e.preventDefault();act({type:'p-keeper-pull',id:15,index:i});}}}><rect className="r-paper-hit" x="943" y={rows[position]-64} width="135" height="128"/></g>:null}
 </g>)}
 {!wide&&zoom&&count>0?<PhotoControl label="留めを一つ溝へ戻す" rect={[926,608,174,116]} enabled={enabled} onActivate={()=>act({type:'p-keeper-return',id:15,index:v.slice(3).findIndex(Boolean)})}/>:null}
 {!wide&&!zoom?<PhotoControl label="受け皿をのぞく" rect={[915,615,195,125]} enabled={enabled} onActivate={()=>onZoom?.(true)}/>:null}
 </>:null}
 </g>
 {wide&&open?<g transform="matrix(.023 0 0 .075 731 392)"><image href={base+'closeups/p15-keeper-base.webp'} width="1672" height="941" clipPath={`url(#${id}knob)`}/></g>:null}
 {!wide?<>
 <PhotoControl label={leaf?'留め板を戻す':'留め板を開く'} rect={leaf?[1180,89,184,537]:[906,80,76,520]} enabled={enabled} onActivate={()=>act({type:'p-keeper-leaf',id:15})}/>
 <PhotoControl label="保守戸の取っ手を回す" rect={[445,624,286,270]} enabled={enabled} onActivate={()=>act({type:'p-open',id:15})}/>
 </>:null}
 </svg>;
}
